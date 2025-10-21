'use client';

import type { ParkingSpot as ParkingSpotType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Ban, Clock } from 'lucide-react';

interface ParkingSpotProps {
  spot: ParkingSpotType;
}

const statusConfig = {
  available: {
    label: 'Available',
    icon: <Car className="h-8 w-8" />,
  },
  occupied: {
    label: 'Occupied',
    icon: <Ban className="h-8 w-8" />,
  },
  reserved: {
    label: 'Reserved',
    icon: <Clock className="h-8 w-8" />,
  },
};

export default function ParkingSpot({ spot }: ParkingSpotProps) {
  const config = statusConfig[spot.status];

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
