'use client';
import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Loading from '@/app/loading';
import { useUserRole } from '@/context/user-role-context';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { userRole, isLoading } = useUserRole();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return; // Wait until role is determined
    }

    const isAuthPage = pathname === '/' || pathname === '/signup';
    
    if (userRole) { // User is logged in
      const isAdminArea = pathname.startsWith('/admin');
      const isUserArea = pathname.startsWith('/app');

      if (userRole === 'admin') {
        if (!isAdminArea) {
          router.replace('/admin/parking');
        }
      } else { // userRole is 'user'
        if (!isUserArea) {
          router.replace('/app/parking');
        }
      }
    } else { // User is not logged in
      if (!isAuthPage) {
        router.replace('/');
      }
    }
  }, [isLoading, userRole, pathname, router]);

  // While loading, show a full-screen loader
  if (isLoading) {
    return <Loading />;
  }
  
  // Prevent rendering incorrect layout during redirection
  const isAuthPage = pathname === '/' || pathname === '/signup';
  if (!userRole && !isAuthPage) return <Loading />;
  if (userRole === 'admin' && !pathname.startsWith('/admin')) return <Loading />;
  if (userRole === 'user' && !pathname.startsWith('/app')) return <Loading />;


  // If everything is correct, render the children
  return <>{children}</>;
}
