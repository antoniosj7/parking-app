import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getDatabase, type Database } from 'firebase/database';
import { FirebaseProvider, useFirebase, useFirebaseApp, useAuth, useDatabase } from './provider';
import { useUser } from './auth/use-user';
import { FirebaseClientProvider } from './client-provider';
import { useRtdbValue } from './rtdb/use-rtdb-value';

let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;
let database: Database | null = null;

function initializeFirebase() {
  if (typeof window !== 'undefined') {
    if (!firebaseApp) {
      const firebaseConfigStr = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;
      if (!firebaseConfigStr) {
        throw new Error("La variable de entorno NEXT_PUBLIC_FIREBASE_CONFIG no está definida.");
      }
      const firebaseConfig = JSON.parse(firebaseConfigStr);

      if (getApps().length === 0) {
        firebaseApp = initializeApp(firebaseConfig);
      } else {
        firebaseApp = getApp();
      }
      auth = getAuth(firebaseApp);
      database = getDatabase(firebaseApp);
    }
  }
  return { firebaseApp, auth, database };
}


export {
  initializeFirebase,
  FirebaseProvider,
  FirebaseClientProvider,
  useUser,
  useFirebase,
  useFirebaseApp,
  useAuth,
  useDatabase,
  useRtdbValue,
};
