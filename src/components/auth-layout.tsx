'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import Loading from '@/app/loading';
import MainNav from '@/components/main-nav';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Solo se ejecuta en el cliente
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
  
  if (loading) {
    return <Loading />;
  }
  
  // Si no hay usuario (y no estamos cargando), es una página pública (login/signup)
  if (!user) {
    // Renderiza solo el contenido de la página, sin el diseño de navegación principal.
    return <>{children}</>;
  }

  // Si hay un usuario, muestra el diseño principal con el menú de navegación.
  return (
    <div className="main-layout" data-collapsed={isCollapsed}>
      <MainNav isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
      <main className="overflow-y-auto p-4 md:p-8">{children}</main>
    </div>
  );
}
