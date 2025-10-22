// Autor: Antonio SJ
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


/**
 * Endpoint HTTP para que dispositivos IoT (como un ESP32) actualicen el estado de una plaza.
 */
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
                
                // Si el estado no ha cambiado, no hacer nada a menos que falte una sesión.
                if (spotData?.occupied === occupied && (occupied === false || spotData.currentSessionId)) {
                    logger.log(`El estado de la plaza ${spotId} ya es ${occupied ? 'ocupado' : 'disponible'} y la sesión es consistente. No se requiere acción.`);
                    return;
                }

                const newStatus = occupied ? 'occupied' : 'available';
                transaction.update(spotRef, {
                    occupied: occupied,
                    status: newStatus,
                    lastChangeAt: admin.firestore.FieldValue.serverTimestamp(),
                });

                if (occupied) {
                    // Coche ha entrado. Iniciar una nueva sesión SOLO si no hay una ya activa.
                    if (!spotData?.currentSessionId) {
                        const sessionRef = db.collection('sessions').doc(); // Nuevo documento de sesión
                        const userId = "ESP32_USER"; 
                        const userName = "Sensor";
                        
                        transaction.set(sessionRef, {
                            spotId: spotId,
                            userId: userId,
                            user: userName,
                            startTime: admin.firestore.FieldValue.serverTimestamp(),
                            status: 'active',
                        });
                        
                        // Vincular la sesión a la plaza
                        transaction.update(spotRef, { 
                            currentSessionId: sessionRef.id,
                            user: userName
                        });
                        
                        logger.info(`Nueva sesión ${sessionRef.id} iniciada para la plaza ${spotId}.`);
                    } else {
                        logger.info(`La plaza ${spotId} ya tiene una sesión activa (${spotData.currentSessionId}). No se crea una nueva.`);
                    }
                } else {
                    // Coche ha salido: Finalizar la sesión activa si existe.
                    const currentSessionId = spotData?.currentSessionId;
                    if (currentSessionId) {
                        const sessionRef = db.collection('sessions').doc(currentSessionId);
                        const sessionDoc = await transaction.get(sessionRef);

                        // Asegurarse de que la sesión existe y está activa antes de finalizarla
                        if (sessionDoc.exists && sessionDoc.data()?.status === 'active') {
                            transaction.update(sessionRef, {
                                status: 'completed',
                                endTime: admin.firestore.FieldValue.serverTimestamp()
                            });
                             // Desvincular la sesión de la plaza
                            transaction.update(spotRef, { 
                                currentSessionId: null,
                                user: null
                            });
                            logger.info(`Sesión ${currentSessionId} finalizada para la plaza ${spotId}.`);
                        } else {
                           // La sesión ya no existe o no está activa, solo limpiar la plaza.
                           transaction.update(spotRef, { 
                                currentSessionId: null,
                                user: null
                            });
                           logger.warn(`La sesión ${currentSessionId} no se pudo finalizar (no encontrada o no activa), pero la plaza ${spotId} ha sido liberada.`);
                        }
                    }
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
