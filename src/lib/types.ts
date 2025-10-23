// Antonio SJ

// Representa el estado de una única plaza de aparcamiento.
export type ParkingSpot = {
  id: string; // "P1", "P2", etc.
  occupied: boolean; // This will be the real-time status from RTDB
  // Other potential fields from Firestore
  status?: 'available' | 'occupied' | 'reserved' | 'invalid-spot';
  lastChangeAt?: any; // Firestore timestamp
  currentSessionId?: string | null;
  user?: string | null;
};

// Objeto que representa todos los datos de las plazas leídos de RTDB.
export type ParkingState = {
  [spotId: string]: boolean;
};
