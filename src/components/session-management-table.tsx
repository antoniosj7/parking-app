'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useCollection } from "@/firebase";
import { collection, query, where, getFirestore } from 'firebase/firestore';
import type { ParkingSession } from "@/lib/types";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function SessionManagementTable() {
  const firestore = typeof window !== 'undefined' ? getFirestore() : null;
  const sessionsQuery = firestore 
    ? query(collection(firestore, 'sessions'), where('status', '==', 'active'))
    : null;
    
  const { data: activeSessions, loading } = useCollection<ParkingSession>(sessionsQuery);

  if (loading) {
    return <div className="text-center p-4">Cargando sesiones activas...</div>;
  }
  
  if (!activeSessions || activeSessions.length === 0) {
    return <div className="text-center p-4 text-muted-foreground">No hay sesiones activas en este momento.</div>;
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Plaza</TableHead>
          <TableHead>Usuario</TableHead>
          <TableHead>Inicio</TableHead>
          <TableHead>Duración</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activeSessions.map((session) => (
          <TableRow key={session.id}>
            <TableCell className="font-medium">{session.spotId}</TableCell>
            <TableCell>{session.user}</TableCell>
            <TableCell>
                {session.startTime ? formatDistanceToNow(session.startTime.toDate(), { addSuffix: true, locale: es }) : 'N/A'}
            </TableCell>
            <TableCell>
                {session.startTime ? formatDistanceToNow(session.startTime.toDate(), { locale: es }) : 'N/A'}
            </TableCell>
            <TableCell>
              <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
                Activa
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" disabled={session.status !== 'active'}>
                 <Clock className="mr-2 h-4 w-4" />
                Finalizar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
