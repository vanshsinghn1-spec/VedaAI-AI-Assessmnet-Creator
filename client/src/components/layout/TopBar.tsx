'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, ChevronDown, LayoutGrid } from 'lucide-react';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
}

export default function TopBar({ title = 'Assignment', showBack = true }: TopBarProps) {
  const router = useRouter();

  return (
    <header className="topbar">
      <div className="topbar-left">
        {showBack && (
          <button className="topbar-back" onClick={() => router.back()}>
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
