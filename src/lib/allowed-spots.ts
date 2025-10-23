// Autor: Antonio SJ
import config from './allowed-spots.json';

/**
 * Lee la configuración de plazas desde un archivo JSON estático
 * para evitar problemas con variables de entorno durante el build.
 */
let spots: Set<string>;

try {
  // Asegurarnos de que el array existe y es un array.
  const parsedSpots: string[] = Array.isArray(config.spots) ? config.spots : [];
  spots = new Set(parsedSpots);
} catch (error) {
  console.error('Error al procesar allowed-spots.json. Usando un set vacío.', error);
  spots = new Set();
}

export const ALLOWED_SPOTS: Set<string> = spots;
