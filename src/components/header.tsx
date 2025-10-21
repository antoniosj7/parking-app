'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { useUserRole } from '@/context/user-role-context';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Logo } from './logo';
import { 
    LogOut, 
    LayoutGrid, 
    User, 
    History, 
    Settings,
    BarChart2,
    Users
} from 'lucide-react';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink = ({ href, children }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'px-3 py-2 rounded-md text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
      )}
    >
      {children}
    </Link>
  );
};

const AdminNavLinks = () => (
  <>
    <NavLink href="/admin">Panel Principal</NavLink>
    <NavLink href="/admin/statistics">Estadísticas</NavLink>
    <NavLink href="/admin/user-management">Gestión de Usuarios</NavLink>
    <NavLink href="/grid">Ver Parqueo</NavLink>
  </>
);

const UserNavLinks = () => (
  <>
    <NavLink href="/grid">Lugares Disponibles</NavLink>
    <NavLink href="/my-account">Mi Cuenta</NavLink>
    <NavLink href="/history">Historial de Uso</NavLink>
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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
           <Link href={isAdmin ? '/admin' : '/grid'} className="flex items-center gap-2">
             <Logo className='h-8 w-8' />
             <span className='font-bold font-headline hidden sm:inline-block'>PUMG</span>
           </Link>
           <nav className="hidden md:flex items-center gap-2">
            {isAdmin ? <AdminNavLinks /> : <UserNavLinks />}
           </nav>
        </div>

        <div className="flex items-center">
            <Button onClick={handleLogout} variant="ghost" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
            </Button>
        </div>
      </div>
       {/* Mobile Nav */}
      <div className="md:hidden p-2 border-t">
          <nav className="flex justify-around items-center gap-1">
             {isAdmin ? <AdminNavLinks /> : <UserNavLinks />}
          </nav>
      </div>
    </header>
  );
}
