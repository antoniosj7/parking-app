// Autor: Antonio SJ
import { onDocumentUpdated, onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as logger from 'firebase-functions/logger';
import { ALLOWED_SPOTS } from './config/allowed-spots';
import * as admin from 'firebase-admin';

admin.initializeApp();

const enforceAllowedSpotsFn = async (event: any) => {
    const spotId = event.params.spotId;

    // Se verifica la idempotencia. Si el spot ya está en un estado inválido,
    // no se hace nada para evitar bucles.
    if (event.data.after.data()?.status === 'invalid-spot') {
        logger.log(`Spot ${spotId} ya está marcado como inválido, omitiendo.`);
        return;
    }

    if (!ALLOWED_SPOTS.has(spotId)) {
        logger.error(`Intento de crear/actualizar un spot no permitido: ${spotId}`);
        // Se revierte la operación o se marca como inválido para que no sea procesado.
        // En este caso, lo marcamos para que la UI pueda reaccionar si es necesario.
        return event.data.after.ref.set({ status: 'invalid-spot' }, { merge: true });
    }
    logger.info(`Spot ${spotId} es válido, operación permitida.`);
    return null;
};

// Trigger para cuando se crea un documento en la colección 'spots'
export const enforceAllowedSpotsOnCreate = onDocumentCreated('spots/{spotId}', enforceAllowedSpotsFn);

// Trigger para cuando se actualiza un documento en la colección 'spots'
export const enforceAllowedSpotsOnUpdate = onDocumentUpdated('spots/{spotId}', enforceAllowedSpotsFn);
