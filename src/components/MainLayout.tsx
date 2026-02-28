'use client';

import React from 'react';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function MainLayout({ children, title }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:mr-64">
        <div className="p-4 lg:p-8">
          {title && (
            <header className="mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-white">{title}</h1>
            </header>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
