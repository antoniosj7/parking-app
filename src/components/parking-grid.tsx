'use client';
import type { ParkingSpot as ParkingSpotType } from '@/lib/types';
import ParkingSpot from './parking-spot';
import { ALLOWED_SPOTS } from '@/lib/allowed-spots';
import { useRtdbValue } from '@/firebase';
import ParkingSpotSkeleton from './parking-spot-skeleton';

export default function ParkingGrid() {
  const allowedSpotsArray = Array.from(ALLOWED_SPOTS);

  // Get all spots data in a single hook for efficiency
  const { data: spots, loading: spotsLoading } = useRtdbValue<Record<string, { occupied: boolean }>>('/spots');

  if (spotsLoading) {
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
        No hay plazas de aparcamiento configuradas.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10">
      {allowedSpotsArray.map(spotId => {
        const spotData = spots ? spots[spotId] : null;
        const spot: ParkingSpotType = {
          id: spotId,
          occupied: spotData ? spotData.occupied : false,
        };
        return <ParkingSpot key={spot.id} spot={spot} />;
      })}
    </div>
  );
}
