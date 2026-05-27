'use client';

import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

export default function EmptyState() {
  const router = useRouter();

  return (
    <div className="empty-state">
      <div className="empty-state-illustration">
        <svg viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Magnifying glass */}
          <circle cx="110" cy="85" r="50" stroke="#e0e0e0" strokeWidth="4" fill="#f5f5f5" />
          <line x1="145" y1="120" x2="175" y2="150" stroke="#e0e0e0" strokeWidth="6" strokeLinecap="round" />
          {/* Document inside */}
          <rect x="90" y="60" width="35" height="45" rx="3" fill="#fff" stroke="#d0d0d0" strokeWidth="2" />
          <line x1="96" y1="72" x2="118" y2="72" stroke="#e0e0e0" strokeWidth="2" strokeLinecap="round" />
          <line x1="96" y1="80" x2="112" y2="80" stroke="#e0e0e0" strokeWidth="2" strokeLinecap="round" />
          <line x1="96" y1="88" x2="116" y2="88" stroke="#e0e0e0" strokeWidth="2" strokeLinecap="round" />
          {/* X mark */}
          <circle cx="140" cy="55" r="16" fill="#ffebee" />
          <line x1="133" y1="48" x2="147" y2="62" stroke="#f44336" strokeWidth="3" strokeLinecap="round" />
          <line x1="147" y1="48" x2="133" y2="62" stroke="#f44336" strokeWidth="3" strokeLinecap="round" />
          {/* Sparkles */}
          <path d="M60 45 L63 52 L60 59 L57 52 Z" fill="#ff9800" opacity="0.6" />
          <path d="M175 35 L177 40 L175 45 L173 40 Z" fill="#4caf50" opacity="0.6" />
          <circle cx="50" cy="110" r="3" fill="#2196f3" opacity="0.4" />
          <circle cx="185" cy="90" r="2" fill="#9c27b0" opacity="0.4" />
        </svg>
      </div>
      <h2>No assignments yet</h2>
      <p>
        Create your first assignment to start collecting and grading student
        submissions. You can set up rubrics, define marking criteria, and let AI
        assist with grading.
      </p>
      <button
        className="empty-state-btn"
        onClick={() => router.push('/assignments/create')}
      >
        <span><Plus size={18} /></span>
        Create Your First Assignment
      </button>
    </div>
  );
}
