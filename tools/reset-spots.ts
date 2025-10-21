// Autor: Antonio SJ
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc } from 'firebase/firestore';

// Este script requiere que las credenciales de Firebase estén configuradas en el entorno.
// Por ejemplo, a través de `gcloud auth application-default login`.

const firebaseConfig = {
    // Aquí deberías colocar la configuración de tu proyecto de Firebase
    // projectId: "YOUR_PROJECT_ID",
    // apiKey: "YOUR_API_KEY",
    // etc.
    // Por ahora, se asume que el entorno está configurado para conectarse.
};

async function main() {
    console.log('Iniciando el reseteo de plazas...');
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const spotsCollection = collection(db, 'spots');

    const snapshot = await getDocs(spotsCollection);
    if (snapshot.empty) {
        console.log('No hay plazas para eliminar.');
        return;
    }
    
    const deletePromises: Promise<void>[] = [];
    snapshot.forEach(doc => {
        console.log(`Eliminando plaza: ${doc.id}`);
        deletePromises.push(deleteDoc(doc.ref));
    });

    await Promise.all(deletePromises);
    console.log(`Reseteo completado. ${snapshot.size} plazas eliminadas.`);
}

main().catch(error => {
    console.error('Error durante el reseteo de plazas:', error);
    process.exit(1);
});
