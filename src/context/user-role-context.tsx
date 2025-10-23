'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser, useDatabase } from '@/firebase';
import { ref, onValue } from 'firebase/database';

type UserRole = 'admin' | 'user' | null;

interface UserRoleContextType {
  userRole: UserRole;
  isLoading: boolean;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const { user, loading: userLoading } = useUser();
  const database = useDatabase();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    if (userLoading) {
      return;
    }
    
    if (user && database) {
      const userRoleRef = ref(database, `users/${user.uid}/role`);
      const unsubscribe = onValue(userRoleRef, (snapshot) => {
        const role = snapshot.val() as 'admin' | 'user' || 'user';
        setUserRole(role);
        setIsLoading(false);
      }, (error) => {
        console.error('Error fetching user role from RTDB:', error);
        setUserRole('user');
        setIsLoading(false);
      });

      return () => unsubscribe();
    } else {
      setUserRole(null);
      setIsLoading(false);
    }
  }, [user, userLoading, database]);

  return (
    <UserRoleContext.Provider value={{ userRole, isLoading }}>
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
