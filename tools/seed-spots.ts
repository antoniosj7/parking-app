// Autor: Antonio SJ
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
     // Aquí deberías colocar la configuración de tu proyecto de Firebase
};

const ALLOWED_SPOTS = ["A1", "A2", "B1", "B2"];

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
            occupied: false,
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
