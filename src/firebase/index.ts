import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getDatabase, type Database } from 'firebase/database';
import { FirebaseProvider, useFirebase, useFirebaseApp, useAuth, useDatabase } from './provider';
import { useUser } from './auth/use-user';
import { FirebaseClientProvider } from './client-provider';
import { useRtdbValue } from './rtdb/use-rtdb-value';

let firebaseApp: FirebaseApp;

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

const auth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);

// This function is a bit of a placeholder, we are not using it to initialize the app
// on a per-request basis, but we are keeping it for now.
function initializeFirebase() {
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
