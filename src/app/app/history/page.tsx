import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { History } from "lucide-react";

export default function UserHistoryPage() {
    return (
        <div className="flex-1 space-y-8">
             <div>
                <h2 className="text-3xl font-bold tracking-tight font-headline">Mi Historial</h2>
                <p className="text-muted-foreground">
                    Revisa tu historial de sesiones de aparcamiento.
                </p>
            </div>
            <Card className="border-dashed">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="font-headline text-2xl font-medium">En Construcción</CardTitle>
                    <History className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mt-2">
                        Esta sección está actualmente en desarrollo. Aquí podrás ver un listado de todas las veces que has usado el parqueo, incluyendo fechas, duraciones y costos.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
