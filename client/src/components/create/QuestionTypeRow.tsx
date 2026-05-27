'use client';

import { QuestionType } from '@/types';
import { X, Minus, Plus } from 'lucide-react';

interface QuestionTypeRowProps {
  questionType: QuestionType;
  index: number;
  onUpdate: (index: number, field: keyof QuestionType, value: string | number) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

const QUESTION_TYPE_OPTIONS = [
  'Multiple Choice Questions',
  'Short Questions',
  'Long Answer Questions',
  'Diagram/Graph-Based Questions',
  'Numerical Problems',
  'True/False Questions',
  'Fill in the Blanks',
  'Match the Following',
];

export default function QuestionTypeRow({
  questionType,
  index,
  onUpdate,
  onRemove,
  canRemove,
}: QuestionTypeRowProps) {
  return (
    <div className="question-type-row">
      <select
        className="question-type-select"
        value={questionType.type}
        onChange={(e) => onUpdate(index, 'type', e.target.value)}
      >
        {QUESTION_TYPE_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {canRemove ? (
        <button
          className="question-type-remove"
          onClick={() => onRemove(index)}
          type="button"
          aria-label="Remove question type"
        >
          <X size={16} />
        </button>
      ) : (
        <div style={{ width: 32 }} />
      )}

      {/* Number of Questions Stepper */}
      <div className="stepper">
        <button
          className="stepper-btn"
          onClick={() =>
            onUpdate(index, 'count', Math.max(1, questionType.count - 1))
          }
          type="button"
        >
          <Minus size={16} />
        </button>
        <span className="stepper-value">{questionType.count}</span>
        <button
          className="stepper-btn"
          onClick={() => onUpdate(index, 'count', questionType.count + 1)}
          type="button"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Marks Stepper */}
      <div className="stepper">
        <button
          className="stepper-btn"
          onClick={() =>
            onUpdate(index, 'marksEach', Math.max(1, questionType.marksEach - 1))
          }
          type="button"
        >
          <Minus size={16} />
        </button>
        <span className="stepper-value">{questionType.marksEach}</span>
        <button
          className="stepper-btn"
          onClick={() =>
            onUpdate(index, 'marksEach', questionType.marksEach + 1)
          }
          type="button"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
