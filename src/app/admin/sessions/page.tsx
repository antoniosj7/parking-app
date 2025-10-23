'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, ServerCrash } from "lucide-react";
import { useRtdbValue } from "@/firebase";
import { type Session } from "@/lib/types";
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';

function SessionRow({ session }: { session: Session }) {
  const startTime = new Date(session.startTime);
  const endTime = session.endTime ? new Date(session.endTime) : null;
  
  const duration = endTime && startTime
    ? formatDistanceToNow(endTime, { locale: es, addSuffix: false, unit: 'minute', referenceDate: startTime })
    : (startTime ? formatDistanceToNow(startTime, { locale: es, addSuffix: true }) : 'N/A');

  return (
    <TableRow>
      <TableCell className="font-medium">{session.spotId}</TableCell>
      <TableCell>{session.user || session.userId || 'N/A'}</TableCell>
      <TableCell>
        <Badge variant={session.status === 'active' ? 'destructive' : 'secondary'}>
          {session.status === 'active' ? 'Activa' : 'Finalizada'}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span title={format(startTime, "dd/MM/yyyy HH:mm:ss")}>
            {formatDistanceToNow(startTime, { locale: es, addSuffix: true })}
          </span>
          {endTime && (
            <span className="text-xs text-muted-foreground" title={format(endTime, "dd/MM/yyyy HH:mm:ss")}>
              finalizó {formatDistanceToNow(endTime, { locale: es, addSuffix: true })}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>{duration}</TableCell>
      <TableCell className="text-right">
        {session.total !== null && session.total !== undefined ? `$${session.total.toFixed(2)}` : '---'}
      </TableCell>
    </TableRow>
  );
}

export default function SessionsPage() {
  const { data: sessionsData, loading, error } = useRtdbValue<Record<string, Session>>('sessions');
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    if (sessionsData) {
      const sessionsList: Session[] = Object.keys(sessionsData)
        .map(id => ({ id, ...sessionsData[id] }))
        .sort((a, b) => b.startTime - a.startTime); // Ordenar por más reciente
      setSessions(sessionsList);
    }
  }, [sessionsData]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">Cargando sesiones...</p>
        </div>
      );
    }
    if (error) {
      return (
         <div className="flex flex-col items-center justify-center py-10 text-destructive">
          <ServerCrash className="h-10 w-10 mb-4" />
          <p className="font-semibold">Error al cargar los datos</p>
          <p className="text-sm">{error.message}</p>
        </div>
      );
    }
    if (sessions.length === 0) {
      return (
        <p className="text-center py-10 text-muted-foreground">No hay sesiones registradas.</p>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Plaza</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Inicio/Fin</TableHead>
            <TableHead>Duración</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <SessionRow key={session.id} session={session} />
          ))}
        </TableBody>
      </Table>
    );
  };

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
          <CardTitle>Sesiones Recientes</CardTitle>
          <CardDescription>
            Lista de todas las ocupaciones de plazas ordenadas por la más reciente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
