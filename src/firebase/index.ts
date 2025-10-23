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

const firebaseConfig = {
  apiKey: "AIzaSyDuPtIJt8OI8_P1HI0c2lNAaU5NVnNLeIQ",
  authDomain: "studio-4441386650-8a8cf.firebaseapp.com",
  databaseURL: "https://studio-4441386650-8a8cf-default-rtdb.firebaseio.com",
  projectId: "studio-4441386650-8a8cf",
  storageBucket: "studio-4441386650-8a8cf.appspot.com",
  messagingSenderId: "543374686399",
  appId: "1:543374686399:web:ca8ca41abe3529bcfc6e0a"
};

if (!firebaseConfig.apiKey) {
  throw new Error("FIREBASE apiKey está vacía o no se ha configurado.");
}

// This function ensures that Firebase is initialized only once. (Singleton pattern)
function initializeFirebase() {
  if (getApps().length > 0) {
    app = getApp();
  } else {
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
