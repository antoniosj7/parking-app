'use client';

import React, { useState, useEffect } from 'react';
import Loading from '@/app/loading';
import MainNav from '@/components/main-nav';
import { useUserRole } from '@/context/user-role-context';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { userRole, isLoading } = useUserRole();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const collapsedState = localStorage.getItem('nav-collapsed') === 'true';
        setIsCollapsed(collapsedState);
    }
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
     if (typeof window !== 'undefined') {
        localStorage.setItem('nav-collapsed', String(newState));
    }
  };
  
  if (isLoading) {
    return <Loading />;
  }
  
  // Si no hay rol (y no estamos cargando), es una página pública (login/signup)
  if (!userRole) {
    return <>{children}</>;
  }

  // Si hay un rol, muestra el diseño principal con el menú de navegación.
  return (
    <div className="main-layout flex min-h-screen w-full" data-collapsed={isCollapsed}>
      <MainNav isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
      <main className="overflow-y-auto p-4 md:p-8 flex-1">{children}</main>
    </div>
  );
}