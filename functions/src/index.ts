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
        return event.data.after.ref.set({ status: 'invalid-spot' }, { merge: true });
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
        // 1. Validar el método de la petición
        if (req.method !== 'POST') {
            res.status(405).send('Method Not Allowed');
            return;
        }

        // 2. Validar la API Key
        const apiKey = req.headers['x-api-key'];
        if (apiKey !== process.env.ESP32_API_KEY) {
            logger.warn('Intento de acceso no autorizado con API Key inválida.');
            res.status(401).send('Unauthorized');
            return;
        }

        // 3. Validar el cuerpo de la petición
        const { spotId, status } = req.body;
        if (!spotId || !status || !['available', 'occupied'].includes(status)) {
            res.status(400).send('Bad Request: Faltan los parámetros "spotId" o "status", o el estado es inválido.');
            return;
        }
        
        // 4. Validar que la plaza es permitida
        if (!ALLOWED_SPOTS.has(spotId)) {
            logger.error(`El dispositivo intentó actualizar una plaza no permitida: ${spotId}`);
            res.status(400).send('Bad Request: La plaza no es válida.');
            return;
        }

        // 5. Actualizar Firestore
        try {
            const spotRef = db.collection('spots').doc(spotId);
            await spotRef.update({
                status: status,
                lastChangeAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            logger.info(`Plaza ${spotId} actualizada a ${status} por el dispositivo.`);
            res.status(200).send({ success: true, message: `Plaza ${spotId} actualizada correctamente.` });
        } catch (error) {
            logger.error(`Error al actualizar la plaza ${spotId}:`, error);
            res.status(500).send('Internal Server Error');
        }
    }
);
