import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function UserManagementPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-8">
                <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
                    Gestión de Usuarios
                </h1>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Crear Nuevo Usuario
                </Button>
            </div>
         
          <Card>
            <CardHeader>
                <CardTitle>Usuarios Registrados</CardTitle>
                <CardDescription>
                    Aquí puedes ver el historial de uso y administrar los usuarios existentes.
                </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">[Aquí irá una tabla con la lista de usuarios, su rol, su historial de uso y opciones para editar o eliminar.]</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
