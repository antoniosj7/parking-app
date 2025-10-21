import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { FirebaseProvider, useFirebase, useFirebaseApp, useFirestore, useAuth } from './provider';
import { useUser } from './auth/use-user';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';
import { FirebaseClientProvider } from './client-provider';

// This must be populated by the server with the config object
// from the Firebase project, and then passed to initializeFirebase.
const firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG || '{}');

let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

// This initializes Firebase on the client side.
function initializeFirebase() {
  if (getApps().length === 0) {
    if (!firebaseConfig.projectId) {
      console.error("Firebase config is not available.");
    }
    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);
  }
  return { firebaseApp, auth, firestore };
}

export {
  initializeFirebase,
  FirebaseProvider,
  FirebaseClientProvider,
  useCollection,
  useDoc,
  useUser,
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
};
