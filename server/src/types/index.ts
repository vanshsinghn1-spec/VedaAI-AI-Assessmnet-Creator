export interface QuestionType {
  type: string;
  count: number;
  marksEach: number;
}

export interface GeneratedQuestion {
  number: number;
  text: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  marks: number;
  type: string;
  options?: string[]; // For MCQs
}

export interface PaperSection {
  title: string;
  instruction: string;
  questions: GeneratedQuestion[];
}

export interface AnswerKeyItem {
  number: number;
  answer: string;
}

export interface GeneratedPaper {
  sections: PaperSection[];
  answerKey: AnswerKeyItem[];
}

export interface AssignmentData {
  title?: string;
  subject?: string;
  schoolName?: string;
  className?: string;
  dueDate?: string;
  timeAllowed?: string;
  maximumMarks?: number;
  questionTypes: QuestionType[];
  additionalInstructions?: string;
  fileUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  generatedPaper?: GeneratedPaper;
  errorMessage?: string;
}

export type GenerationStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface WebSocketEvents {
  'generation:started': { assignmentId: string };
  'generation:progress': { assignmentId: string; message: string };
  'generation:completed': { assignmentId: string };
  'generation:failed': { assignmentId: string; error: string };
}
