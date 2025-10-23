'use client';

import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';

// This provider is used to initialize Firebase on the client side.
// It ensures that Firebase is initialized only once.
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const { firebaseApp, auth, database } = initializeFirebase();
  return (
    <FirebaseProvider firebaseApp={firebaseApp} auth={auth} database={database}>
      {children}
    </FirebaseProvider>
  );
}
