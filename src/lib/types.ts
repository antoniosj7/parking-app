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
  startTime: string;
  status: 'active' | 'completed';
};

export type CacheMetricData = {
  name: string;
  hits: number;
  misses: number;
  latency: number;
};
