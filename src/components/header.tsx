'use client';
import Link from 'next/link';
import { Logo } from './logo';
import { Button } from './ui/button';
import { useUserRole } from '@/context/user-role-context';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from './ui/sheet';
import { Menu, X } from 'lucide-react';
import React from 'react';

const AdminNavLinks = ({ isMobile }: { isMobile?: boolean }) => {
  const LinkWrapper = isMobile ? SheetClose : React.Fragment;
  return (
    <>
      <LinkWrapper {...(isMobile && { asChild: true })}>
        <Link href="/admin" className="font-semibold text-foreground">Panel Principal</Link>
      </LinkWrapper>
      <LinkWrapper {...(isMobile && { asChild: true })}>
        <Link href="/admin/statistics" className="text-muted-foreground">Estadísticas</Link>
      </LinkWrapper>
      <LinkWrapper {...(isMobile && { asChild: true })}>
        <Link href="/admin/user-management" className="text-muted-foreground">Gestión de Usuarios</Link>
      </LinkWrapper>
      <LinkWrapper {...(isMobile && { asChild: true })}>
        <Link href="/grid" className="text-muted-foreground">Ver Parqueo</Link>
      </LinkWrapper>
    </>
  );
};

const UserNavLinks = ({ isMobile }: { isMobile?: boolean }) => {
  const LinkWrapper = isMobile ? SheetClose : React.Fragment;
  return (
    <>
      <LinkWrapper {...(isMobile && { asChild: true })}>
        <Link href="/grid" className="font-semibold text-foreground">Lugares Disponibles</Link>
      </LinkWrapper>
      <LinkWrapper {...(isMobile && { asChild: true })}>
        <Link href="/my-account" className="text-muted-foreground">Mi Cuenta (Uso y Pago)</Link>
      </LinkWrapper>
      <LinkWrapper {...(isMobile && { asChild: true })}>
        <Link href="/history" className="text-muted-foreground">Historial de Uso</Link>
      </LinkWrapper>
    </>
  );
};


export default function Header() {
  const { userRole } = useUserRole();
  const isAdmin = userRole === 'admin';

  const getLogoLink = () => {
    return isAdmin ? '/admin' : '/grid';
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Desktop Menu */}
        <div className="mr-4 hidden md:flex">
          <Link href={getLogoLink()} className="mr-6 flex items-center space-x-2">
            <Logo className="h-8 w-8" />
            <span className="font-bold font-headline sm:inline-block">PUMG</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
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
                    <nav className="grid gap-6 text-lg font-medium mt-8">
                       {isAdmin ? <AdminNavLinks isMobile /> : <UserNavLinks isMobile />}
                    </nav>
                </SheetContent>
            </Sheet>
        </div>

        <div className="hidden flex-1 items-center justify-end space-x-4 md:flex">
          <Button asChild variant="outline">
            <Link href="/">Cerrar Sesión</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
