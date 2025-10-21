'use client';
import { useState, useEffect } from 'react';
import type { ParkingSpot as ParkingSpotType } from '@/lib/types';
import ParkingSpot from './parking-spot';
import { ALLOWED_SPOTS } from '@/lib/allowed-spots';

export default function ParkingGrid() {
  const [spots] = useState<ParkingSpotType[]>([]);
  const [notAllowedSpots, setNotAllowedSpots] = useState<ParkingSpotType[]>([]);

  // Simulación de detección de plazas no permitidas
  useEffect(() => {
    // Esta función simula la detección de una plaza no permitida
    const detectNotAllowedSpot = () => {
        const notAllowedSpot: ParkingSpotType = {
            id: 'C-01',
            status: 'occupied',
            lastChangeAt: new Date(),
        };
        setNotAllowedSpots(prev => [...prev, notAllowedSpot]);

        // Ocultar la plaza no permitida después de 10 segundos
        setTimeout(() => {
            setNotAllowedSpots(prev => prev.filter(s => s.id !== notAllowedSpot.id));
        }, 10000);
    };

    const intervalId = setInterval(detectNotAllowedSpot, 20000); // Simula la detección cada 20s

    return () => clearInterval(intervalId);
  }, []);

  const allSpots = [...spots, ...notAllowedSpots];

  if (allSpots.length === 0 && Array.from(ALLOWED_SPOTS).length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        Cargando parrilla de aparcamiento... (Asegúrese de ejecutar `npm run seed:spots`)
      </div>
    );
  }

  const allowedSpotsToRender = Array.from(ALLOWED_SPOTS).map(id => {
    const existingSpot = allSpots.find(s => s.id === id);
    return existingSpot || { id, status: 'available', lastChangeAt: new Date() };
  });

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10">
      {allowedSpotsToRender.map(spot => (
        <ParkingSpot key={spot.id} spot={spot} />
      ))}
      {notAllowedSpots.map(spot => (
        <ParkingSpot key={spot.id} spot={spot} isNotAllowed={true} />
      ))}
    </div>
  );
}
