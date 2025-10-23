'use client';
import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Loading from '@/app/loading';
import { useUser } from '@/firebase';
import MainNav from './main-nav';
import { useUserRole } from '@/context/user-role-context';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: userLoading } = useUser();
  const { userRole, isLoading: roleLoading } = useUserRole();
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

  const isLoading = userLoading || roleLoading;

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const isAuthPage = pathname === '/' || pathname === '/signup';
    
    if (user) { // User is logged in
      const targetPath = userRole === 'admin' ? '/admin/parking' : '/app/parking';
      
      if (isAuthPage) {
        router.replace(targetPath);
      } else {
        // Redirect if user is in the wrong section
        if (userRole === 'admin' && !pathname.startsWith('/admin')) {
          router.replace('/admin/parking');
        } else if (userRole === 'user' && !pathname.startsWith('/app')) {
          router.replace('/app/parking');
        }
      }
    } else { // User is not logged in
      if (!isAuthPage) {
        router.replace('/');
      }
    }
  }, [isLoading, user, userRole, pathname, router]);

  if (isLoading) {
    return <Loading />;
  }

  const isAuthPage = pathname === '/' || pathname === '/signup';

  // While loading, or if redirecting, show loading screen
  if (!user && !isAuthPage) return <Loading />;
  if (user && isAuthPage) return <Loading />;
  
  // If not logged in, just show the auth pages (login/signup)
  if (!user) {
    return <>{children}</>;
  }

  // Determine correct layout based on role
  const roleForNav = pathname.startsWith('/admin') ? 'admin' : 'user';

  if (pathname.startsWith('/admin') && userRole !== 'admin') return <Loading />;
  if (pathname.startsWith('/app') && userRole !== 'user') return <Loading />;

  return (
    <div className="main-layout flex min-h-screen w-full" data-collapsed={isCollapsed}>
      <MainNav isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} role={roleForNav} />
      <main className="overflow-y-auto p-4 md:p-8 flex-1">{children}</main>
    </div>
  );
}
