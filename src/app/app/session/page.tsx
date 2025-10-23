'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Clock, ParkingCircle, DollarSign, Loader2 } from "lucide-react";
import { useRtdbValue, useUser } from '@/firebase';
import type { Session } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function formatDuration(ms: number) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default function UserSessionPage() {
    const { user, loading: userLoading } = useUser();
    const { data: sessions, loading: sessionsLoading } = useRtdbValue<Record<string, Session>>('/sessions');
    const { data: rate, loading: rateLoading } = useRtdbValue<number>('config/rate');
    const [currentTime, setCurrentTime] = useState(Date.now());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    const activeSession = React.useMemo(() => {
        if (!sessions || !user) return null;
        return Object.values(sessions).find(s => s.userId === user.uid && s.status === 'active') || null;
    }, [sessions, user]);
    
    const isLoading = userLoading || sessionsLoading || rateLoading;

    if (isLoading) {
         return (
            <div className="flex-1 space-y-8 flex justify-center items-center">
                 <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        )
    }

    if (!activeSession) {
        return (
            <div className="flex-1 space-y-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-headline">Mi Sesión Actual</h2>
                    <p className="text-muted-foreground">
                        Consulta el estado de tu sesión de aparcamiento activa.
                    </p>
                </div>
                <Card className="text-center py-10">
                    <CardHeader>
                        <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
                        <CardTitle className="mt-4">No tienes una sesión activa</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Cuando ocupes una plaza, aquí podrás ver los detalles en tiempo real.
                        </p>
                        <Button asChild className="mt-4">
                           <Link href="/app/parking">Ver Parqueo</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const durationMs = currentTime - activeSession.startTime;
    const durationMinutes = durationMs / 60000;
    const estimatedCost = durationMinutes * (rate || 0);

    return (
        <div className="flex-1 space-y-8">
             <div>
                <h2 className="text-3xl font-bold tracking-tight font-headline">Mi Sesión Actual</h2>
                <p className="text-muted-foreground">
                    Tu sesión de aparcamiento en tiempo real.
                </p>
            </div>
            <Card className="bg-gradient-to-br from-primary/10 to-transparent">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ParkingCircle className="text-primary" />
                        <span>Plaza Ocupada: <span className="font-bold text-2xl ml-2">{activeSession.spotId}</span></span>
                    </CardTitle>
                    <CardDescription>Iniciada el {new Date(activeSession.startTime).toLocaleString()}</CardDescription>
                 </CardHeader>
                 <CardContent className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col items-center justify-center p-6 bg-background/50 rounded-lg">
                        <Clock className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium text-muted-foreground">Tiempo Transcurrido</p>
                        <p className="text-4xl font-bold font-mono tracking-tighter">{formatDuration(durationMs)}</p>
                    </div>
                     <div className="flex flex-col items-center justify-center p-6 bg-background/50 rounded-lg">
                        <DollarSign className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium text-muted-foreground">Costo Estimado</p>
                        <p className="text-4xl font-bold font-mono tracking-tighter">Q{estimatedCost.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground mt-1">(Tarifa: Q{rate?.toFixed(2)}/min)</p>
                    </div>
                 </CardContent>
            </Card>
        </div>
    )
}
