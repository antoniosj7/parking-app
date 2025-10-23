'use client';
import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Loading from '@/app/loading';
import { useUser } from '@/firebase';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: userLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (userLoading) {
      return;
    }

    const isAuthPage = pathname === '/' || pathname === '/signup';
    
    if (user) { 
      if (isAuthPage) {
        router.replace('/dashboard');
      }
    } else { 
      if (!isAuthPage) {
        router.replace('/');
      }
    }
  }, [userLoading, user, pathname, router]);

  if (userLoading) {
    return <Loading />;
  }

  const isAuthPage = pathname === '/' || pathname === '/signup';

  if (!user && !isAuthPage) return <Loading />;
  if (user && isAuthPage) return <Loading />;
  
  return <div className="w-full">{children}</div>;
}
