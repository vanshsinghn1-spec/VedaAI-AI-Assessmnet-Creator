'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft, Bell, ChevronDown, LayoutGrid } from 'lucide-react';

export default function TopBar() {
  const router = useRouter();
  const pathname = usePathname();

  let title = 'Assignment';
  let showBack = true;
  let backHref = '/assignments';

  if (pathname === '/') {
    title = 'Home Dashboard';
    showBack = false;
  } else if (pathname === '/groups') {
    title = 'My Groups';
    showBack = false;
  } else if (pathname === '/assignments') {
    title = 'Assignments';
    showBack = false;
  } else if (pathname === '/assignments/create') {
    title = 'Create Assignment';
    showBack = true;
    backHref = '/assignments';
  } else if (pathname?.startsWith('/assignments/')) {
    title = 'Assignment Details';
    showBack = true;
    backHref = '/assignments';
  } else if (pathname === '/ai-toolkit') {
    title = "AI Teacher's Toolkit";
    showBack = false;
  } else if (pathname === '/library') {
    title = 'My Library';
    showBack = false;
  } else if (pathname === '/settings') {
    title = 'Settings';
    showBack = false;
  }

  const handleBack = () => {
    router.push(backHref);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        {showBack && (
          <button className="topbar-back" onClick={handleBack}>
            <ArrowLeft size={20} />
          </button>
        )}
        <div className="topbar-breadcrumb">
          <span className="topbar-breadcrumb-icon"><LayoutGrid size={18} /></span>
          <span>{title}</span>
        </div>
      </div>

      <div className="topbar-right">
        <button className="topbar-notification">
          <Bell size={20} />
        </button>
        <div className="topbar-user">
          <div className="topbar-user-avatar">J</div>
          <span className="topbar-user-name">John Doe</span>
          <span className="topbar-user-chevron"><ChevronDown size={16} /></span>
        </div>
      </div>
    </header>
  );
}
