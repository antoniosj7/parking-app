'use client';
// Antonio SJ

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { useAuth, useUser } from '@/firebase';
import { useUserRole } from '@/context/user-role-context';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
    LayoutGrid, User, History, BarChart2, Users, LogOut,
    ChevronLeft, ChevronRight, ParkingCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { Logo } from './logo';

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  isCollapsed: boolean;
}

const NavLink = ({ href, icon, text, isCollapsed }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  const content = (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-4 px-3 py-2 rounded-lg text-base transition-colors duration-200',
        isActive
          ? 'bg-primary/10 text-primary font-semibold'
          : 'text-muted-foreground hover:bg-primary/5 hover:text-primary',
        isCollapsed ? 'justify-center' : ''
      )}
    >
      {icon}
      <span className={cn('whitespace-nowrap transition-opacity', isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto')}>{text}</span>
    </Link>
  );

  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right">
            <p>{text}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
};


const adminLinks = [
  { href: '/admin', icon: <LayoutGrid />, text: 'Panel Principal' },
  { href: '/admin/statistics', icon: <BarChart2 />, text: 'Estadísticas' },
  { href: '/admin/user-management', icon: <Users />, text: 'Gestión de Usuarios' },
  { href: '/grid', icon: <ParkingCircle />, text: 'Ver Parqueo' },
];

const userLinks = [
  { href: '/grid', icon: <ParkingCircle />, text: 'Lugares Disponibles' },
  { href: '/my-account', icon: <User />, text: 'Mi Cuenta' },
  { href: '/history', icon: <History />, text: 'Historial de Uso' },
];

interface MainNavProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

export default function MainNav({ isCollapsed, toggleCollapse }: MainNavProps) {
  const { userRole, setUserRole } = useUserRole();
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const isAdmin = userRole === 'admin';
  const links = isAdmin ? adminLinks : userLinks;

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
    <aside className={cn(
        "flex flex-col border-r bg-background transition-all duration-300 ease-in-out",
        isCollapsed ? 'w-20' : 'w-64'
    )}>
        {/* Header */}
        <div className={cn("flex items-center border-b h-16 px-4", isCollapsed ? 'justify-center' : 'justify-between')}>
            <Link href={isAdmin ? '/admin' : '/grid'} className={cn("flex items-center gap-2 overflow-hidden", isCollapsed ? 'justify-center' : '')}>
                <Logo className='h-8 w-8' />
                <span className={cn('font-bold font-headline whitespace-nowrap transition-opacity', isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto')}>PUMG</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleCollapse} className={cn('hidden md:flex transition-opacity', isCollapsed ? 'opacity-0' : 'opacity-100')}>
                <ChevronLeft />
            </Button>
        </div>

        {/* Floating Toggle Button */}
         <div className="hidden md:block absolute top-[calc(50%-20px)] transition-all duration-300 ease-in-out"
              style={{ left: isCollapsed ? '60px' : '235px' }}>
            <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-full" onClick={toggleCollapse}>
                            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>{isCollapsed ? 'Expandir' : 'Colapsar'}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>


        {/* Navigation Links */}
        <nav className="flex-1 space-y-2 p-4">
            {links.map((link) => (
                <NavLink key={link.href} {...link} isCollapsed={isCollapsed} />
            ))}
        </nav>
        
        {/* Footer with User Info and Logout */}
        <div className="border-t p-4">
            <div className={cn("flex items-center gap-3", isCollapsed ? 'justify-center' : '')}>
                 <div className="flex-shrink-0">
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full">
                                <LogOut />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>Cerrar Sesión</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                 </div>
                 <div className={cn("flex flex-col overflow-hidden transition-all", isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100')}>
                     <p className="text-sm font-medium truncate">{user?.displayName || 'Usuario'}</p>
                     <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                 </div>
            </div>
        </div>
    </aside>
  );
}