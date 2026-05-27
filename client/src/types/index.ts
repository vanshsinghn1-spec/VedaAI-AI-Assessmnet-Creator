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
  options?: string[];
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

export interface Assignment {
  _id: string;
  title: string;
  subject: string;
  schoolName: string;
  className: string;
  dueDate: string;
  timeAllowed: string;
  maximumMarks: number;
  questionTypes: QuestionType[];
  additionalInstructions: string;
  fileUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  generatedPaper?: GeneratedPaper;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFormData {
  questionTypes: QuestionType[];
  additionalInstructions: string;
  dueDate: string;
  subject: string;
  className: string;
  schoolName: string;
  file: File | null;
}

export type GenerationStatus = {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message?: string;
};
