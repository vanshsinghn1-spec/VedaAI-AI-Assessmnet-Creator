import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import MobileNav from '@/components/layout/MobileNav';

import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VedaAI - AI Assessment Creator',
  description:
    'Create AI-powered assessments and question papers with VedaAI. Generate structured exams with difficulty levels, sections, and answer keys.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            <TopBar />
            <div className="page-content">{children}</div>
          </main>
          <MobileNav />
        </div>
      </body>
    </html>
  );
}
