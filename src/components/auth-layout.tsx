'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Loading from '@/app/loading';
import { useUserRole } from '@/context/user-role-context';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { userRole, isLoading } = useUserRole();
  const pathname = usePathname();
  const router = useRouter();

  if (isLoading) {
    return <Loading />;
  }

  // Si el usuario no ha iniciado sesión, solo puede ver las páginas de login/signup
  if (!userRole) {
    if (pathname === '/' || pathname === '/signup') {
      return <>{children}</>;
    }
    // Si intenta acceder a otra página sin sesión, redirigir al login
    if (typeof window !== 'undefined') {
        router.push('/');
    }
    return <Loading />;
  }

  // Lógica de protección de rutas y redirección de roles
  const isAdminArea = pathname.startsWith('/admin');
  const isUserArea = pathname.startsWith('/app');

  if (userRole === 'admin' && !isAdminArea) {
    // Si es admin pero está fuera del área de admin, redirigir a su panel
    if (typeof window !== 'undefined') {
      router.push('/admin/parking');
    }
    return <Loading />;
  }

  if (userRole === 'user' && !isUserArea) {
    // Si es usuario normal pero está fuera de su área, redirigir a su panel
    if (typeof window !== 'undefined') {
      router.push('/app/parking');
    }
    return <Loading />;
  }

  // Si el rol y el área coinciden, o es una página pública permitida (lo cual ya se manejó), renderizar.
  return <>{children}</>;
}
