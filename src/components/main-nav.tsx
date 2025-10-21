'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { useUserRole } from '@/context/user-role-context';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Logo } from './logo';
import { 
    LogOut, 
    PanelLeft, 
    PanelRight, 
    LayoutGrid, 
    User, 
    History, 
    Settings,
    BarChart2,
    Users
} from 'lucide-react';

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
}

const NavLink = ({ href, icon, label, isCollapsed }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={cn(
              'flex items-center h-10 px-3 rounded-lg transition-colors duration-200',
              isActive
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-muted-foreground hover:bg-primary/5 hover:text-primary',
              isCollapsed ? 'justify-center' : 'justify-start gap-3'
            )}
          >
            {icon}
            <span className={cn('whitespace-nowrap', isCollapsed && 'sr-only')}>
              {label}
            </span>
          </Link>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right">
            <p>{label}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

const AdminNavLinks = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <>
    <NavLink href="/admin" icon={<Settings className="h-5 w-5" />} label="Panel Principal" isCollapsed={isCollapsed} />
    <NavLink href="/admin/statistics" icon={<BarChart2 className="h-5 w-5" />} label="Estadísticas" isCollapsed={isCollapsed} />
    <NavLink href="/admin/user-management" icon={<Users className="h-5 w-5" />} label="Gestión de Usuarios" isCollapsed={isCollapsed} />
    <NavLink href="/grid" icon={<LayoutGrid className="h-5 w-5" />} label="Ver Parqueo" isCollapsed={isCollapsed} />
  </>
);

const UserNavLinks = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <>
    <NavLink href="/grid" icon={<LayoutGrid className="h-5 w-5" />} label="Lugares Disponibles" isCollapsed={isCollapsed} />
    <NavLink href="/my-account" icon={<User className="h-5 w-5" />} label="Mi Cuenta" isCollapsed={isCollapsed} />
    <NavLink href="/history" icon={<History className="h-5 w-5" />} label="Historial de Uso" isCollapsed={isCollapsed} />
  </>
);

export default function MainNav() {
  const { userRole, setUserRole } = useUserRole();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    // Persist to DOM for CSS grid layout to react
    document.getElementById('main-layout')?.setAttribute('data-collapsed', String(!isCollapsed));
  };

  return (
    <aside className="sticky top-0 h-screen flex flex-col p-2 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ease-in-out">
      <div className="flex items-center h-16 px-2 mb-4">
        <Link href={isAdmin ? '/admin' : '/grid'} className="flex items-center gap-2">
          <Logo className={cn('h-8 w-8 transition-transform', isCollapsed && 'scale-110')} />
          <span className={cn('font-bold font-headline whitespace-nowrap', isCollapsed && 'sr-only')}>
            PUMG
          </span>
        </Link>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {isAdmin ? <AdminNavLinks isCollapsed={isCollapsed} /> : <UserNavLinks isCollapsed={isCollapsed} />}
      </nav>

      <div className="mt-auto flex flex-col gap-2">
        <Button onClick={toggleCollapse} variant="outline" size="icon" className={cn('justify-center', !isCollapsed && 'self-end')}>
          {isCollapsed ? <PanelRight className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
          <span className="sr-only">{isCollapsed ? 'Expandir menú' : 'Contraer menú'}</span>
        </Button>
        
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
                <Button onClick={handleLogout} variant="outline" size={isCollapsed ? "icon" : "default"}>
                    <LogOut className="h-5 w-5" />
                    <span className={cn('whitespace-nowrap', isCollapsed && 'sr-only')}>Cerrar Sesión</span>
                </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                <p>Cerrar Sesión</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  );
}
