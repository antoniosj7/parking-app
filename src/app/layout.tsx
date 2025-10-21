import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { UserRoleProvider } from '@/context/user-role-context';
import MainNav from '@/components/main-nav';

export const metadata: Metadata = {
  title: 'PUMG - Parrilla Universal de Gestión de Aparcamiento',
  description: 'Sistema de gestión de aparcamiento en tiempo real.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isLoginPage = (children as any)?.type.name === 'LoginPage' || (children as any)?.props?.child?.type.name === 'LoginPage';

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("min-h-screen bg-background font-body antialiased")}>
        <UserRoleProvider>
          <FirebaseClientProvider>
            {isLoginPage ? (
              children
            ) : (
              <div className="main-layout" id="main-layout">
                <MainNav />
                <main className="flex-1 overflow-auto">{children}</main>
              </div>
            )}
            <Toaster />
          </FirebaseClientProvider>
        </UserRoleProvider>
      </body>
    </html>
  );
}
