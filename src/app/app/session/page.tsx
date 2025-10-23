import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Clock } from "lucide-react";

export default function UserSessionPage() {
    return (
        <div className="flex-1 space-y-8">
             <div>
                <h2 className="text-3xl font-bold tracking-tight font-headline">Mi Sesión Actual</h2>
                <p className="text-muted-foreground">
                    Consulta el estado de tu sesión de aparcamiento activa.
                </p>
            </div>
            <Card className="border-dashed">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="font-headline text-2xl font-medium">En Construcción</CardTitle>
                    <Clock className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mt-2">
                        Esta sección está actualmente en desarrollo. Si tienes una sesión activa, aquí podrás ver el tiempo transcurrido y el costo estimado.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
