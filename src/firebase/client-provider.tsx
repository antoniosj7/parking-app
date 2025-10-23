'use client';

import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';
import { getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { UserRoleProvider } from '@/context/user-role-context';

// This provider is used to initialize Firebase on the client side.
// It ensures that Firebase is initialized only once.
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  // Check if the app is already initialized to avoid re-initializing
  const appAlreadyInitialized = getApps().length > 0;
  
  const { firebaseApp, auth, database } = appAlreadyInitialized ? {
      firebaseApp: getApp(),
      auth: getAuth(getApp()),
      database: getDatabase(getApp())
  } : initializeFirebase();
  
  return (
    <FirebaseProvider firebaseApp={firebaseApp} auth={auth} database={database}>
      <UserRoleProvider>
        {children}
      </UserRoleProvider>
    </FirebaseProvider>
  );
}
