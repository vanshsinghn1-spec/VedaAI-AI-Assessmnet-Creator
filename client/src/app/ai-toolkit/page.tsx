'use client';

import { Sparkles, Bot, FileCheck, Presentation, Mic, PenTool } from 'lucide-react';

export default function AIToolkitPage() {
  const tools = [
    { id: 1, title: 'Question Paper Generator', desc: 'Create custom assignments from any syllabus.', icon: <Sparkles size={24} />, active: true },
    { id: 2, title: 'Auto Grader', desc: 'Grade subjective answers automatically.', icon: <FileCheck size={24} />, active: false },
    { id: 3, title: 'Lesson Planner', desc: 'Generate 40-minute engaging lesson plans.', icon: <Presentation size={24} />, active: false },
    { id: 4, title: 'Doubt Solver Bot', desc: 'An AI assistant for your students.', icon: <Bot size={24} />, active: false },
    { id: 5, title: 'Audio Summarizer', desc: 'Convert lecture audio into notes.', icon: <Mic size={24} />, active: false },
    { id: 6, title: 'Rubric Creator', desc: 'Generate precise grading rubrics.', icon: <PenTool size={24} />, active: false },
  ];

  return (
    <div className="ai-toolkit-page">
      <div className="assignments-header">
        <h1>AI Teacher's Toolkit</h1>
        <p>Explore a suite of AI-powered tools designed to supercharge your teaching.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', marginTop: '32px' }}>
        {tools.map(tool => (
          <div key={tool.id} style={{ 
            background: '#fff', 
            border: '1px solid var(--border-color)', 
            borderRadius: '12px', 
            padding: '24px',
            position: 'relative',
            opacity: tool.active ? 1 : 0.7,
            cursor: tool.active ? 'pointer' : 'default'
          }}>
            {!tool.active && (
              <span style={{ position: 'absolute', top: '16px', right: '16px', background: 'var(--background)', fontSize: '12px', padding: '4px 8px', borderRadius: '16px', fontWeight: 600 }}>
                Coming Soon
              </span>
            )}
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: tool.active ? 'var(--primary-light)' : '#f5f5f5', color: tool.active ? 'var(--primary)' : 'var(--text-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              {tool.icon}
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{tool.title}</h3>
            <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '14px', lineHeight: '1.5' }}>{tool.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
