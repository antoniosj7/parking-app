'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ALLOWED_SPOTS } from "@/lib/allowed-spots";
import { useRtdbValue } from "@/firebase";
import { Skeleton } from "./ui/skeleton";

function SpotStatus({ spotId }: { spotId: string }) {
  const { data: spot, loading } = useRtdbValue<any>(`/spots/${spotId}`);

  if (loading) {
    return <Skeleton className="w-24 h-6" />;
  }

  const isOccupied = spot && spot.occupied;

  return (
    <Badge variant={isOccupied ? 'destructive' : 'default'} className={!isOccupied ? 'bg-green-500' : ''}>
      {isOccupied ? 'Ocupado' : 'Libre'}
    </Badge>
  );
}

export default function AdminDashboard() {
  const allowedSpotsList = Array.from(ALLOWED_SPOTS);
  const { data: spotsData, loading: spotsLoading } = useRtdbValue<Record<string, { occupied: boolean }>>('/spots');
  
  const occupiedCount = spotsData ? Object.values(spotsData).filter(s => s.occupied).length : 0;
  const availableCount = allowedSpotsList.length - occupiedCount;

  return (
    <div className="grid gap-8">
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-headline text-2xl font-medium">Configuración de Plazas</CardTitle>
            <CheckCircle className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="flex items-center space-x-2">
                <span className="font-medium">Plazas Permitidas:</span>
                <Badge variant="secondary">{allowedSpotsList.join(', ')}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
                Estas son las plazas que el sistema reconocerá. Los datos de cualquier otra plaza serán ignorados.
            </p>
             <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Plazas Disponibles</p>
                    {spotsLoading ? <Skeleton className="h-6 w-10"/> : <div className="text-2xl font-bold">{availableCount}</div>}
                </div>
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Plazas Ocupadas</p>
                    {spotsLoading ? <Skeleton className="h-6 w-10"/> : <div className="text-2xl font-bold">{occupiedCount}</div>}
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
