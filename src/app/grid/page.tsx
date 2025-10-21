import Header from "@/components/header";
import ParkingGrid from "@/components/parking-grid";

export default function GridPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4">
          <h1 className="mb-8 text-center font-headline text-4xl font-bold tracking-tight md:text-5xl">
            Parrilla de Aparcamiento en Tiempo Real
          </h1>
          <ParkingGrid />
        </div>
      </main>
    </div>
  );
}
