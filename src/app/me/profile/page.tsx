import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { User } from "lucide-react";

export default function ProfilePage() {
    return (
        <div className="flex-1 space-y-8">
             <div>
                <h2 className="text-3xl font-bold tracking-tight font-headline">Mi Perfil</h2>
                <p className="text-muted-foreground">
                    Gestiona tu información personal y de cuenta.
                </p>
            </div>
            <Card className="border-dashed">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="font-headline text-2xl font-medium">En Construcción</CardTitle>
                    <User className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mt-2">
                        Esta sección está actualmente en desarrollo. Aquí podrás cambiar tu nombre, contraseña y gestionar tus preferencias de notificación.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
