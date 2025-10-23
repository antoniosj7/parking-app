'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useRtdbValue } from "@/firebase";
import { type Session } from "@/lib/types";
import { Loader2 } from "lucide-react";

function formatTimestamp(timestamp: number) {
  if (!timestamp) return 'N/A';
  return new Date(timestamp).toLocaleString();
}

function SessionRow({ session, id }: { session: Session; id: string }) {
  const duration = session.endTime ? (session.endTime - session.startTime) : (Date.now() - session.startTime);
  const minutes = Math.floor(duration / 60000);

  return (
    <TableRow>
      <TableCell className="font-medium">{session.spotId}</TableCell>
      <TableCell>{session.user || session.userId}</TableCell>
      <TableCell>{formatTimestamp(session.startTime)}</TableCell>
      <TableCell>{formatTimestamp(session.endTime!)}</TableCell>
      <TableCell>
        <Badge variant={session.status === 'active' ? 'destructive' : 'secondary'}>
          {session.status === 'active' ? 'Activa' : 'Completada'}
        </Badge>
      </TableCell>
       <TableCell>{minutes} min</TableCell>
       <TableCell className="text-right">{session.total ? `Q${session.total.toFixed(2)}` : '-'}</TableCell>
    </TableRow>
  );
}


export default function SessionsPage() {
  const { data: sessions, loading } = useRtdbValue<Record<string, Session>>('/sessions');
  const sessionsList = sessions ? Object.entries(sessions).map(([id, data]) => ({ ...data, id })).sort((a, b) => b.startTime - a.startTime) : [];

  return (
    <div className="flex-1 space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight font-headline">Historial de Sesiones</h2>
        <p className="text-muted-foreground">
          Revisa todas las sesiones de aparcamiento, activas y completadas.
        </p>
      </div>
       <Card>
        <CardHeader>
            <CardTitle>Sesiones Registradas</CardTitle>
            <CardDescription>
                Aquí puedes ver y administrar todas las sesiones del sistema.
            </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : sessionsList.length === 0 ? (
             <p className="text-center py-10 text-muted-foreground">No hay sesiones registradas.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plaza</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Inicio</TableHead>
                  <TableHead>Fin</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessionsList.map((session) => (
                  <SessionRow key={session.id} session={session} id={session.id} />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
