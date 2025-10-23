
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getDatabase, type Database } from 'firebase/database';
import { FirebaseProvider, useFirebase, useFirebaseApp, useAuth, useDatabase } from './provider';
import { useUser } from './auth/use-user';
import { FirebaseClientProvider } from './client-provider';
import { useRtdbValue } from './rtdb/use-rtdb-value';

const firebaseConfigStr = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;
if (!firebaseConfigStr) {
  throw new Error("La variable de entorno NEXT_PUBLIC_FIREBASE_CONFIG no está definida.");
}
const firebaseConfig = JSON.parse(firebaseConfigStr);

// Inicialización Singleton de Firebase
function initializeFirebase() {
  if (getApps().length > 0) {
    const app = getApp();
    const auth = getAuth(app);
    const database = getDatabase(app);
    return { firebaseApp: app, auth, database };
  }
  
  if (!firebaseConfig.projectId) {
    console.error("La configuración de Firebase no está disponible o está incompleta.");
    // Devolvemos un objeto con nulos para no romper la app en el servidor
    // donde la configuración del cliente puede no ser necesaria.
    return { firebaseApp: null, auth: null, database: null };
  }

  const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp);
  const database = getDatabase(firebaseApp);

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
