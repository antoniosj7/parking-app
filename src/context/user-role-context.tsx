'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser, useDatabase } from '@/firebase';
import { ref, onValue } from 'firebase/database';

type UserRole = 'admin' | 'user' | null;

interface UserRoleContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isLoading: boolean;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const { user, loading: userLoading } = useUser();
  const database = useDatabase();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userLoading) {
      setIsLoading(true);
      return;
    }
    
    if (user && database) {
      // Get role from Realtime Database
      const userRoleRef = ref(database, `users/${user.uid}/role`);
      const unsubscribe = onValue(userRoleRef, (snapshot) => {
        const role = snapshot.val() || 'user';
        setUserRole(role);
        setIsLoading(false);
      }, (error) => {
        console.error('Error fetching user role from RTDB:', error);
        setUserRole('user'); // Fallback to user
        setIsLoading(false);
      });

      return () => unsubscribe();
    } else {
      setUserRole(null);
      setIsLoading(false);
    }
  }, [user, userLoading, database]);

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole, isLoading }}>
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
