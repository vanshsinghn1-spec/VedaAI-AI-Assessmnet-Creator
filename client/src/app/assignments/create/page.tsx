'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { QuestionType } from '@/types';
import FileUpload from '@/components/create/FileUpload';
import QuestionTypeRow from '@/components/create/QuestionTypeRow';

export default function CreateAssignmentPage() {
  const router = useRouter();
  const { formData, updateFormData, createAssignment, resetFormData } =
    useAssignmentStore();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalQuestions = formData.questionTypes.reduce(
    (sum, qt) => sum + qt.count,
    0
  );
  const totalMarks = formData.questionTypes.reduce(
    (sum, qt) => sum + qt.count * qt.marksEach,
    0
  );

  const handleQuestionTypeUpdate = (
    index: number,
    field: keyof QuestionType,
    value: string | number
  ) => {
    const updated = [...formData.questionTypes];
    updated[index] = { ...updated[index], [field]: value };
    updateFormData({ questionTypes: updated });
  };

  const handleAddQuestionType = () => {
    updateFormData({
      questionTypes: [
        ...formData.questionTypes,
        { type: 'Multiple Choice Questions', count: 5, marksEach: 1 },
      ],
    });
  };

  const handleRemoveQuestionType = (index: number) => {
    if (formData.questionTypes.length <= 1) return;
    const updated = formData.questionTypes.filter((_, i) => i !== index);
    updateFormData({ questionTypes: updated });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.questionTypes.length === 0) {
      newErrors.questionTypes = 'At least one question type is required';
    }

    for (let i = 0; i < formData.questionTypes.length; i++) {
      const qt = formData.questionTypes[i];
      if (qt.count < 1) {
        newErrors[`qt_count_${i}`] = 'Count must be at least 1';
      }
      if (qt.marksEach < 1) {
        newErrors[`qt_marks_${i}`] = 'Marks must be at least 1';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('questionTypes', JSON.stringify(formData.questionTypes));
      if (formData.additionalInstructions) {
        data.append('additionalInstructions', formData.additionalInstructions);
      }
      if (formData.dueDate) {
        data.append('dueDate', formData.dueDate);
      }
      if (formData.subject) {
        data.append('subject', formData.subject);
      }
      if (formData.className) {
        data.append('className', formData.className);
      }
      if (formData.schoolName) {
        data.append('schoolName', formData.schoolName);
      }
      if (formData.file) {
        data.append('file', formData.file);
      }

      const assignmentId = await createAssignment(data);
      resetFormData();
      router.push(`/assignments/${assignmentId}`);
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to create assignment' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-page">
      {/* Header */}
      <div className="create-header">
        <h1>Create Assignment</h1>
        <p>Set up a new assignment for your students</p>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: '50%' }} />
      </div>

      {/* Form Card */}
      <div className="form-card">
        <h2 className="form-section-title">Assignment Details</h2>
        <p className="form-section-subtitle">
          Basic information about your assignment
        </p>

        {/* File Upload */}
        <FileUpload
          file={formData.file}
          onFileChange={(file) => updateFormData({ file })}
        />

        {/* Subject & Class */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Subject</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. Science, English"
              value={formData.subject}
              onChange={(e) => updateFormData({ subject: e.target.value })}
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Class</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. 5th, 8th, 10th"
              value={formData.className}
              onChange={(e) => updateFormData({ className: e.target.value })}
            />
          </div>
        </div>

        {/* Due Date */}
        <div className="form-group">
          <label className="form-label">Due Date</label>
          <input
            className="form-input"
            type="date"
            placeholder="DD-MM-YYYY"
            value={formData.dueDate}
            onChange={(e) => updateFormData({ dueDate: e.target.value })}
          />
        </div>

        {/* Question Types */}
        <div className="form-group">
          <label className="form-label">Question Type</label>

          <div className="question-types-header">
            <span>Type</span>
            <span></span>
            <span>No. of Questions</span>
            <span>Marks</span>
          </div>

          {formData.questionTypes.map((qt, index) => (
            <QuestionTypeRow
              key={index}
              questionType={qt}
              index={index}
              onUpdate={handleQuestionTypeUpdate}
              onRemove={handleRemoveQuestionType}
              canRemove={formData.questionTypes.length > 1}
            />
          ))}

          <button
            className="add-question-type"
            onClick={handleAddQuestionType}
            type="button"
          >
            <Plus size={16} /> Add Question Type
          </button>

          <div className="totals-row">
            <span>
              Total Questions: <strong>{totalQuestions}</strong>
            </span>
            <span>
              Total Marks: <strong>{totalMarks}</strong>
            </span>
          </div>
        </div>

        {/* Additional Instructions */}
        <div className="form-group">
          <label className="form-label">
            Additional Information (For better output)
          </label>
          <textarea
            className="form-textarea"
            placeholder="e.g Generate a question paper for 1 hour exam duration..."
            value={formData.additionalInstructions}
            onChange={(e) =>
              updateFormData({ additionalInstructions: e.target.value })
            }
          />
        </div>

        {errors.questionTypes && (
          <p className="form-error">{errors.questionTypes}</p>
        )}
        {errors.submit && <p className="form-error">{errors.submit}</p>}
      </div>

      {/* Navigation */}
      <div className="form-nav">
        <button
          className="btn-secondary"
          onClick={() => router.back()}
          type="button"
        >
          <ArrowLeft size={16} /> Previous
        </button>
        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={submitting}
          type="button"
        >
          {submitting ? 'Creating...' : <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Next <ArrowRight size={16} /></span>}
        </button>
      </div>
    </div>
  );
}
