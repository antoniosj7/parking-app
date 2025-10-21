import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function HistoryPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4">
          <h1 className="mb-8 font-headline text-4xl font-bold tracking-tight md:text-5xl">
            Mi Historial de Uso
          </h1>
          <Card>
            <CardHeader>
              <CardTitle>Registros de Aparcamiento</CardTitle>
              <CardDescription>
                Aquí puedes ver todas tus sesiones de aparcamiento anteriores.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">[Aquí irá una tabla o lista con el historial de uso del usuario, mostrando fecha, duración y coste de cada sesión.]</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
