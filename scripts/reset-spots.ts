// Autor: Antonio SJ
// Este script ahora interactúa con Realtime Database
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, remove } from 'firebase/database';
import 'dotenv/config';

const firebaseConfigStr = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;

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

    console.log(`Iniciando el reseteo de plazas para el proyecto: ${firebaseConfig.projectId}...`);
    
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    // En RTDB, podemos eliminar la raíz de los spots si no hay más nodos en el mismo nivel
    // O eliminar cada uno individualmente.
    let ALLOWED_SPOTS: string[];
    try {
        const jsonString = process.env.NEXT_PUBLIC_ALLOWED_SPOTS_JSON || '["P1","P2","P3","P4"]';
        ALLOWED_SPOTS = JSON.parse(jsonString);
    } catch (e) {
        console.error("Error parsing NEXT_PUBLIC_ALLOWED_SPOTS_JSON, usando default.", e);
        ALLOWED_SPOTS = ["P1", "P2", "P3", "P4"];
    }

    const deletePromises: Promise<void>[] = [];
    ALLOWED_SPOTS.forEach(spotId => {
        console.log(`Eliminando plaza: /${spotId}`);
        const spotRef = ref(db, `/${spotId}`);
        deletePromises.push(remove(spotRef));
    });

    await Promise.all(deletePromises);
    console.log(`Reseteo completado. ${ALLOWED_SPOTS.length} plazas eliminadas de RTDB.`);
    // Forzar la salida exitosa para terminar el proceso de node
    process.exit(0);
}

main().catch(error => {
    console.error('Error durante el reseteo de plazas en RTDB:', error);
    process.exit(1);
});
