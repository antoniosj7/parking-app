// Autor: Antonio SJ
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
     // Aquí deberías colocar la configuración de tu proyecto de Firebase
};

let ALLOWED_SPOTS: string[];
try {
    ALLOWED_SPOTS = JSON.parse(process.env.NEXT_PUBLIC_ALLOWED_SPOTS_JSON || '["P1","P2","P3","P4"]');
} catch (e) {
    console.error("Error parsing NEXT_PUBLIC_ALLOWED_SPOTS_JSON, using default spots.", e);
    ALLOWED_SPOTS = ["P1", "P2", "P3", "P4"];
}


async function main() {
    console.log('Iniciando la siembra de plazas...');

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const spotsCollection = collection(db, 'spots');

    const seedPromises: Promise<void>[] = [];

    ALLOWED_SPOTS.forEach(spotId => {
        const spotRef = doc(spotsCollection, spotId);
        const spotData = {
            id: spotId,
            status: 'available', // Se inicializa como 'available'
            lastChangeAt: serverTimestamp(),
            currentSessionId: null
        };
        console.log(`Creando plaza: ${spotId}`);
        seedPromises.push(setDoc(spotRef, spotData));
    });

    await Promise.all(seedPromises);
    console.log(`Siembra completada. ${ALLOWED_SPOTS.length} plazas creadas.`);
}

main().catch(error => {
    console.error('Error durante la siembra de plazas:', error);
    process.exit(1);
});
