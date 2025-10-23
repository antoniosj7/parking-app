// Antonio SJ

// Representa el estado en vivo de una única plaza de aparcamiento desde RTDB.
export type ParkingSpot = {
  id: string;
  occupied: boolean;
};

// Objeto que representa todos los datos de las plazas leídos de RTDB.
// La clave es el ID de la plaza (ej. "P1"), el valor es si está ocupada.
export type ParkingState = {
  [spotId: string]: boolean;
};

// Representa un usuario en la base de datos RTDB en la ruta /users/{uid}
export interface User {
  uid: string;
  email: string;
  role: 'admin' | 'user';
  displayName?: string;
}

// Representa una sesión de aparcamiento en /sessions/{sessionId}
export interface Session {
  id: string;
  spotId: string;
  userId: string;
  startTime: number; // timestamp
  endTime: number | null; // null si está activa
  total: number | null;
}
