import ParkingGrid from "@/components/parking-grid";

export default function UserParkingPage() {
  return (
    <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between space-y-2 pb-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight font-headline">Parqueo en Tiempo Real</h2>
            <p className="text-muted-foreground">
              Selecciona una plaza disponible para ver más detalles.
            </p>
          </div>
        </div>
      <ParkingGrid />
    </div>
  );
}
