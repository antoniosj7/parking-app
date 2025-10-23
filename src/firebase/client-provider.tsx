'use client';

import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';
import { useEffect } from 'react';
import { getApp } from 'firebase/app';

// This provider is used to initialize Firebase on the client side.
// It ensures that Firebase is initialized only once.
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const { firebaseApp, auth, database } = initializeFirebase();

  useEffect(() => {
    try {
        console.info("[FIREBASE CFG]", getApp().options);
    } catch (e) {
        // This might fail on first render, it's ok.
    }
  }, []);

  return (
    <FirebaseProvider firebaseApp={firebaseApp} auth={auth} database={database}>
      {children}
    </FirebaseProvider>
  );
}
