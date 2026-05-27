import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env';
import { GeneratedPaper, QuestionType } from '../types';

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

function buildPrompt(
  questionTypes: QuestionType[],
  additionalInstructions?: string,
  subject?: string,
  className?: string
): string {
  const totalQuestions = questionTypes.reduce((sum, qt) => sum + qt.count, 0);
  const totalMarks = questionTypes.reduce(
    (sum, qt) => sum + qt.count * qt.marksEach,
    0
  );

  const questionTypeDescriptions = questionTypes
    .map(
      (qt) =>
        `- ${qt.type}: ${qt.count} questions, ${qt.marksEach} marks each`
    )
    .join('\n');

  return `You are an expert exam paper creator. Generate a structured question paper based on the following specifications.

Subject: ${subject || 'General Knowledge'}
Class: ${className || '5th'}
Total Questions: ${totalQuestions}
Total Marks: ${totalMarks}

Question Types Required:
${questionTypeDescriptions}

${additionalInstructions ? `Additional Instructions: ${additionalInstructions}` : ''}

IMPORTANT: You MUST respond with ONLY valid JSON matching this exact structure (no markdown, no code fences):
{
  "title": "A descriptive title for this question paper (e.g., 'Quiz on Electricity')",
  "subject": "${subject || 'General Knowledge'}",
  "schoolName": "Delhi Public School, Sector-4, Bokaro",
  "className": "${className || '5th'}",
  "timeAllowed": "45 minutes",
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions. Each question carries X marks",
      "questions": [
        {
          "number": 1,
          "text": "The full question text here",
          "difficulty": "Easy",
          "marks": 2,
          "type": "Short Answer Questions",
          "options": []
        }
      ]
    }
  ],
  "answerKey": [
    {
      "number": 1,
      "answer": "Detailed answer text here"
    }
  ]
}

Rules:
1. Group questions into sections based on question type (Section A, Section B, etc.)
2. Assign difficulty levels: approximately 40% Easy, 40% Moderate, 20% Hard
3. Each question must have a clear, well-written text
4. For Multiple Choice Questions, include exactly 4 options in the "options" array
5. The answer key must have detailed answers for ALL questions
6. Difficulty must be exactly one of: "Easy", "Moderate", "Hard"
7. Question numbers should be sequential across all sections
8. Make questions academically appropriate for the given class level
9. Return ONLY the JSON object, no additional text or formatting`;
}

export async function generateQuestionPaper(
  questionTypes: QuestionType[],
  additionalInstructions?: string,
  subject?: string,
  className?: string
): Promise<{
  paper: GeneratedPaper;
  title: string;
  subject: string;
  schoolName: string;
  className: string;
  timeAllowed: string;
  maximumMarks: number;
}> {
  const prompt = buildPrompt(
    questionTypes,
    additionalInstructions,
    subject,
    className
  );

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  // Clean up the response - remove markdown code fences if present
  let cleanedText = text.trim();
  if (cleanedText.startsWith('```json')) {
    cleanedText = cleanedText.slice(7);
  } else if (cleanedText.startsWith('```')) {
    cleanedText = cleanedText.slice(3);
  }
  if (cleanedText.endsWith('```')) {
    cleanedText = cleanedText.slice(0, -3);
  }
  cleanedText = cleanedText.trim();

  let parsed: any;
  try {
    parsed = JSON.parse(cleanedText);
  } catch (e) {
    console.error('Failed to parse AI response:', cleanedText.substring(0, 500));
    throw new Error('Failed to parse AI response as JSON');
  }

  // Calculate total marks
  const totalMarks = questionTypes.reduce(
    (sum, qt) => sum + qt.count * qt.marksEach,
    0
  );

  return {
    paper: {
      sections: parsed.sections || [],
      answerKey: parsed.answerKey || [],
    },
    title: parsed.title || 'Generated Question Paper',
    subject: parsed.subject || subject || 'General',
    schoolName: parsed.schoolName || 'Delhi Public School, Sector-4, Bokaro',
    className: parsed.className || className || '5th',
    timeAllowed: parsed.timeAllowed || '45 minutes',
    maximumMarks: totalMarks,
  };
}
