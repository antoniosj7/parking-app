import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Clock, CircleDollarSign } from "lucide-react";
import OccupancyChart from "@/components/occupancy-chart";

export default function StatisticsPage() {
  return (
    <div className="flex-1 space-y-8">
       <div>
        <h2 className="text-3xl font-bold tracking-tight font-headline">Estadísticas del Parqueo</h2>
        <p className="text-muted-foreground">
          Análisis de ingresos, ocupación y tendencias.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos Totales (Hoy)
            </CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Q 1,250.50</div>
            <p className="text-xs text-muted-foreground">
              +20.1% desde ayer
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Hora Pico (Hoy)
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12:00 PM - 2:00 PM</div>
            <p className="text-xs text-muted-foreground">
              Mayor afluencia de vehículos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tiempo Promedio de Estancia
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1h 45m</div>
            <p className="text-xs text-muted-foreground">
              Basado en las sesiones de hoy
            </p>
          </CardContent>
        </Card>
      </div>
       <div className="mt-8">
         <Card>
            <CardHeader>
                <CardTitle>Gráfico de Ocupación y Ganancias</CardTitle>
                <CardDescription>Ocupación por hora de las últimas 12 horas.</CardDescription>
            </CardHeader>
            <CardContent>
                <OccupancyChart />
            </CardContent>
         </Card>
       </div>
    </div>
  );
}
