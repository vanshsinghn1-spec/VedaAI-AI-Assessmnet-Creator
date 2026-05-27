'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { LayoutGrid, Users, FileText, Sparkles, BookOpen, Settings } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { assignments } = useAssignmentStore();

  const navItems = [
    { href: '/', icon: <LayoutGrid size={20} />, label: 'Home' },
    { href: '/groups', icon: <Users size={20} />, label: 'My Groups' },
    {
      href: '/assignments',
      icon: <FileText size={20} />,
      label: 'Assignments',
      badge: assignments.length > 0 ? assignments.length : undefined,
    },
    { href: '/ai-toolkit', icon: <Sparkles size={20} />, label: "AI Teacher's Toolkit" },
    { href: '/library', icon: <BookOpen size={20} />, label: 'My Library' },
  ];

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">V</div>
        <span className="sidebar-logo-text">VedaAI</span>
      </div>

      {/* Create Assignment Button */}
      <Link href="/assignments/create">
        <button className="sidebar-create-btn">
          <span className="plus-icon">+</span>
          Create Assignment
        </button>
      </Link>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive =
            item.href === '/assignments'
              ? pathname.startsWith('/assignments')
              : pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </Link>
          );
        })}

        <div className="sidebar-divider" />

        <Link
          href="/settings"
          className={`sidebar-nav-item ${pathname === '/settings' ? 'active' : ''}`}
        >
          <span className="nav-icon"><Settings size={20} /></span>
          Settings
        </Link>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-avatar">D</div>
        <div className="sidebar-footer-info">
          <div className="sidebar-footer-name">Delhi Public School</div>
          <div className="sidebar-footer-role">Bokaro Steel City</div>
        </div>
      </div>
    </aside>
  );
}
