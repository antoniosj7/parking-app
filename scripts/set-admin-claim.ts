// Autor: Antonio SJ
import 'dotenv/config';
import * as admin from 'firebase-admin';

// Este script necesita las credenciales de administrador de Firebase.
// Asegúrate de tener el archivo 'firebase-admin-sdk.json' en la raíz y que GOOGLE_APPLICATION_CREDENTIALS apunte a él.
const firebaseConfigStr = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;

if (!firebaseConfigStr) {
    console.error('Error: La configuración de Firebase no está disponible. Asegúrate de que NEXT_PUBLIC_FIREBASE_CONFIG está en tu entorno.');
    process.exit(1);
}

const firebaseConfig = JSON.parse(firebaseConfigStr);

// Inicializar el SDK de Admin
try {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: firebaseConfig.projectId,
    });
    console.log('Firebase Admin SDK inicializado correctamente.');
} catch (error: any) {
    if (error.code === 'app/duplicate-app') {
        console.log('Firebase Admin SDK ya estaba inicializado.');
    } else {
        console.error('Error inicializando Firebase Admin SDK:', error);
        console.log('\n--- AYUDA ---');
        console.log('Asegúrate de haber configurado las credenciales de administrador de servicio.');
        console.log('1. Ve a tu proyecto de Firebase -> Configuración del proyecto -> Cuentas de servicio.');
        console.log('2. Genera una nueva clave privada y descarga el archivo JSON.');
        console.log('3. Renombra el archivo a "firebase-admin-sdk.json" y colócalo en la raíz de este proyecto.');
        console.log('4. Asegúrate de que tu terminal tiene la variable de entorno GOOGLE_APPLICATION_CREDENTIALS="firebase-admin-sdk.json".');
        console.log('---------------');
        process.exit(1);
    }
}


async function setAdminClaim(email: string) {
    if (!email) {
        console.error('Error: Debes proporcionar un email como argumento.');
        console.log('Uso: npm run set:admin -- <email>');
        return;
    }

    try {
        console.log(`Buscando usuario con email: ${email}...`);
        const user = await admin.auth().getUserByEmail(email);

        if (user.customClaims && (user.customClaims as any).role === 'admin') {
            console.log(`El usuario ${email} (UID: ${user.uid}) ya tiene el rol de administrador.`);
            return;
        }

        console.log(`Asignando rol de "admin" al usuario ${email} (UID: ${user.uid})...`);
        await admin.auth().setCustomUserClaims(user.uid, { role: 'admin' });

        console.log('¡Éxito! El usuario ahora es administrador.');
        console.log('El usuario deberá volver a iniciar sesión para que los cambios surtan efecto.');

    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            console.error(`Error: No se encontró ningún usuario con el email "${email}".`);
            console.log('Por favor, asegúrate de que el usuario ha sido creado primero desde la aplicación.');
        } else {
            console.error('Ocurrió un error inesperado:', error.message);
        }
    } finally {
        // Cierra la app de admin para que el script termine
        admin.app().delete();
    }
}

// Obtener el email de los argumentos de la línea de comandos
const email = process.argv[2];

setAdminClaim(email);
