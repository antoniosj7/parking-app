'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText } from "lucide-react";


export default function SessionsPage() {
  
  return (
    <div className="flex-1 space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight font-headline">Historial de Sesiones</h2>
        <p className="text-muted-foreground">
          Revisa todas las sesiones de aparcamiento, activas y completadas.
        </p>
      </div>
      <Card className="border-dashed">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-headline text-2xl font-medium">En Construcción</CardTitle>
              <FileText className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <p className="text-muted-foreground mt-2">
                  Esta sección está actualmente en desarrollo. Aquí podrás ver, filtrar y gestionar todas las sesiones de aparcamiento registradas en el sistema.
              </p>
          </CardContent>
      </Card>
    </div>
  );
}
