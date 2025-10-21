import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, DollarSign } from "lucide-react";

export default function MyAccountPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4">
          <h1 className="mb-8 font-headline text-4xl font-bold tracking-tight md:text-5xl">
            Mi Cuenta
          </h1>
          <Card>
            <CardHeader>
              <CardTitle>Sesión de Aparcamiento Actual</CardTitle>
              <CardDescription>
                Aquí puedes ver el estado de tu sesión activa y el coste acumulado.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="flex items-center space-x-4 rounded-md border p-4">
                    <Clock className="h-8 w-8 text-primary" />
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Tiempo Transcurrido</p>
                        <p className="text-2xl font-bold">0h 42m 15s</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4 rounded-md border p-4">
                    <DollarSign className="h-8 w-8 text-primary" />
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Monto a Pagar</p>
                        <p className="text-2xl font-bold">Q 12.50</p>
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
