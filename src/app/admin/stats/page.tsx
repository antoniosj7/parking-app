import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { BarChart } from "lucide-react";

export default function StatsPage() {
    return (
        <div className="flex-1 space-y-8">
             <div>
                <h2 className="text-3xl font-bold tracking-tight font-headline">Estadísticas</h2>
                <p className="text-muted-foreground">
                    Visualiza el rendimiento y la ocupación del parqueo.
                </p>
            </div>
            <Card className="border-dashed">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="font-headline text-2xl font-medium">En Construcción</CardTitle>
                    <BarChart className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mt-2">
                        Esta sección está actualmente en desarrollo. Aquí encontrarás gráficas sobre las horas pico, ingresos por día/semana/mes, tiempo promedio de ocupación y más.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
