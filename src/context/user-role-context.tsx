'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from '@/firebase';

type UserRole = 'admin' | 'user' | null;

interface UserRoleContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      // Recuperar el rol del token de Firebase para persistirlo en refreshes
      user.getIdTokenResult().then((idTokenResult) => {
        const role = (idTokenResult.claims.role as string) || 'user';
        setUserRole(role as UserRole);
      }).catch((error) => {
        console.error('Error obteniendo rol del token:', error);
        setUserRole('user'); // Fallback a user
      });
    } else {
      setUserRole(null);
    }
  }, [user]);

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole }}>
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
