'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Assignment } from '@/types';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { MoreVertical } from 'lucide-react';

interface AssignmentCardProps {
  assignment: Assignment;
}

export default function AssignmentCard({ assignment }: AssignmentCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { deleteAssignment } = useAssignmentStore();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).replace(/\//g, '-');
  };

  const handleView = () => {
    setMenuOpen(false);
    router.push(`/assignments/${assignment._id}`);
  };

  const handleDelete = async () => {
    setMenuOpen(false);
    if (confirm('Are you sure you want to delete this assignment?')) {
      try {
        await deleteAssignment(assignment._id);
      } catch (err) {
        console.error('Delete failed', err);
      }
    }
  };

  return (
    <div
      className="assignment-card"
      onClick={handleView}
      role="button"
      tabIndex={0}
    >
      <div className="assignment-card-header">
        <h3 className="assignment-card-title">{assignment.title}</h3>
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            className="assignment-card-menu"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            aria-label="Card menu"
          >
            <MoreVertical size={20} className="text-[var(--text-light)]" />
          </button>
          {menuOpen && (
            <div className="card-dropdown">
              <button
                className="card-dropdown-item"
                onClick={(e) => {
                  e.stopPropagation();
                  handleView();
                }}
              >
                View Assignment
              </button>
              <button
                className="card-dropdown-item danger"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="assignment-card-meta">
        <div className="assignment-card-date">
          Assigned on: <span>{formatDate(assignment.createdAt)}</span>
        </div>
        <div className="assignment-card-date">
          Due: <span>{formatDate(assignment.dueDate)}</span>
        </div>
      </div>
    </div>
  );
}
