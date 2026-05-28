'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft, Bell, ChevronDown, LayoutGrid } from 'lucide-react';

export default function TopBar() {
  const router = useRouter();
  const pathname = usePathname();

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
