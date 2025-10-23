'use client';
import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Loading from '@/app/loading';
import { useUser } from '@/firebase';
import MainNav from './main-nav';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  useEffect(() => {
    const collapsedState = localStorage.getItem('nav-collapsed') === 'true';
    setIsCollapsed(collapsedState);
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('nav-collapsed', String(newState));
  };


  useEffect(() => {
    if (loading) {
      return;
    }

    const isAuthPage = pathname === '/' || pathname === '/signup';
    
    if (user) { // User is logged in
      if (isAuthPage) {
        router.replace('/parking');
      }
    } else { // User is not logged in
      if (!isAuthPage) {
        router.replace('/');
      }
    }
  }, [loading, user, pathname, router]);

  if (loading) {
    return <Loading />;
  }

  const isAuthPage = pathname === '/' || pathname === '/signup';

  if (!user && !isAuthPage) return <Loading />;
  if (user && isAuthPage) return <Loading />;
  
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="main-layout flex min-h-screen w-full" data-collapsed={isCollapsed}>
      <MainNav isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
      <main className="overflow-y-auto p-4 md:p-8 flex-1">{children}</main>
    </div>
  );
}
