'use client';
import { useState, useEffect } from 'react';
import { parkingSpots as initialSpots } from '@/lib/data';
import type { ParkingSpot as ParkingSpotType } from '@/lib/types';
import ParkingSpot from './parking-spot';

export default function ParkingGrid() {
  const [spots, setSpots] = useState<ParkingSpotType[]>([]);

  useEffect(() => {
    setSpots(initialSpots);
  }, [])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSpots(currentSpots => {
        if (currentSpots.length === 0) return [];
        const newSpots = [...currentSpots];
        const randomIndex = Math.floor(Math.random() * newSpots.length);
        const statusOptions: ParkingSpotType['status'][] = ['available', 'occupied', 'reserved'];
        const currentStatus = newSpots[randomIndex].status;
        let newStatus: ParkingSpotType['status'];
        do {
          newStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
        } while (newStatus === currentStatus);
        
        newSpots[randomIndex] = { ...newSpots[randomIndex], status: newStatus };
        return newSpots;
      });
    }, 5000); // Update a random spot every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (spots.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        Loading parking grid...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10">
      {spots.map(spot => (
        <ParkingSpot key={spot.id} spot={spot} />
      ))}
    </div>
  );
}
