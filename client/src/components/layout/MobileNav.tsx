'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutGrid, Users, FileText, Sparkles, BookOpen, Plus } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: '/', icon: <LayoutGrid size={24} />, label: 'Home' },
    { href: '/groups', icon: <Users size={24} />, label: 'My Groups' },
    { href: '/assignments', icon: <FileText size={24} />, label: 'Assignments' },
    { href: '/library', icon: <BookOpen size={24} />, label: 'Library' },
    { href: '/ai-toolkit', icon: <Sparkles size={24} />, label: 'AI Toolkit' },
  ];

  return (
    <>
      <nav className="mobile-nav">
        <div className="mobile-nav-items">
          {navItems.map((item) => {
            const isActive =
              item.href === '/assignments'
                ? pathname.startsWith('/assignments')
                : pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`mobile-nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
      <button
        className="mobile-fab"
        onClick={() => router.push('/assignments/create')}
        aria-label="Create Assignment"
      >
        <Plus size={24} />
      </button>
    </>
  );
}
