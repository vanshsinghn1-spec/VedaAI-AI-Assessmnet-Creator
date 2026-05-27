'use client';

import { BookOpen, Search, Filter, Download } from 'lucide-react';

export default function LibraryPage() {
  const documents = [
    { id: 1, title: 'Term 1 Final Syllabus.pdf', type: 'PDF', date: 'Oct 12, 2025' },
    { id: 2, title: 'Physics Formula Sheet.docx', type: 'DOCX', date: 'Oct 10, 2025' },
    { id: 3, title: 'Mid-term Exam Question Paper.pdf', type: 'PDF', date: 'Sep 25, 2025' },
    { id: 4, title: 'Chemistry Lab Manual.pdf', type: 'PDF', date: 'Sep 15, 2025' },
  ];

  return (
    <div className="library-page">
      <div className="assignments-header">
        <h1>My Library</h1>
        <p>Access your saved materials, past assignments, and reference documents.</p>
      </div>

      <div className="assignments-toolbar">
        <button className="filter-btn">
          <span><Filter size={16} /></span>
          Filter By
        </button>

        <div className="search-wrapper">
          <span className="search-icon"><Search size={18} /></span>
          <input type="text" placeholder="Search Library..." />
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--border-color)', marginTop: '24px' }}>
        {documents.map((doc, index) => (
          <div key={doc.id} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '16px 24px',
            borderBottom: index !== documents.length - 1 ? '1px solid var(--border-color)' : 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)' }}>
                <BookOpen size={20} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>{doc.title}</h4>
                <div style={{ fontSize: '13px', color: 'var(--text-light)', display: 'flex', gap: '12px' }}>
                  <span>{doc.type}</span>
                  <span>•</span>
                  <span>{doc.date}</span>
                </div>
              </div>
            </div>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}>
              <Download size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
