import ParkingGrid from "@/components/parking-grid";

export default function GridPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h1 className="mb-8 text-center font-headline text-4xl font-bold tracking-tight md:text-5xl">
        Parqueo en Tiempo Real
      </h1>
      <ParkingGrid />
    </div>
  );
}
