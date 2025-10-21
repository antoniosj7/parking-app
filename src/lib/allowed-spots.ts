// Autor: Antonio SJ

/**
 * Lee la variable de entorno pública NEXT_PUBLIC_ALLOWED_SPOTS_JSON, la parsea
 * y la expone como un Set de strings para una búsqueda eficiente en el cliente.
 */
let spots: Set<string>;

try {
  // El valor por defecto es una cadena JSON válida.
  const allowedSpotsJson = process.env.NEXT_PUBLIC_ALLOWED_SPOTS_JSON || '["A1","A2","B1","B2"]';
  
  // Limpiamos posibles comillas extra que puedan venir del entorno
  const cleanedJson = allowedSpotsJson.replace(/^'|'$/g, '');

  const parsedSpots: string[] = JSON.parse(cleanedJson);
  spots = new Set(parsedSpots);
} catch (error) {
  console.error('Error al parsear NEXT_PUBLIC_ALLOWED_SPOTS_JSON. Usando un set vacío.', error);
  spots = new Set();
}

export const ALLOWED_SPOTS: Set<string> = spots;
