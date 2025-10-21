import type { Timestamp } from 'firebase/firestore';

export type ParkingSpotStatus = 'available' | 'occupied' | 'reserved';

export type ParkingSpot = {
  id: string;
  status: ParkingSpotStatus;
  user?: string;
  reservationEndTime?: string;
  lastChangeAt?: any;
  currentSessionId?: string | null;
  occupied?: boolean;
};

export type ParkingSession = {
  id: string;
  spotId: string;
  user: string;
  startTime: Timestamp;
  endTime?: Timestamp;
  duration: string;
  status: 'active' | 'completed';
};

export type OccupancyData = {
  hour: string;
  occupied: number;
};
