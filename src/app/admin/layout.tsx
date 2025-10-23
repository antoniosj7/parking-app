'use client';
import React, { useState, useEffect } from 'react';
import MainNav from '@/components/main-nav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const collapsedState = localStorage.getItem('nav-collapsed') === 'true';
    setIsCollapsed(collapsedState);
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('nav-collapsed', String(newState));
  };

  return (
    <div className="main-layout flex min-h-screen w-full" data-collapsed={isCollapsed}>
      <MainNav isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} role="admin" />
      <main className="overflow-y-auto p-4 md:p-8 flex-1">{children}</main>
    </div>
  );
}
