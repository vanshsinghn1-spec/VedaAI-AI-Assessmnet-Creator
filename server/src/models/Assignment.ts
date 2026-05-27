import mongoose, { Document, Schema } from 'mongoose';
import { GeneratedPaper, QuestionType } from '../types';

export interface IAssignment extends Document {
  title: string;
  subject: string;
  schoolName: string;
  className: string;
  dueDate: Date;
  timeAllowed: string;
  maximumMarks: number;
  questionTypes: QuestionType[];
  additionalInstructions: string;
  fileUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  generatedPaper?: GeneratedPaper;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionTypeSchema = new Schema<QuestionType>(
  {
    type: { type: String, required: true },
    count: { type: Number, required: true, min: 1 },
    marksEach: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const GeneratedQuestionSchema = new Schema(
  {
    number: { type: Number, required: true },
    text: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['Easy', 'Moderate', 'Hard'],
      required: true,
    },
    marks: { type: Number, required: true },
    type: { type: String, required: true },
    options: [{ type: String }],
  },
  { _id: false }
);

const PaperSectionSchema = new Schema(
  {
    title: { type: String, required: true },
    instruction: { type: String, required: true },
    questions: [GeneratedQuestionSchema],
  },
  { _id: false }
);

const AnswerKeySchema = new Schema(
  {
    number: { type: Number, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const GeneratedPaperSchema = new Schema(
  {
    sections: [PaperSectionSchema],
    answerKey: [AnswerKeySchema],
  },
  { _id: false }
);

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, default: 'Untitled Assignment' },
    subject: { type: String, default: 'General' },
    schoolName: { type: String, default: 'School Name' },
    className: { type: String, default: 'Class' },
    dueDate: { type: Date },
    timeAllowed: { type: String, default: '45 minutes' },
    maximumMarks: { type: Number, default: 0 },
    questionTypes: { type: [QuestionTypeSchema], required: true },
    additionalInstructions: { type: String, default: '' },
    fileUrl: { type: String },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    generatedPaper: { type: GeneratedPaperSchema },
    errorMessage: { type: String },
  },
  {
    timestamps: true,
  }
);

// Index for search functionality
AssignmentSchema.index({ title: 'text', subject: 'text' });

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);
