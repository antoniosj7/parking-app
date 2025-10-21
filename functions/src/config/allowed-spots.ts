// Autor: Antonio SJ
import * as functions from 'firebase-functions';

/**
 * Lee la variable de entorno ALLOWED_SPOTS_JSON, la parsea
 * y la expone como un Set de strings para una búsqueda eficiente.
 */
let spots: Set<string>;

try {
  const allowedSpotsJson = process.env.ALLOWED_SPOTS_JSON || '[]';
  const parsedSpots: string[] = JSON.parse(allowedSpotsJson);
  spots = new Set(parsedSpots);
} catch (error) {
  functions.logger.error('Error al parsear ALLOWED_SPOTS_JSON. Usando un set vacío.', error);
  spots = new Set();
}

export const ALLOWED_SPOTS: Set<string> = spots;
