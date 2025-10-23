'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth, useUser } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const { user } = useUser();
    const auth = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const handleLogout = async () => {
        if (!auth) return;
        try {
            await signOut(auth);
            toast({ title: "Sesión cerrada" });
            router.push('/');
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Dashboard</CardTitle>
                    <CardDescription>¡Bienvenido de nuevo!</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>Has iniciado sesión como: <span className="font-semibold">{user?.email}</span></p>
                    <p>Este es un esqueleto de aplicación funcional. Ahora puedes empezar a reconstruir la funcionalidad principal sobre esta base estable.</p>
                    <Button onClick={handleLogout} className="w-full">Cerrar Sesión</Button>
                </CardContent>
            </Card>
        </div>
    );
}
