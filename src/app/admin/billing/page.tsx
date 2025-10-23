'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, FileText } from "lucide-react";
import { useDatabase } from '@/firebase';
import { ref, onValue, set, get } from 'firebase/database';
import { useToast } from '@/hooks/use-toast';

export default function BillingPage() {
    const db = useDatabase();
    const { toast } = useToast();
    const [rate, setRate] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!db) return;
        const rateRef = ref(db, 'config/rate');
        const unsubscribe = onValue(rateRef, (snapshot) => {
            const dbRate = snapshot.val();
            setRate(dbRate !== null ? String(dbRate) : '0.25'); // Default a 0.25 si no existe
            setLoading(false);
        });

        return () => unsubscribe();
    }, [db]);

    const handleSaveRate = async () => {
        if (!db) return;
        const newRate = parseFloat(rate);
        if (isNaN(newRate) || newRate < 0) {
            toast({
                variant: 'destructive',
                title: 'Valor inválido',
                description: 'Por favor, introduce un número positivo para la tarifa.',
            });
            return;
        }

        setSaving(true);
        try {
            await set(ref(db, 'config/rate'), newRate);
            toast({
                title: 'Tarifa actualizada',
                description: `La nueva tarifa por minuto es Q${newRate.toFixed(2)}.`,
            });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error al guardar',
                description: error.message,
            });
        } finally {
            setSaving(false);
        }
    };
    
    const handleFinalizeSessions = async () => {
        if (!db) return;
        
        setSaving(true);
        try {
            const sessionsRef = ref(db, 'sessions');
            const rateRef = ref(db, 'config/rate');
            
            const [sessionsSnapshot, rateSnapshot] = await Promise.all([
                get(sessionsRef),
                get(rateRef)
            ]);
            
            const currentRate = rateSnapshot.val() || 0;
            const sessions = sessionsSnapshot.val() || {};
            
            let updatedCount = 0;
            const updates: { [key: string]: any } = {};

            for (const sessionId in sessions) {
                const session = sessions[sessionId];
                if (session.status === 'completed' && session.endTime && (session.total === null || session.total === undefined)) {
                    const duration = (session.endTime - session.startTime) / 60000; // in minutes
                    const total = duration * currentRate;
                    updates[`/sessions/${sessionId}/total`] = parseFloat(total.toFixed(2));
                    updatedCount++;
                }
            }

            if (updatedCount > 0) {
                 await set(ref(db), { ...updates });
                toast({
                    title: "Cálculo completado",
                    description: `Se ha calculado el total para ${updatedCount} sesiones finalizadas.`
                });
            } else {
                 toast({
                    title: "No hay acciones pendientes",
                    description: "Todas las sesiones finalizadas ya tienen su total calculado."
                });
            }

        } catch (error: any) {
             toast({
                variant: "destructive",
                title: "Error al finalizar sesiones",
                description: error.message,
            });
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="flex-1 space-y-8">
             <div>
                <h2 className="text-3xl font-bold tracking-tight font-headline">Cobros y Tarifas</h2>
                <p className="text-muted-foreground">
                    Define las tarifas del parqueo y gestiona los cobros.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Tarifa de Aparcamiento</CardTitle>
                    <CardDescription>Establece el costo por minuto para todas las sesiones de aparcamiento.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center space-x-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Cargando tarifa actual...</span>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-4 items-end">
                            <div className="grid gap-2">
                                <Label htmlFor="rate">Tarifa por minuto (Q)</Label>
                                <Input 
                                    id="rate" 
                                    type="number" 
                                    step="0.01" 
                                    min="0"
                                    value={rate}
                                    onChange={(e) => setRate(e.target.value)}
                                    placeholder="Ej: 0.25"
                                />
                            </div>
                            <Button onClick={handleSaveRate} disabled={saving} className="w-full md:w-auto">
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Guardar Tarifa
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Gestión de Cobros</CardTitle>
                    <CardDescription>Calcula el costo total para las sesiones que han finalizado pero aún no tienen un cobro asociado.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Este proceso revisará todas las sesiones completadas y aplicará la tarifa actual para calcular el monto a cobrar.
                    </p>
                     <Button onClick={handleFinalizeSessions} disabled={saving} variant="secondary">
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Calcular Totales Pendientes
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
