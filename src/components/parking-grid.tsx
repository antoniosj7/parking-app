'use client';
import { useState } from 'react';
import type { ParkingSpot as ParkingSpotType } from '@/lib/types';
import ParkingSpot from './parking-spot';
import { ALLOWED_SPOTS } from '@/lib/allowed-spots';
import { useCollection } from '@/firebase';
import { collection, query, where, getFirestore } from 'firebase/firestore';
import ParkingSpotSkeleton from './parking-spot-skeleton';

export default function ParkingGrid() {
  const [notAllowedSpots, setNotAllowedSpots] = useState<ParkingSpotType[]>([]);
  const firestore = typeof window !== 'undefined' ? getFirestore() : null;

  const spotsQuery = firestore ? query(collection(firestore, 'spots'), where('id', 'in', Array.from(ALLOWED_SPOTS))) : null;
  const { data: spots, loading } = useCollection<ParkingSpotType>(spotsQuery);

  const spotsMap = new Map(spots?.map(s => [s.id, s]));

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10">
        {Array.from(ALLOWED_SPOTS).map(id => (
          <ParkingSpotSkeleton key={id} />
        ))}
      </div>
    );
  }

  if (spots?.length === 0 && Array.from(ALLOWED_SPOTS).length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        Cargando parrilla de aparcamiento... (Asegúrese de ejecutar `npm run seed:spots`)
      </div>
    );
  }

  const allowedSpotsToRender = Array.from(ALLOWED_SPOTS).map(id => {
    return spotsMap.get(id) || { id, status: 'available', lastChangeAt: new Date() };
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
