import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import OccupancyChart from "./occupancy-chart";
import SessionManagementTable from "./session-management-table";
import { Activity, GanttChartSquare, CheckCircle, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ALLOWED_SPOTS } from "@/lib/allowed-spots";

export default function AdminDashboard() {
  const allowedSpotsList = Array.from(ALLOWED_SPOTS).join(', ');

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
                <Badge variant="secondary">{allowedSpotsList}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
                Estas son las plazas que el sistema reconocerá. Los datos de cualquier otra plaza serán ignorados.
            </p>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-headline text-2xl font-medium">Estadísticas de Ocupación (Últimas Horas)</CardTitle>
          <Activity className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <OccupancyChart />
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-headline text-2xl font-medium">Gestión de Sesiones Activas</CardTitle>
          <GanttChartSquare className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <SessionManagementTable />
        </CardContent>
      </Card>
    </div>
  );
}
