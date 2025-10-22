import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function UserManagementPage() {
  return (
    <div className="flex-1 space-y-8">
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-3xl font-bold tracking-tight font-headline">Gestión de Usuarios</h2>
                <p className="text-muted-foreground">
                    Administra los usuarios y sus roles en el sistema.
                </p>
            </div>
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
          <p className="text-center py-10 text-muted-foreground">[Aquí irá una tabla con la lista de usuarios, su rol, su historial de uso y opciones para editar o eliminar.]</p>
        </CardContent>
      </Card>
    </div>
  );
}
