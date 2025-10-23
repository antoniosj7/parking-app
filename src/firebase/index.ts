import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getDatabase, type Database } from 'firebase/database';
import { FirebaseProvider, useFirebase, useFirebaseApp, useAuth, useDatabase } from './provider';
import { useUser } from './auth/use-user';
import { FirebaseClientProvider } from './client-provider';
import { useRtdbValue } from './rtdb/use-rtdb-value';


// This must be populated by the server with the config object
// from the Firebase project, and then passed to initializeFirebase.
const firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG || '{}');

let firebaseApp: FirebaseApp;
let auth: Auth;
let database: Database;

// This initializes Firebase on the client side.
function initializeFirebase() {
  if (getApps().length === 0) {
    if (!firebaseConfig.projectId) {
      console.error("Firebase config is not available.");
    }
    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    database = getDatabase(firebaseApp);
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
