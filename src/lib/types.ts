// Antonio SJ

// Representa el estado de una única plaza de aparcamiento.
export type ParkingSpot = {
  id: string; // "P1", "P2", etc.
  occupied: boolean;
};

// Objeto que representa todos los datos de las plazas leídos de RTDB.
export type ParkingState = {
  [spotId: string]: boolean;
};
