'use client';
// Antonio SJ
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
import { Ban } from "lucide-react";
import { useCollection } from "@/firebase";
import { collection, query, where, getFirestore, doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import type { ParkingSession, ParkingSpot } from "@/lib/types";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function SessionManagementTable() {
  const firestore = typeof window !== 'undefined' ? getFirestore() : null;
  const { toast } = useToast();
  const [finishingId, setFinishingId] = useState<string | null>(null);

  const sessionsQuery = firestore 
    ? query(collection(firestore, 'sessions'), where('status', '==', 'active'))
    : null;
    
  const { data: activeSessions, loading } = useCollection<ParkingSession>(sessionsQuery);

  const handleForceFinish = async (session: ParkingSession) => {
    if (!firestore) {
        toast({ variant: "destructive", title: "Error de conexión." });
        return;
    }
    setFinishingId(session.id);

    try {
        const batch = writeBatch(firestore);

        // 1. Actualizar la sesión
        const sessionRef = doc(firestore, 'sessions', session.id);
        batch.update(sessionRef, {
            status: 'completed',
            endTime: serverTimestamp()
        });
        
        // 2. Actualizar la plaza
        const spotRef = doc(firestore, 'spots', session.spotId);
        batch.update(spotRef, {
            status: 'available',
            occupied: false,
            user: null,
            currentSessionId: null
        });

        await batch.commit();

        toast({
            title: "Sesión Finalizada",
            description: `La sesión en la plaza ${session.spotId} ha sido finalizada correctamente.`
        });
    } catch (error) {
        console.error("Error al finalizar la sesión:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "No se pudo finalizar la sesión. Inténtalo de nuevo."
        });
    } finally {
        setFinishingId(null);
    }
  };


  if (loading) {
    return <div className="text-center p-8">Cargando sesiones activas...</div>;
  }
  
  if (!activeSessions || activeSessions.length === 0) {
    return <div className="text-center p-8 text-muted-foreground">No hay sesiones activas en este momento.</div>;
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Plaza</TableHead>
          <TableHead>Usuario</TableHead>
          <TableHead>Inicio</TableHead>
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
                {session.startTime ? formatDistanceToNow(session.startTime.toDate(), { addSuffix: true, locale: es }) : 'Calculando...'}
            </TableCell>
            <TableCell>
              <Badge variant="default" className="bg-green-500/80 hover:bg-green-500 text-white">
                Activa
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button 
                variant="destructive" 
                size="sm" 
                disabled={session.status !== 'active' || finishingId === session.id}
                onClick={() => handleForceFinish(session)}
              >
                 <Ban className="mr-2 h-4 w-4" />
                {finishingId === session.id ? 'Finalizando...' : 'Finalizar Forzosamente'}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
