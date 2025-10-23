import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="flex-1 space-y-8">
             <div>
                <h2 className="text-3xl font-bold tracking-tight font-headline">Ajustes del Sistema</h2>
                <p className="text-muted-foreground">
                    Configura los parámetros generales del sistema de parqueo.
                </p>
            </div>
            <Card className="border-dashed">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="font-headline text-2xl font-medium">En Construcción</CardTitle>
                    <Settings className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mt-2">
                        Esta sección está actualmente en desarrollo. Aquí podrás cambiar el nombre de las plazas, configurar notificaciones, y ajustar otros parámetros del sistema.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
