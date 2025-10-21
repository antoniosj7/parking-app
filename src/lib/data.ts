import type { ParkingSession, CacheMetricData } from '@/lib/types';

// Este archivo ya no genera datos de aparcamiento.
// Los datos se crearán a través de los scripts de semilla.
export const parkingSpots: never[] = [];

export const cacheMetrics: CacheMetricData[] = [
  { name: '08:00', hits: 4000, misses: 2400, latency: 24 },
  { name: '09:00', hits: 3000, misses: 1398, latency: 22 },
  { name: '10:00', hits: 2000, misses: 7800, latency: 29 },
  { name: '11:00', hits: 2780, misses: 3908, latency: 20 },
  { name: '12:00', hits: 1890, misses: 4800, latency: 21 },
  { name: '13:00', hits: 2390, misses: 3800, latency: 25 },
  { name: '14:00', hits: 3490, misses: 4300, latency: 21 },
];


export const parkingSessions: ParkingSession[] = [
  { id: 'sess-1', spotId: 'A1', user: 'User5', startTime: '09:15', status: 'active' },
  { id: 'sess-2', spotId: 'A2', user: 'User12', startTime: '10:30', status: 'active' },
  { id: 'sess-3', spotId: 'B1', user: 'User3', startTime: '08:45', status: 'active' },
  { id: 'sess-4', spotId: 'B2', user: 'User20', startTime: '11:05', status: 'active' },
];
