import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getDatabase, type Database } from 'firebase/database';
import { FirebaseProvider, useFirebase, useFirebaseApp, useAuth, useDatabase } from './provider';
import { useUser } from './auth/use-user';
import { FirebaseClientProvider } from './client-provider';
import { useRtdbValue } from './rtdb/use-rtdb-value';

let app: FirebaseApp;
let auth: Auth;
let database: Database;

// This function ensures that Firebase is initialized only once. (Singleton pattern)
function initializeFirebase() {
  if (getApps().length > 0) {
    app = getApp();
  } else {
    const firebaseConfigStr = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;
    if (!firebaseConfigStr) {
      throw new Error("La variable de entorno NEXT_PUBLIC_FIREBASE_CONFIG no está definida.");
    }
    const firebaseConfig = JSON.parse(firebaseConfigStr);
    app = initializeApp(firebaseConfig);
  }
  
  auth = getAuth(app);
  database = getDatabase(app);

  return { firebaseApp: app, auth, database };
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
