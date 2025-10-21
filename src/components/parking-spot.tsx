'use client';
// Antonio SJ

import type { ParkingSpot as ParkingSpotType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Ban, Clock, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ParkingSpotProps {
  spot: ParkingSpotType;
  isNotAllowed?: boolean;
}

const statusConfig = {
  available: {
    label: 'Disponible',
    icon: <Car className="h-8 w-8" />,
  },
  occupied: {
    label: 'Ocupado',
    icon: <Ban className="h-8 w-8" />,
  },
  reserved: {
    label: 'Reservado',
    icon: <Clock className="h-8 w-8" />,
  },
};

export default function ParkingSpot({ spot, isNotAllowed = false }: ParkingSpotProps) {
  const [countdown, setCountdown] = useState(10);
  const config = statusConfig[spot.status];

  useEffect(() => {
    if (isNotAllowed) {
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isNotAllowed]);

  if (isNotAllowed) {
    return (
       <Card className="flex flex-col items-center justify-center text-center bg-gray-200 dark:bg-gray-800 border-gray-400 dark:border-gray-600">
        <CardHeader className="p-4">
          <CardTitle className="font-headline text-2xl text-gray-600 dark:text-gray-400">{spot.id}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-2 p-4 pt-0">
          <AlertTriangle className="h-8 w-8 text-gray-500" />
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">No Permitido</p>
          <p className="text-xs text-muted-foreground">(Oculto en {countdown}s)</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      data-status={spot.status}
      className={cn(
        'flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
        'spot-card' 
      )}
    >
      <CardHeader className="p-4">
        <CardTitle className={cn('font-headline text-2xl spot-title')}>
          {spot.id}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-2 p-4 pt-0">
        <div className="spot-icon">{config.icon}</div>
        <p className="text-sm font-medium">{config.label}</p>
        {spot.user && <p className="text-xs text-muted-foreground">User: {spot.user}</p>}
        {spot.reservationEndTime && (
          <p className="text-xs text-muted-foreground">Until: {spot.reservationEndTime}</p>
        )}
      </CardContent>
    </Card>
  );
}
