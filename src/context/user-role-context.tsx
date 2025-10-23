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
    // Start loading whenever the user object or its loading state changes.
    setIsLoading(true);

    if (userLoading) {
      // Still waiting for Firebase Auth to determine if a user is logged in.
      return;
    }
    
    if (user && database) {
      // User is authenticated, now get their role from Realtime Database.
      const userRoleRef = ref(database, `users/${user.uid}/role`);
      const unsubscribe = onValue(userRoleRef, (snapshot) => {
        const role = snapshot.val() as 'admin' | 'user' || 'user'; // Default to 'user' if no role is set
        setUserRole(role);
        setIsLoading(false); // Finished loading role
      }, (error) => {
        console.error('Error fetching user role from RTDB:', error);
        setUserRole('user'); // Fallback to 'user' on error
        setIsLoading(false);
      });

      return () => unsubscribe(); // Cleanup listener on unmount
    } else {
      // No user is authenticated.
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
