'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './logo';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const AdminNav = () => (
  <nav className="hidden items-center gap-4 text-sm lg:flex lg:gap-6">
    <Link
      href="/admin"
      className="text-foreground/80 transition-colors hover:text-foreground font-semibold"
    >
      Panel Principal
    </Link>
    <Link
      href="/admin/statistics"
      className="text-foreground/60 transition-colors hover:text-foreground"
    >
      Estadísticas
    </Link>
    <Link
      href="/admin/user-management"
      className="text-foreground/60 transition-colors hover:text-foreground"
    >
      Gestión de Usuarios
    </Link>
     <Link
      href="/grid"
      className="text-foreground/60 transition-colors hover:text-foreground"
    >
      Ver Parrilla
    </Link>
  </nav>
);

const UserNav = () => (
  <nav className="hidden items-center gap-4 text-sm lg:flex lg:gap-6">
    <Link
      href="/grid"
      className="text-foreground/80 transition-colors hover:text-foreground font-semibold"
    >
      Lugares Disponibles
    </Link>
    <Link
      href="/my-account"
      className="text-foreground/60 transition-colors hover:text-foreground"
    >
      Mi Cuenta (Uso y Pago)
    </Link>
    <Link
      href="/history"
      className="text-foreground/60 transition-colors hover:text-foreground"
    >
      Historial de Uso
    </Link>
  </nav>
);


export default function Header() {
  const pathname = usePathname();
  // El menú de admin se muestra en las rutas /admin/* y en /grid
  const isAdminView = pathname.startsWith('/admin') || pathname === '/grid';

  const getLogoLink = () => {
    // Si estamos en cualquier ruta que no sea de admin, el logo lleva a /grid
    // Si estamos en una ruta de admin, el logo lleva a /admin
    return pathname.startsWith('/admin') ? '/admin' : '/grid';
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href={getLogoLink()} className="mr-6 flex items-center space-x-2">
          <Logo className="h-8 w-8" />
          <span className="font-bold font-headline sm:inline-block">
            PUMG
          </span>
        </Link>
        
        {isAdminView ? <AdminNav /> : <UserNav />}

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Button asChild variant="outline">
              <Link href="/">Cerrar Sesión</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
