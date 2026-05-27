'use client';

import { GeneratedPaper } from '@/types';

interface QuestionPaperProps {
  schoolName: string;
  subject: string;
  className: string;
  timeAllowed: string;
  maximumMarks: number;
  paper: GeneratedPaper;
}

export default function QuestionPaper({
  schoolName,
  subject,
  className,
  timeAllowed,
  maximumMarks,
  paper,
}: QuestionPaperProps) {
  return (
    <div className="question-paper" id="question-paper">
      {/* Header */}
      <div className="paper-header">
        <h1 className="paper-school">{schoolName}</h1>
        <div className="paper-subject">Subject: {subject}</div>
        <div className="paper-class">Class: {className}</div>
      </div>

      {/* Meta */}
      <div className="paper-meta">
        <span>
          <strong>Time Allowed:</strong> {timeAllowed}
        </span>
        <span>
          <strong>Maximum Marks:</strong> {maximumMarks}
        </span>
      </div>

      {/* Instructions */}
      <div className="paper-instructions">
        All questions are compulsory unless stated otherwise.
      </div>

      {/* Student Info */}
      <div className="paper-student-info">
        <p>
          Name: <span className="info-line" />
        </p>
        <p>
          Roll Number: <span className="info-line" />
        </p>
        <p>
          Class: {className} Section: <span className="info-line" style={{ maxWidth: 80 }} />
        </p>
      </div>

      {/* Sections */}
      {paper.sections.map((section, si) => (
        <div key={si} className="paper-section">
          <h2 className="paper-section-title">{section.title}</h2>
          <p className="paper-section-instruction">{section.instruction}</p>

          {section.questions.map((q) => (
            <div key={q.number} className="paper-question">
              <div className="paper-question-row">
                <span className="paper-question-number">{q.number}.</span>
                <span
                  className={`paper-question-badge badge-${q.difficulty.toLowerCase()}`}
                >
                  [{q.difficulty}]
                </span>
                <span className="paper-question-text">{q.text}</span>
                <span className="paper-question-marks">[{q.marks} Marks]</span>
              </div>
              {q.options && q.options.length > 0 && (
                <div className="paper-question-options">
                  {q.options.map((opt, oi) => (
                    <p key={oi}>
                      {String.fromCharCode(97 + oi)}) {opt}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}

      {/* End marker */}
      <div className="paper-end">End of Question Paper</div>

      {/* Answer Key */}
      {paper.answerKey && paper.answerKey.length > 0 && (
        <div className="answer-key">
          <h2>Answer Key:</h2>
          {paper.answerKey.map((ak) => (
            <div key={ak.number} className="answer-key-item">
              <span className="answer-key-number">{ak.number}.</span>{' '}
              {ak.answer}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
