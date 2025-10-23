'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ALLOWED_SPOTS } from "@/lib/allowed-spots";
import { useRtdbValue } from "@/firebase";
import { Skeleton } from "./ui/skeleton";

function SpotStatus({ spotId }: { spotId: string }) {
  const { data: occupied, loading } = useRtdbValue<boolean>(`/${spotId}`);

  if (loading) {
    return <Skeleton className="w-24 h-6" />;
  }

  return (
    <Badge variant={occupied ? 'destructive' : 'default'} className={!occupied ? 'bg-green-500' : ''}>
      {occupied ? 'Ocupado' : 'Libre'}
    </Badge>
  );
}

export default function AdminDashboard() {
  const allowedSpotsList = Array.from(ALLOWED_SPOTS);

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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estado en Tiempo Real (RTDB)</CardTitle>
          <CardDescription>
            Estado actual de las plazas leído directamente desde Realtime Database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {allowedSpotsList.map(spotId => (
              <div key={spotId} className="flex items-center gap-3 border p-3 rounded-lg">
                <span className="font-bold text-lg">{spotId}:</span>
                <SpotStatus spotId={spotId} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
