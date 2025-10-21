import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, BarChart, Clock } from "lucide-react";

export default function StatisticsPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4">
          <h1 className="mb-8 font-headline text-4xl font-bold tracking-tight md:text-5xl">
            Estadísticas del Parqueo
          </h1>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ingresos Totales (Hoy)
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
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
                  Hora Pico
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
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        [Aquí irá un gráfico detallado con tiempos de uso, ganancias por hora, etc.]
                    </p>
                </CardContent>
             </Card>
           </div>
        </div>
      </main>
    </div>
  );
}
