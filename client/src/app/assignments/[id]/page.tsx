'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { useWebSocket } from '@/hooks/useWebSocket';
import QuestionPaper from '@/components/output/QuestionPaper';
import { API_BASE_URL } from '@/lib/api';
import { RotateCcw, Download, Sparkles } from 'lucide-react';

export default function AssignmentOutputPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    currentAssignment,
    currentLoading,
    generationStatus,
    fetchAssignment,
    regenerateAssignment,
  } = useAssignmentStore();

  // Connect WebSocket for real-time updates
  useWebSocket(id);

  useEffect(() => {
    if (id) {
      fetchAssignment(id);
    }
  }, [id, fetchAssignment]);

  const status = generationStatus[id];

  // Handle PDF download
  const handleDownloadPDF = () => {
    window.open(`${API_BASE_URL}/api/assignments/${id}/pdf`, '_blank');
  };

  // Handle regenerate
  const handleRegenerate = async () => {
    try {
      await regenerateAssignment(id);
    } catch (err) {
      console.error('Regenerate failed:', err);
    }
  };

  // Loading state
  if (currentLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p className="loading-text">Loading assignment...</p>
      </div>
    );
  }

  // Check failure first
  if (currentAssignment?.status === 'failed' || status?.status === 'failed') {
    return (
      <div className="generation-progress">
        <h2 style={{ color: 'var(--status-red)' }}>Generation Failed</h2>
        <p>{status?.message || currentAssignment?.errorMessage || 'Something went wrong.'}</p>
        <button
          className="btn-primary"
          onClick={handleRegenerate}
          style={{ marginTop: 20 }}
        >
          <RotateCcw size={16} /> Try Again
        </button>
      </div>
    );
  }

  // Generation in progress
  if (
    currentAssignment?.status === 'pending' ||
    currentAssignment?.status === 'processing' ||
    status?.status === 'processing' ||
    status?.status === 'pending'
  ) {
    return (
      <div className="generation-progress">
        <div className="loading-spinner" style={{ margin: '0 auto 24px' }} />
        <h2>Generating Question Paper...</h2>
        <p>
          {status?.message ||
            'Our AI is crafting your question paper. This may take a moment.'}
        </p>
      </div>
    );
  }



  // No assignment found
  if (!currentAssignment || !currentAssignment.generatedPaper) {
    return (
      <div className="generation-progress">
        <div className="loading-spinner" style={{ margin: '0 auto 24px' }} />
        <h2>Loading...</h2>
        <p>Waiting for the question paper to be generated.</p>
      </div>
    );
  }

  const { generatedPaper } = currentAssignment;

  return (
    <div>
      {/* Success Banner */}
      <div className="output-banner">
        <p className="output-banner-text">
          <Sparkles size={20} className="inline-icon" /> Certainly! Here is your customized Question Paper for your{' '}
          {currentAssignment.subject} {currentAssignment.className} classes.
        </p>
        <div className="output-banner-actions">
          <button className="btn-download" onClick={handleDownloadPDF}>
            <Download size={16} /> Download as PDF
          </button>
          <button className="btn-regenerate" onClick={handleRegenerate}>
            <RotateCcw size={16} /> Regenerate
          </button>
        </div>
      </div>

      {/* Question Paper */}
      <QuestionPaper
        schoolName={currentAssignment.schoolName}
        subject={currentAssignment.subject}
        className={currentAssignment.className}
        timeAllowed={currentAssignment.timeAllowed}
        maximumMarks={currentAssignment.maximumMarks}
        paper={generatedPaper}
      />
    </div>
  );
}
