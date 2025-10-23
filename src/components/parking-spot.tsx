'use client';
// Antonio SJ

import type { ParkingSpot as ParkingSpotType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, CheckCircle } from 'lucide-react';

interface ParkingSpotProps {
  spot: ParkingSpotType;
}

const statusConfig = {
  available: {
    label: 'Disponible',
    icon: <CheckCircle className="h-10 w-10" />,
    className: 'border-green-500/40 hover:bg-green-500/5 dark:hover:bg-green-500/10'
  },
  occupied: {
    label: 'Ocupado',
    icon: <Car className="h-10 w-10" />,
    className: 'border-red-500/40 hover:bg-red-500/5 dark:hover:bg-red-500/10'
  },
};

export default function ParkingSpot({ spot }: ParkingSpotProps) {
  const status = spot.occupied ? 'occupied' : 'available';
  const config = statusConfig[status];

  return (
    <Card
      data-status={status}
      className={cn(
        'spot-card flex flex-col items-center justify-between text-center transition-all duration-300',
        'bg-card/60 backdrop-blur-sm',
        'hover:shadow-xl hover:-translate-y-1',
        config.className
      )}
    >
      <CardHeader className="p-4 pb-2">
        <CardTitle className={cn('font-headline text-3xl spot-title')}>
          {spot.id}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-2 p-4 pt-0">
        <div className="spot-icon my-2">{config.icon}</div>
        <p className="text-base font-semibold">{config.label}</p>
      </CardContent>
    </Card>
  );
}
