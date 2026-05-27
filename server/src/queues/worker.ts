import { Worker, Job } from 'bullmq';
import { createBullMQConnection } from '../config/redis';
import { getRedis } from '../config/redis';
import Assignment from '../models/Assignment';
import { generateQuestionPaper } from '../services/aiService';
import { emitToAssignment } from '../socket';

let worker: Worker | null = null;

export function startWorker(): void {
  const connection = createBullMQConnection();
  if (!connection) {
    console.warn('⚠️  Redis not available. Worker not started.');
    return;
  }

  worker = new Worker(
    'question-generation',
    async (job: Job) => {
      const { assignmentId } = job.data;
      console.log(`🔄 Processing job for assignment: ${assignmentId}`);

      try {
        // Update status to processing
        const assignment = await Assignment.findByIdAndUpdate(
          assignmentId,
          { status: 'processing' },
          { new: true }
        );

        if (!assignment) {
          throw new Error(`Assignment not found: ${assignmentId}`);
        }

        // Emit started event
        emitToAssignment(assignmentId, 'generation:started', {
          assignmentId,
          message: 'Generation started...',
        });

        // Emit progress
        emitToAssignment(assignmentId, 'generation:progress', {
          assignmentId,
          message: 'Generating questions with AI...',
        });

        // Call AI service
        const result = await generateQuestionPaper(
          assignment.questionTypes,
          assignment.additionalInstructions,
          assignment.subject,
          assignment.className
        );

        // Update assignment with generated paper
        const updated = await Assignment.findByIdAndUpdate(
          assignmentId,
          {
            status: 'completed',
            generatedPaper: result.paper,
            title: result.title,
            subject: result.subject,
            schoolName: result.schoolName,
            className: result.className,
            timeAllowed: result.timeAllowed,
            maximumMarks: result.maximumMarks,
          },
          { new: true }
        );

        // Cache in Redis
        const redis = getRedis();
        if (redis && updated) {
          await redis.set(
            `assignment:${assignmentId}`,
            JSON.stringify(updated.toJSON()),
            'EX',
            3600 // Cache for 1 hour
          );
        }

        // Emit completed event
        emitToAssignment(assignmentId, 'generation:completed', {
          assignmentId,
          message: 'Question paper generated successfully!',
        });

        console.log(`✅ Job completed for assignment: ${assignmentId}`);
        return { success: true };
      } catch (error: any) {
        console.error(`❌ Job failed for assignment: ${assignmentId}`, error);

        // Update assignment status to failed
        await Assignment.findByIdAndUpdate(assignmentId, {
          status: 'failed',
          errorMessage: error.message || 'Generation failed',
        });

        // Emit failed event
        emitToAssignment(assignmentId, 'generation:failed', {
          assignmentId,
          error: error.message || 'Generation failed',
        });

        throw error;
      }
    },
    {
      connection: connection as any,
      concurrency: 2,
    }
  );

  worker.on('completed', (job) => {
    console.log(`✅ Worker completed job: ${job.id}`);
  });

  worker.on('failed', (job, err) => {
    console.error(`❌ Worker failed job: ${job?.id}`, err.message);
  });

  worker.on('error', (err) => {
    console.error('❌ Worker connection/internal error:', err);
  });

  console.log('✅ BullMQ worker started');
}

export function getWorker(): Worker | null {
  return worker;
}
