'use client';
import type { ParkingSpot as ParkingSpotType } from '@/lib/types';
import ParkingSpot from './parking-spot';
import { ALLOWED_SPOTS } from '@/lib/allowed-spots';
import { useRtdbValue } from '@/firebase';
import ParkingSpotSkeleton from './parking-spot-skeleton';

export default function ParkingGrid() {
  const allowedSpotsArray = Array.from(ALLOWED_SPOTS);

  // Create hooks for each spot
  const spotData = allowedSpotsArray.map(spotId => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data, loading } = useRtdbValue<boolean>(`/${spotId}`);
    return { id: spotId, occupied: data, loading };
  });

  const isLoading = spotData.some(s => s.loading);

  if (isLoading && allowedSpotsArray.length > 0) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10">
        {allowedSpotsArray.map(id => (
          <ParkingSpotSkeleton key={id} />
        ))}
      </div>
    );
  }
  
  if (allowedSpotsArray.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        No hay plazas de aparcamiento configuradas. Por favor, revise la variable de entorno `NEXT_PUBLIC_ALLOWED_SPOTS_JSON`.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10">
      {spotData.map(({ id, occupied }) => (
        <ParkingSpot 
          key={id} 
          spot={{ id, occupied: !!occupied }} 
        />
      ))}
    </div>
  );
}
