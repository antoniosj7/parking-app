'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useUser } from "@/firebase";
import { useCollection } from "@/firebase";
import { collection, query, where, getFirestore, orderBy } from 'firebase/firestore';
import type { ParkingSession } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";

function calculateDuration(startTime: any, endTime: any) {
  if (!startTime || !endTime) return "En curso";
  const start = startTime.toDate();
  const end = endTime.toDate();
  const diffMs = end.getTime() - start.getTime();
  const hours = Math.floor(diffMs / 3600000);
  const minutes = Math.floor((diffMs % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
}

export default function HistoryPage() {
  const { user } = useUser();
  const firestore = typeof window !== 'undefined' ? getFirestore() : null;
  
  const sessionsQuery = user && firestore
    ? query(
        collection(firestore, 'sessions'), 
        where('user', '==', user.displayName || 'usuario1'), // Fallback for mocked user
        orderBy('startTime', 'desc')
      )
    : null;
    
  const { data: sessions, loading } = useCollection<ParkingSession>(sessionsQuery);

  return (
    <div className="flex-1 space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight font-headline">Mi Historial de Uso</h2>
        <p className="text-muted-foreground">
            Aquí puedes ver todas tus sesiones de aparcamiento anteriores.
        </p>
      </div>
      <Card>
        <CardContent className="p-0">
          {loading && <p className="p-6 text-center">Cargando historial...</p>}
          {!loading && sessions && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Plaza</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead className="text-right">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map(session => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">{session.spotId}</TableCell>
                    <TableCell>
                      {session.startTime ? format(session.startTime.toDate(), 'dd/MM/yyyy HH:mm') : 'N/A'}
                    </TableCell>
                    <TableCell>{calculateDuration(session.startTime, session.endTime)}</TableCell>
                    <TableCell className="text-right">
                       <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
                            {session.status === 'active' ? 'Activa' : 'Completada'}
                        </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
           {!loading && (!sessions || sessions.length === 0) && (
            <p className="p-6 text-center text-muted-foreground">No tienes sesiones de aparcamiento registradas.</p>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
