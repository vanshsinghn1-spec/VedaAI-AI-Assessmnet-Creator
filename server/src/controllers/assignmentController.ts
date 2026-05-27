import { Request, Response } from 'express';
import Assignment from '../models/Assignment';
import { addGenerationJob } from '../queues/generationQueue';
import { getRedis } from '../config/redis';
import { generatePDF } from '../services/pdfService';
import { generateQuestionPaper } from '../services/aiService';
import { emitToAssignment } from '../socket';

// Create a new assignment and queue generation
export async function createAssignment(
  req: Request,
  res: Response
): Promise<void> {
  try {
    let {
      questionTypes,
      additionalInstructions,
      dueDate,
      subject,
      className,
      schoolName,
    } = req.body;

    // Parse questionTypes if it's a JSON string (from FormData)
    if (typeof questionTypes === 'string') {
      try {
        questionTypes = JSON.parse(questionTypes);
      } catch {
        res.status(400).json({
          success: false,
          error: 'Invalid questionTypes format',
        });
        return;
      }
    }

    // Validation
    if (!questionTypes || !Array.isArray(questionTypes) || questionTypes.length === 0) {
      res.status(400).json({
        success: false,
        error: 'At least one question type is required',
      });
      return;
    }

    for (const qt of questionTypes) {
      if (!qt.type || qt.count < 1 || qt.marksEach < 1) {
        res.status(400).json({
          success: false,
          error: 'Each question type must have a valid type, count (>= 1), and marks (>= 1)',
        });
        return;
      }
    }

    const totalMarks = questionTypes.reduce(
      (sum: number, qt: any) => sum + qt.count * qt.marksEach,
      0
    );

    // Handle file upload
    let fileUrl: string | undefined;
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
    }

    // Create assignment in MongoDB
    const assignment = await Assignment.create({
      questionTypes,
      additionalInstructions: additionalInstructions || '',
      dueDate: dueDate ? new Date(dueDate) : undefined,
      subject: subject || 'General',
      className: className || '5th',
      schoolName: schoolName || 'Delhi Public School, Sector-4, Bokaro',
      maximumMarks: totalMarks,
      fileUrl,
      status: 'pending',
    });

    // Process directly (bypassing BullMQ to avoid Upstash TLS silent hang)
    processDirectly(assignment._id.toString());

    res.status(201).json({
      success: true,
      data: {
        id: assignment._id,
        status: assignment.status,
      },
    });
  } catch (error: any) {
    console.error('Create assignment error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create assignment',
    });
  }
}

// Fallback direct processing when Redis/BullMQ is unavailable
async function processDirectly(assignmentId: string): Promise<void> {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      assignmentId,
      { status: 'processing' },
      { new: true }
    );

    if (!assignment) return;

    emitToAssignment(assignmentId, 'generation:started', {
      assignmentId,
      message: 'Generation started...',
    });

    const result = await generateQuestionPaper(
      assignment.questionTypes,
      assignment.additionalInstructions,
      assignment.subject,
      assignment.className
    );

    await Assignment.findByIdAndUpdate(assignmentId, {
      status: 'completed',
      generatedPaper: result.paper,
      title: result.title,
      subject: result.subject,
      schoolName: result.schoolName,
      className: result.className,
      timeAllowed: result.timeAllowed,
      maximumMarks: result.maximumMarks,
    });

    // Cache in Redis if available
    const redis = getRedis();
    if (redis) {
      const updated = await Assignment.findById(assignmentId);
      if (updated) {
        await redis.set(
          `assignment:${assignmentId}`,
          JSON.stringify(updated.toJSON()),
          'EX',
          3600
        );
      }
    }

    emitToAssignment(assignmentId, 'generation:completed', {
      assignmentId,
      message: 'Question paper generated successfully!',
    });
  } catch (error: any) {
    await Assignment.findByIdAndUpdate(assignmentId, {
      status: 'failed',
      errorMessage: error.message,
    });

    emitToAssignment(assignmentId, 'generation:failed', {
      assignmentId,
      error: error.message,
    });
  }
}

// Get all assignments
export async function getAssignments(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { search, status } = req.query;
    const filter: any = {};

    if (search && typeof search === 'string') {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
      ];
    }

    if (status && typeof status === 'string') {
      filter.status = status;
    }

    const assignments = await Assignment.find(filter)
      .sort({ createdAt: -1 })
      .select('-generatedPaper -errorMessage')
      .lean();

    res.json({
      success: true,
      data: assignments,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch assignments',
    });
  }
}

// Get single assignment (with Redis cache)
export async function getAssignment(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    // Check Redis cache first
    const redis = getRedis();
    if (redis) {
      const cached = await redis.get(`assignment:${id}`);
      if (cached) {
        res.json({
          success: true,
          data: JSON.parse(cached),
          cached: true,
        });
        return;
      }
    }

    const assignment = await Assignment.findById(id).lean();
    if (!assignment) {
      res.status(404).json({
        success: false,
        error: 'Assignment not found',
      });
      return;
    }

    // Cache for next time
    if (redis && assignment.status === 'completed') {
      await redis.set(
        `assignment:${id}`,
        JSON.stringify(assignment),
        'EX',
        3600
      );
    }

    res.json({
      success: true,
      data: assignment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch assignment',
    });
  }
}

// Delete assignment
export async function deleteAssignment(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findByIdAndDelete(id);

    if (!assignment) {
      res.status(404).json({
        success: false,
        error: 'Assignment not found',
      });
      return;
    }

    // Remove from cache
    const redis = getRedis();
    if (redis) {
      await redis.del(`assignment:${id}`);
    }

    res.json({
      success: true,
      message: 'Assignment deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete assignment',
    });
  }
}

// Regenerate assignment
export async function regenerateAssignment(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id);

    if (!assignment) {
      res.status(404).json({
        success: false,
        error: 'Assignment not found',
      });
      return;
    }

    // Reset status
    assignment.status = 'pending';
    assignment.generatedPaper = undefined;
    assignment.errorMessage = undefined;
    await assignment.save();

    // Clear cache
    const redis = getRedis();
    if (redis) {
      await redis.del(`assignment:${id}`);
    }

    // Process directly
    processDirectly(id as string);

    res.json({
      success: true,
      message: 'Regeneration started',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to regenerate',
    });
  }
}

// Download PDF
export async function downloadPDF(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id);

    if (!assignment) {
      res.status(404).json({
        success: false,
        error: 'Assignment not found',
      });
      return;
    }

    if (assignment.status !== 'completed' || !assignment.generatedPaper) {
      res.status(400).json({
        success: false,
        error: 'Assignment is not yet generated',
      });
      return;
    }

    const pdfBuffer = await generatePDF(assignment);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${assignment.title || 'question-paper'}.pdf"`,
      'Content-Length': pdfBuffer.length.toString(),
    });

    res.send(pdfBuffer);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate PDF',
    });
  }
}
