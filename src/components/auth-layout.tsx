'use client';
import { useUser } from '@/firebase';
import MainNav from '@/components/main-nav';
import Loading from '@/app/loading';
import Header from '@/components/header';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  
  if (loading) {
    return <Loading />;
  }
  
  // Si no hay usuario, es la página de login/signup, no mostramos el nav.
  if (!user) {
    return <>{children}</>;
  }

  // Si hay usuario, mostramos el layout principal con el menú de navegación.
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
