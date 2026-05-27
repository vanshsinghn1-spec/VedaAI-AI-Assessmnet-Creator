'use client';

import { Users, MoreVertical, Plus } from 'lucide-react';

export default function GroupsPage() {
  const groups = [
    { id: 1, name: '8th Grade Science', students: 32, icon: '🔬', color: '#ff9800' },
    { id: 2, name: '10th Grade Mathematics', students: 28, icon: '📐', color: '#2196F3' },
    { id: 3, name: '12th Grade Physics', students: 24, icon: '⚛️', color: '#9C27B0' },
    { id: 4, name: '9th Grade English', students: 35, icon: '📚', color: '#4CAF50' },
  ];

  return (
    <div className="groups-page">
      <div className="assignments-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>My Groups</h1>
          <p>Manage your classes and student groups.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={16} /> Create Group
        </button>
      </div>

      <div className="grid-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', marginTop: '32px' }}>
        {groups.map((group) => (
          <div key={group.id} style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ background: group.color, height: '80px', position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: '-20px', left: '20px', background: '#fff', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                {group.icon}
              </div>
            </div>
            <div style={{ padding: '32px 20px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{group.name}</h3>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}>
                  <MoreVertical size={16} />
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-light)', fontSize: '14px' }}>
                <Users size={16} /> {group.students} Students
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
