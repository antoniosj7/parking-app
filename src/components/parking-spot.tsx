'use client';
// Antonio SJ

import type { ParkingSpot as ParkingSpotType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Car, Ban, Clock, AlertTriangle, ParkingCircle, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface ParkingSpotProps {
  spot: ParkingSpotType;
  isNotAllowed?: boolean;
}

const statusConfig = {
  available: {
    label: 'Disponible',
    icon: <CheckCircle className="h-10 w-10" />,
    action: <Button size="sm" className="w-full">Reservar</Button>
  },
  occupied: {
    label: 'Ocupado',
    icon: <Car className="h-10 w-10" />,
    action: null
  },
  reserved: {
    label: 'Reservado',
    icon: <Clock className="h-10 w-10" />,
    action: null
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
       <Card className="flex flex-col items-center justify-center text-center bg-muted/50 border-dashed">
        <CardHeader className="p-4">
          <CardTitle className="font-headline text-2xl text-muted-foreground">{spot.id}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-2 p-4 pt-0">
          <AlertTriangle className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">No Permitido</p>
          <p className="text-xs text-muted-foreground">(Oculto en {countdown}s)</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      data-status={spot.status}
      className={cn(
        'spot-card flex flex-col items-center justify-between text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 cursor-pointer'
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
        {spot.user && <p className="text-xs text-muted-foreground">Usuario: {spot.user}</p>}
      </CardContent>
       {config.action && 
        <CardFooter className="p-3 w-full">
            {config.action}
        </CardFooter>
      }
    </Card>
  );
}
