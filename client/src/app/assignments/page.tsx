'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { Filter, Search, Plus } from 'lucide-react';
import EmptyState from '@/components/assignments/EmptyState';
import AssignmentGrid from '@/components/assignments/AssignmentGrid';

export default function AssignmentsPage() {
  const router = useRouter();
  const {
    assignments,
    loading,
    searchQuery,
    setSearchQuery,
    fetchAssignments,
  } = useAssignmentStore();
  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  // Debounced search
  const handleSearch = useCallback(
    (value: string) => {
      setSearchInput(value);
      const timeout = setTimeout(() => {
        setSearchQuery(value);
        fetchAssignments();
      }, 300);
      return () => clearTimeout(timeout);
    },
    [setSearchQuery, fetchAssignments]
  );

  if (loading && assignments.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p className="loading-text">Loading assignments...</p>
      </div>
    );
  }

  if (assignments.length === 0 && !searchQuery) {
    return <EmptyState />;
  }

  return (
    <div>
      {/* Header */}
      <div className="assignments-header">
        <h1>Assignments</h1>
        <p>Manage and create assignments for your classes.</p>
      </div>

      {/* Toolbar */}
      <div className="assignments-toolbar">
        <button className="filter-btn">
          <span><Filter size={16} /></span>
          Filter By
        </button>

        <div className="search-wrapper">
          <span className="search-icon"><Search size={18} /></span>
          <input
            type="text"
            placeholder="Search Assignment"
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <AssignmentGrid assignments={assignments} />

      {/* Bottom Create Button */}
      <button
        className="create-assignment-fab"
        onClick={() => router.push('/assignments/create')}
      >
        <span style={{ display: 'flex' }}><Plus size={20} /></span>
        Create Assignment
      </button>
    </div>
  );
}
