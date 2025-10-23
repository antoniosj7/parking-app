'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useRtdbValue, useUser } from "@/firebase";
import { type Session } from "@/lib/types";
import { Loader2 } from "lucide-react";

function formatTimestamp(timestamp: number) {
  if (!timestamp) return 'N/A';
  return new Date(timestamp).toLocaleString();
}

function SessionRow({ session }: { session: Session }) {
  const duration = session.endTime ? (session.endTime - session.startTime) : 0;
  const minutes = Math.floor(duration / 60000);

  return (
    <TableRow>
      <TableCell className="font-medium">{session.spotId}</TableCell>
      <TableCell>{formatTimestamp(session.startTime)}</TableCell>
      <TableCell>{formatTimestamp(session.endTime!)}</TableCell>
      <TableCell>{minutes} min</TableCell>
      <TableCell className="text-right">{session.total ? `Q${session.total.toFixed(2)}` : '-'}</TableCell>
    </TableRow>
  );
}

export default function UserHistoryPage() {
    const { user, loading: userLoading } = useUser();
    const { data: sessions, loading: sessionsLoading } = useRtdbValue<Record<string, Session>>('/sessions');

    const userSessions = sessions && user ? 
        Object.values(sessions)
            .filter(s => s.userId === user.uid && s.status === 'completed')
            .sort((a, b) => b.startTime - a.startTime) 
        : [];

    const isLoading = userLoading || sessionsLoading;

    return (
        <div className="flex-1 space-y-8">
             <div>
                <h2 className="text-3xl font-bold tracking-tight font-headline">Mi Historial</h2>
                <p className="text-muted-foreground">
                    Revisa tu historial de sesiones de aparcamiento.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Mis Sesiones Completadas</CardTitle>
                    <CardDescription>
                        Aquí puedes ver el detalle de tus aparcamientos anteriores.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                {isLoading ? (
                    <div className="flex justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : userSessions.length === 0 ? (
                    <p className="text-center py-10 text-muted-foreground">No tienes sesiones registradas.</p>
                ) : (
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Plaza</TableHead>
                        <TableHead>Inicio</TableHead>
                        <TableHead>Fin</TableHead>
                        <TableHead>Duración</TableHead>
                        <TableHead className="text-right">Total Pagado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {userSessions.map((session) => (
                          <SessionRow key={session.id} session={session} />
                        ))}
                    </TableBody>
                    </Table>
                )}
                </CardContent>
            </Card>
        </div>
    )
}
