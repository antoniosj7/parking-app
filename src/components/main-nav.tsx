'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { useAuth, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard, LogOut,
    ChevronLeft, ChevronRight, ParkingCircle, Users,
    History, BarChart, FileText, Settings, User as UserIcon, Clock
} from 'lucide-react';
import { Button } from './ui/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { Logo } from './logo';
import { Avatar, AvatarFallback } from './ui/avatar';

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  isCollapsed: boolean;
  pathname: string;
}

const NavLink = ({ href, icon, text, isCollapsed, pathname }: NavLinkProps) => {
  const isActive = pathname.startsWith(href);

  const content = (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-4 rounded-lg text-sm font-medium transition-all duration-200',
        'group',
        isActive
          ? 'bg-primary/10 text-primary shadow-inner_sm ring-1 ring-primary/20'
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

const adminLinks = [
    { href: '/admin/parking', icon: <LayoutDashboard size={20} />, text: 'Parqueo' },
    { href: '/admin/sessions', icon: <History size={20} />, text: 'Sesiones' },
    { href: '/admin/billing', icon: <FileText size={20} />, text: 'Cobros y Tarifas' },
    { href: '/admin/user-management', icon: <Users size={20} />, text: 'Usuarios' },
    { href: '/admin/stats', icon: <BarChart size={20} />, text: 'Estadísticas' },
    { href: '/admin/settings', icon: <Settings size={20} />, text: 'Ajustes' },
];

const userLinks = [
  { href: '/app/parking', icon: <ParkingCircle size={20} />, text: 'Ver Parqueo' },
  { href: '/app/session', icon: <Clock size={20} />, text: 'Mi Sesión' },
  { href: '/app/history', icon: <History size={20} />, text: 'Mi Historial' },
  { href: '/app/profile', icon: <UserIcon size={20} />, text: 'Mi Perfil' },
];

interface MainNavProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  role: 'admin' | 'user';
}

export default function MainNav({ isCollapsed, toggleCollapse, role }: MainNavProps) {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  
  const userInitial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U');

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente.",
      });
      router.push('/');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cerrar la sesión. Inténtalo de nuevo.",
      });
    }
  };
  
  const links = role === 'admin' ? adminLinks : userLinks;
  const homeHref = role === 'admin' ? '/admin/parking' : '/app/parking';
  const title = role === 'admin' ? 'Panel Admin' : 'PUMG';
  const profileName = role === 'admin' ? 'Administrador' : (user?.displayName || 'Usuario');

  return (
    <aside className={cn(
        "flex h-screen flex-col border-r bg-card transition-all duration-300 ease-in-out z-20 sticky top-0",
        isCollapsed ? 'w-20' : 'w-64'
    )}>
        <div className={cn("flex items-center border-b h-16 shrink-0", isCollapsed ? 'justify-center px-2' : 'justify-between px-4')}>
            <Link href={homeHref} className={cn("flex items-center gap-2 overflow-hidden", isCollapsed ? 'justify-center' : '')}>
                <Logo className='h-8 w-8 text-primary' />
                <span className={cn('font-bold text-lg font-headline whitespace-nowrap transition-opacity', isCollapsed ? 'sr-only' : 'delay-100')}>{title}</span>
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
           <div className="space-y-1">
              {links.map(link => <NavLink key={link.href} {...link} isCollapsed={isCollapsed} pathname={pathname} />)}
            </div>
        </nav>
        
        <div className="mt-auto border-t p-3">
          <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "")}>
             <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/20 text-primary font-semibold">{userInitial}</AvatarFallback>
             </Avatar>
             <div className={cn("flex flex-col overflow-hidden", isCollapsed ? "sr-only" : "")}>
                <span className="text-sm font-medium truncate">{profileName}</span>
                <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
             </div>
             <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className={cn("rounded-lg", isCollapsed ? "" : "ml-auto")} onClick={handleLogout}>
                            <LogOut size={20} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>Cerrar Sesión</p>
                    </TooltipContent>
                </Tooltip>
             </TooltipProvider>
          </div>
        </div>
    </aside>
  )
}
