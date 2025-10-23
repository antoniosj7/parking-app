// Autor: Antonio SJ
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc } from 'firebase/firestore';
import 'dotenv/config';

// Este script requiere que las credenciales de Firebase estén configuradas en el entorno.
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
    
    // NOTA: Usamos el SDK cliente para estas operaciones por simplicidad,
    // pero para un entorno de producción robusto, se usaría el Admin SDK
    // con credenciales de servicio.
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const spotsCollection = collection(db, 'spots');

    const snapshot = await getDocs(spotsCollection);
    if (snapshot.empty) {
        console.log('No hay plazas para eliminar.');
        // Forzar la salida exitosa para terminar el proceso de node
        process.exit(0);
    }
    
    const deletePromises: Promise<void>[] = [];
    snapshot.forEach(doc => {
        console.log(`Eliminando plaza: ${doc.id}`);
        deletePromises.push(deleteDoc(doc.ref));
    });

    await Promise.all(deletePromises);
    console.log(`Reseteo completado. ${snapshot.size} plazas eliminadas.`);
    // Forzar la salida exitosa para terminar el proceso de node
    process.exit(0);
}

main().catch(error => {
    console.error('Error durante el reseteo de plazas:', error);
    process.exit(1);
});
