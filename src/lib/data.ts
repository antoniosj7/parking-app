import type { ParkingSession, OccupancyData } from '@/lib/types';

export const occupancyData: OccupancyData[] = [
  { hour: '08:00', occupied: 4 },
  { hour: '09:00', occupied: 7 },
  { hour: '10:00', occupied: 6 },
  { hour: '11:00', occupied: 9 },
  { hour: '12:00', occupied: 11 },
  { hour: '13:00', occupied: 10 },
  { hour: '14:00', occupied: 12 },
  { hour: '15:00', occupied: 12 },
  { hour: '16:00', occupied: 10 },
];

export const parkingSessions: ParkingSession[] = [
  { id: 'sess-1', spotId: 'A1', user: 'User5', startTime: '09:15', duration: '2h 15m', status: 'active' },
  { id: 'sess-2', spotId: 'A4', user: 'User12', startTime: '10:30', duration: '1h 0m', status: 'active' },
  { id: 'sess-3', spotId: 'B2', user: 'User3', startTime: '08:45', duration: '2h 45m', status: 'active' },
  { id: 'sess-5', spotId: 'C1', user: 'UserX', startTime: '11:00', duration: '0h 30m', status: 'completed' },
  { id: 'sess-4', spotId: 'C3', user: 'User20', startTime: '11:05', duration: '0h 25m', status: 'active' },
];
