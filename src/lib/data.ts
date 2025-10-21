import type { ParkingSpot, ParkingSession, CacheMetricData } from '@/lib/types';

export const parkingSpots: ParkingSpot[] = Array.from({ length: 40 }, (_, i) => {
  const spotNumber = i + 1;
  const statusOptions: ParkingSpot['status'][] = ['available', 'occupied', 'reserved'];
  const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];

  return {
    id: `A-${String(spotNumber).padStart(2, '0')}`,
    status: randomStatus,
    user: randomStatus !== 'available' ? `User${Math.floor(Math.random() * 20) + 1}` : undefined,
    reservationEndTime: randomStatus === 'reserved' ? '14:00' : undefined,
  };
});

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
  { id: 'sess-1', spotId: 'A-02', user: 'User5', startTime: '09:15', status: 'active' },
  { id: 'sess-2', spotId: 'A-05', user: 'User12', startTime: '10:30', status: 'active' },
  { id: 'sess-3', spotId: 'A-11', user: 'User3', startTime: '08:45', status: 'active' },
  { id: 'sess-4', spotId: 'A-14', user: 'User20', startTime: '11:05', status: 'active' },
  { id: 'sess-5', spotId: 'A-21', user: 'User8', startTime: '10:00', status: 'completed' },
  { id: 'sess-6', spotId: 'A-33', user: 'User1', startTime: '11:20', status: 'active' },
];
