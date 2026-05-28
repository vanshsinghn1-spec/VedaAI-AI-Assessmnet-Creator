'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft, Bell, ChevronDown, LayoutGrid } from 'lucide-react';
import { useAssignmentStore } from '@/store/useAssignmentStore';

export default function TopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { assignments, fetchAssignments } = useAssignmentStore();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [hasRead, setHasRead] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch assignments on mount if empty to ensure we can calculate expiring ones
  useEffect(() => {
    if (assignments.length === 0) {
      fetchAssignments();
    }
  }, [assignments.length, fetchAssignments]);

  // Find assignments expiring today
  const today = new Date().toDateString();
  const expiringToday = assignments.filter(a => {
    if (!a.dueDate) return false;
    return new Date(a.dueDate).toDateString() === today;
  });

  const unreadCount = !hasRead && expiringToday.length > 0 ? expiringToday.length : 0;

  const handleNotifClick = () => {
    setIsNotifOpen(!isNotifOpen);
    if (!isNotifOpen && unreadCount > 0) {
      setHasRead(true);
    }
  };

  let title = 'Assignment';

  if (pathname === '/') {
    title = 'Home Dashboard';
  } else if (pathname === '/groups') {
    title = 'My Groups';
  } else if (pathname === '/assignments') {
    title = 'Assignments';
  } else if (pathname === '/assignments/create') {
    title = 'Create Assignment';
  } else if (pathname?.startsWith('/assignments/')) {
    title = 'Assignment Details';
  } else if (pathname === '/ai-toolkit') {
    title = "AI Teacher's Toolkit";
  } else if (pathname === '/library') {
    title = 'My Library';
  } else if (pathname === '/settings') {
    title = 'Settings';
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="topbar-back" onClick={handleBack}>
          <ArrowLeft size={20} />
        </button>
        <div className="topbar-breadcrumb">
          <span className="topbar-breadcrumb-icon"><LayoutGrid size={18} /></span>
          <span>{title}</span>
        </div>
      </div>

      <div className="topbar-right">
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button className="topbar-notification" onClick={handleNotifClick}>
            <Bell size={20} />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>
          
          {isNotifOpen && (
            <div className="notification-panel">
              <div className="notification-header">Notifications</div>
              <div className="notification-list">
                {expiringToday.length > 0 ? (
                  expiringToday.map(assignment => (
                    <div key={assignment._id} className="notification-item" onClick={() => router.push(`/assignments/${assignment._id}`)}>
                      <span className="notification-title">Due Today!</span>
                      <span className="notification-desc">{assignment.subject} assignment expires today.</span>
                    </div>
                  ))
                ) : (
                  <div className="notification-item" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No Notification
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="topbar-user">
          <div className="topbar-user-avatar">J</div>
          <span className="topbar-user-name">John Doe</span>
          <span className="topbar-user-chevron"><ChevronDown size={16} /></span>
        </div>
      </div>
    </header>
  );
}
