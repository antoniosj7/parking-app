// Autor: Antonio SJ
// NOTA: La lógica de backend ha sido movida a Realtime Database.
// Estas funciones de Firestore se mantienen como referencia pero no están activas.
// El nuevo flujo de datos es: ESP32 --(REST API a RTDB)--> RTDB <-- (Listener en tiempo real) -- Web App

/*
import { onDocumentUpdated, onDocumentCreated } from 'firebase-functions/v2/firestore';
import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import { ALLOWED_SPOTS } from './config/allowed-spots';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

const enforceAllowedSpotsFn = async (event: any) => {
    const spotId = event.params.spotId;

    if (event.data.after.exists && event.data.after.data()?.status === 'invalid-spot') {
        logger.log(`Spot ${spotId} ya está marcado como inválido, omitiendo.`);
        return;
    }

    if (!ALLOWED_SPOTS.has(spotId)) {
        logger.error(`Intento de crear/actualizar un spot no permitido: ${spotId}`);
        return event.data.after.ref.set({ status: 'invalid-spot', occupied: true }, { merge: true });
    }
    logger.info(`Spot ${spotId} es válido, operación permitida.`);
    return null;
};

export const enforceAllowedSpotsOnCreate = onDocumentCreated('spots/{spotId}', enforceAllowedSpotsFn);
export const enforceAllowedSpotsOnUpdate = onDocumentUpdated('spots/{spotId}', enforceAllowedSpotsFn);


export const updateSpotStatus = onRequest(
    { secrets: ["ESP32_API_KEY"] },
    async (req, res) => {
        if (req.method !== 'POST') {
            res.status(405).send('Method Not Allowed');
            return;
        }

        const apiKey = req.headers['x-api-key'];
        if (apiKey !== process.env.ESP32_API_KEY) {
            logger.warn('Intento de acceso no autorizado con API Key inválida.');
            res.status(401).send('Unauthorized');
            return;
        }

        const { spotId, occupied } = req.body;
        if (!spotId || typeof occupied !== 'boolean') {
            res.status(400).send('Bad Request: Faltan los parámetros "spotId" o "occupied" (debe ser booleano).');
            return;
        }
        
        if (!ALLOWED_SPOTS.has(spotId)) {
            logger.error(`El dispositivo intentó actualizar una plaza no permitida: ${spotId}`);
            res.status(400).send('Bad Request: La plaza no es válida.');
            return;
        }

        const spotRef = db.collection('spots').doc(spotId);

        try {
            await db.runTransaction(async (transaction) => {
                const spotDoc = await transaction.get(spotRef);
                if (!spotDoc.exists) {
                    throw new Error(`La plaza ${spotId} no existe en la base de datos.`);
                }
                const spotData = spotDoc.data();
                
                // Si el coche entra (occupied = true)
                if (occupied) {
                     // Aunque el estado ya sea 'ocupado', nos aseguramos de que haya una sesión activa.
                     if (spotData?.occupied === true && spotData?.currentSessionId) {
                        logger.log(`La plaza ${spotId} ya estaba ocupada con una sesión activa. No se requiere acción.`);
                        return;
                    }

                    const newStatus = 'occupied';
                    const userId = "ESP32_USER"; 
                    const userName = "Sensor";
                    const sessionRef = db.collection('sessions').doc();
                    
                    // Iniciar una nueva sesión de aparcamiento
                    transaction.set(sessionRef, {
                        spotId: spotId,
                        userId: userId,
                        user: userName,
                        startTime: admin.firestore.FieldValue.serverTimestamp(),
                        status: 'active',
                    });
                    
                    // Vincular la sesión a la plaza y actualizar estado
                    transaction.update(spotRef, { 
                        occupied: true,
                        status: newStatus,
                        lastChangeAt: admin.firestore.FieldValue.serverTimestamp(),
                        currentSessionId: sessionRef.id,
                        user: userName
                    });
                    
                    logger.info(`Nueva sesión ${sessionRef.id} iniciada para la plaza ${spotId}.`);

                } else { // Si el coche sale (occupied = false)
                    if (spotData?.occupied === false) {
                        logger.log(`El estado de la plaza ${spotId} ya es 'disponible'. No se requiere acción.`);
                        return;
                    }

                    const currentSessionId = spotData?.currentSessionId;
                    if (currentSessionId) {
                        const sessionRef = db.collection('sessions').doc(currentSessionId);
                        const sessionDoc = await transaction.get(sessionRef);

                        // Solo finaliza la sesión si existe y está activa
                        if (sessionDoc.exists && sessionDoc.data()?.status === 'active') {
                            transaction.update(sessionRef, {
                                status: 'completed',
                                endTime: admin.firestore.FieldValue.serverTimestamp()
                            });
                             logger.info(`Sesión ${currentSessionId} finalizada para la plaza ${spotId}.`);
                        }
                    }
                    
                    // Desvincular la sesión de la plaza y marcarla como disponible
                    transaction.update(spotRef, { 
                        occupied: false,
                        status: 'available',
                        lastChangeAt: admin.firestore.FieldValue.serverTimestamp(),
                        currentSessionId: null,
                        user: null
                    });
                }
            });

            logger.info(`Plaza ${spotId} actualizada a ${occupied ? 'ocupada' : 'disponible'} por el dispositivo.`);
            res.status(200).send({ success: true, message: `Plaza ${spotId} actualizada correctamente.` });
        } catch (error) {
            logger.error(`Error al actualizar la plaza ${spotId}:`, error);
            res.status(500).send('Internal Server Error');
        }
    }
);
*/
