'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from '@/firebase';

type UserRole = 'admin' | 'user' | null;

interface UserRoleContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isLoading: boolean;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

// Antonio SJ: Usuarios de prueba locales para desarrollo
const DEV_USERS = {
  'admin@pumg.com': { role: 'admin' },
  'user@pumg.com': { role: 'user' }
};

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    setIsLoading(userLoading);
    if (userLoading) {
      return;
    }
    
    if (user) {
      // Antonio SJ: En desarrollo, si es un usuario de prueba, asigna el rol localmente.
      if (process.env.NODE_ENV === 'development') {
          const devUser = DEV_USERS[user.email as keyof typeof DEV_USERS];
          if (devUser) {
              setUserRole(devUser.role as UserRole);
              setIsLoading(false);
              return;
          }
      }

      // Antonio SJ: Para usuarios reales, obtener el rol del token de Firebase.
      user.getIdTokenResult().then((idTokenResult) => {
        const role = (idTokenResult.claims.role as string) || 'user';
        setUserRole(role as UserRole);
      }).catch((error) => {
        console.error('Error obteniendo rol del token:', error);
        setUserRole('user'); // Fallback a user
      }).finally(() => {
        setIsLoading(false);
      });
    } else {
      setUserRole(null);
      setIsLoading(false);
    }
  }, [user, userLoading]);

  // Si el rol está siendo seteado por una fuente externa (como el dev login)
  const setRoleDirectly = (role: UserRole) => {
    setUserRole(role);
    setIsLoading(false);
  }

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole: setRoleDirectly, isLoading }}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
}
