'use client';
import { createContext, useContext } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Database } from 'firebase/database';

export interface FirebaseContextValue {
  firebaseApp: FirebaseApp | null;
  auth: Auth | null;
  database: Database | null;
}

// Create the context with an initial empty value
export const FirebaseContext = createContext<FirebaseContextValue | null>(null);

export const FirebaseProvider = ({
  children,
  firebaseApp,
  auth,
  database,
}: {
  children: React.ReactNode;
  firebaseApp: FirebaseApp | null;
  auth: Auth | null;
  database: Database | null;
}) => {
  return (
    <FirebaseContext.Provider value={{ firebaseApp, auth, database }}>
      {children}
    </FirebaseContext.Provider>
  );
};

// Custom hook to use the firebase context
export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const useFirebaseApp = () => useFirebase()?.firebaseApp;
export const useAuth = () => useFirebase()?.auth;
export const useDatabase = () => useFirebase()?.database;
