import ParkingGrid from "@/components/parking-grid";

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="mb-8 text-center font-headline text-4xl font-bold tracking-tight md:text-5xl">
        Real-Time Parking Grid
      </h1>
      <ParkingGrid />
    </div>
  );
}
