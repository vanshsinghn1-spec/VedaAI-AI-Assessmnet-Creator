'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { Plus, Users, FileText, Activity } from 'lucide-react';
import AssignmentGrid from '@/components/assignments/AssignmentGrid';

export default function HomePage() {
  const router = useRouter();
  const { assignments, fetchAssignments, loading } = useAssignmentStore();

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const recentAssignments = assignments.slice(0, 3);

  return (
    <div className="home-dashboard">
      <div className="assignments-header">
        <h1>Welcome back, John! 👋</h1>
        <p>Here is what's happening with your classes today.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px', marginTop: '24px' }}>
        <div className="stat-card" style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '12px', borderRadius: '8px' }}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{assignments.length}</div>
            <div style={{ color: 'var(--text-light)', fontSize: '14px' }}>Total Assignments</div>
          </div>
        </div>
        
        <div className="stat-card" style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50', padding: '12px', borderRadius: '8px' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>5</div>
            <div style={{ color: 'var(--text-light)', fontSize: '14px' }}>Active Groups</div>
          </div>
        </div>

        <div className="stat-card" style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(33, 150, 243, 0.1)', color: '#2196F3', padding: '12px', borderRadius: '8px' }}>
            <Activity size={24} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>98%</div>
            <div style={{ color: 'var(--text-light)', fontSize: '14px' }}>Avg. AI Accuracy</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Recent Assignments</h2>
        <button 
          className="btn-secondary" 
          onClick={() => router.push('/assignments')}
          style={{ padding: '8px 16px', fontSize: '14px' }}
        >
          View All
        </button>
      </div>

      {loading && assignments.length === 0 ? (
        <div className="loading-container" style={{ minHeight: '200px' }}>
          <div className="loading-spinner" />
        </div>
      ) : recentAssignments.length > 0 ? (
        <AssignmentGrid assignments={recentAssignments} />
      ) : (
        <div className="empty-state" style={{ minHeight: '200px', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
          <p>No assignments created yet.</p>
          <button
            className="btn-primary"
            onClick={() => router.push('/assignments/create')}
            style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={16} /> Create One Now
          </button>
        </div>
      )}
    </div>
  );
}
