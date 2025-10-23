// Autor: Antonio SJ
// Este script ahora interactúa con Realtime Database
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';
import 'dotenv/config';

const firebaseConfigStr = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;

let ALLOWED_SPOTS: string[];
try {
    const jsonString = process.env.NEXT_PUBLIC_ALLOWED_SPOTS_JSON || '["P1","P2","P3","P4"]';
    ALLOWED_SPOTS = JSON.parse(jsonString);
} catch (e) {
    console.error("Error parsing NEXT_PUBLIC_ALLOWED_SPOTS_JSON, using default spots.", e);
    ALLOWED_SPOTS = ["P1", "P2", "P3", "P4"];
}

async function main() {
    if (!firebaseConfigStr) {
        console.error('Error: La configuración de Firebase no está disponible. Asegúrate de que NEXT_PUBLIC_FIREBASE_CONFIG está en tu entorno.');
        process.exit(1);
    }
    const firebaseConfig = JSON.parse(firebaseConfigStr);

    if (!firebaseConfig.projectId) {
        console.error('Error: El projectId de Firebase no está en la configuración.');
        process.exit(1);
    }
    console.log(`Iniciando la siembra de plazas en RTDB para el proyecto: ${firebaseConfig.projectId}...`);

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    const seedPromises: Promise<void>[] = [];

    ALLOWED_SPOTS.forEach(spotId => {
        const spotRef = ref(db, `/${spotId}`);
        console.log(`Creando plaza en RTDB: /${spotId}`);
        // En RTDB, simplemente guardamos el valor booleano
        seedPromises.push(set(spotRef, false)); // false = LIBRE
    });

    await Promise.all(seedPromises);
    console.log(`Siembra completada. ${ALLOWED_SPOTS.length} plazas creadas en RTDB.`);
    // Forzar la salida exitosa para terminar el proceso de node
    process.exit(0);
}

main().catch(error => {
    console.error('Error durante la siembra de plazas en RTDB:', error);
    process.exit(1);
});
