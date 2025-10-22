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
    LayoutDashboard, User, History, BarChart2, Users, LogOut,
    ChevronLeft, ChevronRight, ParkingCircle, Settings, Activity
} from 'lucide-react';
import { Button } from './ui/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Logo } from './logo';

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  isCollapsed: boolean;
  pathname: string;
}

const NavLink = ({ href, icon, text, isCollapsed, pathname }: NavLinkProps) => {
  const isActive = pathname === href;

  const content = (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-4 rounded-lg text-sm font-medium transition-all duration-200',
        'group',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
        isCollapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'
      )}
    >
      <div className={cn(
        "transition-transform group-hover:scale-110",
         isActive ? 'text-primary' : ''
      )}>
        {icon}
      </div>
      <span className={cn('whitespace-nowrap transition-all duration-200', isCollapsed ? 'sr-only' : 'delay-100')}>{text}</span>
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

const adminLinks = {
    dashboard: { href: '/admin', icon: <LayoutDashboard size={20} />, text: 'Panel Principal' },
    parkingView: { href: '/grid', icon: <ParkingCircle size={20} />, text: 'Ver Parqueo' },
};

const adminManagementLinks = [
  { href: '/admin/user-management', icon: <Users size={20} />, text: 'Usuarios' },
];

const adminAnalyticsLinks = [
  { href: '/admin/statistics', icon: <BarChart2 size={20} />, text: 'Estadísticas' },
  { href: '/admin/activity', icon: <Activity size={20} />, text: 'Actividad Reciente' },
];


const userLinks = [
  { href: '/grid', icon: <ParkingCircle size={20} />, text: 'Lugares Disponibles' },
  { href: '/my-account', icon: <User size={20} />, text: 'Mi Cuenta' },
  { href: '/history', icon: <History size={20} />, text: 'Historial de Uso' },
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
  const pathname = usePathname();
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
    <aside className={cn(
        "flex flex-col border-r bg-card transition-all duration-300 ease-in-out z-20",
        isCollapsed ? 'w-20' : 'w-64'
    )}>
        <div className={cn("flex items-center border-b h-16 shrink-0", isCollapsed ? 'justify-center px-2' : 'justify-between px-4')}>
            <Link href={isAdmin ? '/admin' : '/grid'} className={cn("flex items-center gap-2 overflow-hidden", isCollapsed ? 'justify-center' : '')}>
                <Logo className='h-8 w-8 text-primary' />
                <span className={cn('font-bold text-lg font-headline whitespace-nowrap transition-opacity', isCollapsed ? 'sr-only' : 'delay-100')}>PUMG</span>
            </Link>
             <button onClick={toggleCollapse} className={cn("hidden md:flex items-center justify-center p-1 rounded-full text-muted-foreground hover:bg-muted transition-colors", isCollapsed ? 'opacity-0 pointer-events-none' : '')}>
                <ChevronLeft size={20} />
            </button>
        </div>
        
        <div className={cn("absolute top-[68px] hidden md:block transition-all duration-300 ease-in-out z-30", isCollapsed ? 'left-[68px]' : 'left-60')}>
             <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <Button variant="outline" size="icon" className="rounded-full h-8 w-8 bg-card/80 backdrop-blur-sm" onClick={toggleCollapse}>
                            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>{isCollapsed ? 'Expandir' : 'Colapsar'}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>

        <nav className="flex-1 space-y-2 p-3 mt-4 overflow-y-auto">
            {isAdmin ? (
                 <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3']} className="w-full">
                    {isCollapsed ? (
                        <>
                             <NavLink {...adminLinks.dashboard} isCollapsed={isCollapsed} pathname={pathname} />
                             <NavLink {...adminLinks.parkingView} isCollapsed={isCollapsed} pathname={pathname} />
                             {adminManagementLinks.map(link => <NavLink key={link.href} {...link} isCollapsed={isCollapsed} pathname={pathname} />)}
                             {adminAnalyticsLinks.map(link => <NavLink key={link.href} {...link} isCollapsed={isCollapsed} pathname={pathname} />)}
                        </>
                    ) : (
                        <>
                           <NavLink {...adminLinks.dashboard} isCollapsed={isCollapsed} pathname={pathname} />
                           <NavLink {...adminLinks.parkingView} isCollapsed={isCollapsed} pathname={pathname} />

                           <AccordionItem value="item-2" className="border-none px-4 pt-4 pb-2">
                             <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Gestión</h3>
                           </AccordionItem>
                           <div className="space-y-1">
                            {adminManagementLinks.map(link => <NavLink key={link.href} {...link} isCollapsed={isCollapsed} pathname={pathname} />)}
                           </div>
                           
                           <AccordionItem value="item-3" className="border-none px-4 pt-4 pb-2">
                             <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Análisis</h3>
                           </AccordionItem>
                           <div className="space-y-1">
                            {adminAnalyticsLinks.map(link => <NavLink key={link.href} {...link} isCollapsed={isCollapsed} pathname={pathname} />)}
                           </div>
                        </>
                    )}
                 </Accordion>
            ) : (
                userLinks.map((link) => (
                    <NavLink key={link.href} {...link} isCollapsed={isCollapsed} pathname={pathname} />
                ))
            )}
        </nav>
        
        <div className="border-t mt-auto shrink-0">
            <div className={cn("flex items-center gap-3 p-3")}>
                 <div className={cn("flex-shrink-0", isCollapsed ? 'w-full' : '')}>
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size={isCollapsed ? 'icon' : 'default'} onClick={handleLogout} className={cn("w-full justify-start text-muted-foreground hover:text-destructive", isCollapsed && "justify-center")}>
                                <LogOut size={20} />
                                <span className={cn('ml-4 transition-opacity', isCollapsed ? 'sr-only' : '')}>Cerrar Sesión</span>
                            </Button>
                        </TooltipTrigger>
                         {isCollapsed && <TooltipContent side="right"><p>Cerrar Sesión</p></TooltipContent>}
                      </Tooltip>
                    </TooltipProvider>
                 </div>
                 <div className={cn("flex flex-col overflow-hidden transition-all duration-200", isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100')}>
                     <p className="text-sm font-semibold truncate">{user?.displayName || 'Usuario'}</p>
                     <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                 </div>
            </div>
        </div>
    </aside>
  );
}
