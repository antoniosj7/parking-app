'use client';
import Link from 'next/link';
import { Logo } from './logo';
import { Button } from './ui/button';
import { useUserRole } from '@/context/user-role-context';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from './ui/sheet';
import { Menu, LogOut } from 'lucide-react';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isMobile?: boolean;
}

const NavLink = ({ href, children, isMobile = false }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  const linkContent = (
    <Link
      href={href}
      className={cn(
        "transition-colors duration-200 ease-in-out",
        "px-4 py-2 rounded-md text-sm font-medium",
        isMobile 
          ? "block w-full text-left text-lg" 
          : "hover:bg-primary/10",
        isActive
          ? "active-nav-link text-primary font-semibold"
          : "text-muted-foreground",
        isMobile && isActive && "bg-primary/10"
      )}
    >
      {children}
    </Link>
  );

  if (isMobile) {
    return <SheetClose asChild>{linkContent}</SheetClose>;
  }

  return linkContent;
};


const AdminNavLinks = ({ isMobile }: { isMobile?: boolean }) => (
    <>
      <NavLink href="/admin" isMobile={isMobile}>Panel Principal</NavLink>
      <NavLink href="/admin/statistics" isMobile={isMobile}>Estadísticas</NavLink>
      <NavLink href="/admin/user-management" isMobile={isMobile}>Gestión de Usuarios</NavLink>
      <NavLink href="/grid" isMobile={isMobile}>Ver Parqueo</NavLink>
    </>
);

const UserNavLinks = ({ isMobile }: { isMobile?: boolean }) => (
    <>
      <NavLink href="/grid" isMobile={isMobile}>Lugares Disponibles</NavLink>
      <NavLink href="/my-account" isMobile={isMobile}>Mi Cuenta</NavLink>
      <NavLink href="/history" isMobile={isMobile}>Historial de Uso</NavLink>
    </>
);


export default function Header() {
  const { userRole, setUserRole } = useUserRole();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const isAdmin = userRole === 'admin';

  const handleLogout = async () => {
    try {
        if (auth) {
            await signOut(auth);
        }
        setUserRole(null);
        toast({
            title: "Sesión cerrada",
            description: "Has cerrado sesión correctamente.",
        });
        router.push('/');
        router.refresh();
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "No se pudo cerrar la sesión. Inténtalo de nuevo.",
        });
    }
  };


  const getLogoLink = () => {
    return isAdmin ? '/admin' : '/grid';
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Desktop Menu */}
        <div className="mr-4 hidden md:flex">
          <Link href={getLogoLink()} className="mr-6 flex items-center space-x-2">
            <Logo className="h-8 w-8" />
            <span className="font-bold font-headline sm:inline-block">PUMG</span>
          </Link>
          <nav className="flex items-center space-x-2 text-sm font-medium">
            {isAdmin ? <AdminNavLinks /> : <UserNavLinks />}
          </nav>
        </div>

        {/* Mobile Menu */}
        <div className="flex w-full items-center justify-between md:hidden">
            <Link href={getLogoLink()} className="flex items-center space-x-2">
                <Logo className="h-8 w-8" />
                <span className="font-bold font-headline">PUMG</span>
            </Link>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Abrir menú</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <Link href={getLogoLink()} className="flex items-center space-x-2 mb-8">
                        <Logo className="h-8 w-8" />
                        <span className="font-bold font-headline text-lg">PUMG</span>
                    </Link>
                    <nav className="grid gap-4 text-lg font-medium">
                       {isAdmin ? <AdminNavLinks isMobile /> : <UserNavLinks isMobile />}
                    </nav>
                    <SheetClose asChild>
                        <Button onClick={handleLogout} variant="outline" className="absolute bottom-8 left-6 right-6">
                            <LogOut className="mr-2 h-4 w-4" />
                            Cerrar Sesión
                        </Button>
                    </SheetClose>
                </SheetContent>
            </Sheet>
        </div>

        <div className="hidden flex-1 items-center justify-end space-x-4 md:flex">
          <Button onClick={handleLogout} asChild variant="outline">
            <Link href="#">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
