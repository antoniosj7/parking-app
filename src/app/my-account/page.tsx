'use client';
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { useUser, useCollection } from "@/firebase";
import { collection, query, where, getFirestore } from 'firebase/firestore';
import type { ParkingSession } from "@/lib/types";
import { useEffect, useState } from "react";

const TARIFF_PER_HOUR = 10; // Q 10.00 por hora

export default function MyAccountPage() {
  const { user } = useUser();
  const firestore = typeof window !== 'undefined' ? getFirestore() : null;
  const [elapsedTime, setElapsedTime] = useState("0h 0m 0s");
  const [amountToPay, setAmountToPay] = useState("0.00");

  const activeSessionQuery = user && firestore
    ? query(
        collection(firestore, 'sessions'),
        where('user', '==', user.displayName || 'usuario1'), // Fallback for mocked user
        where('status', '==', 'active')
      )
    : null;

  const { data: activeSessions, loading } = useCollection<ParkingSession>(activeSessionQuery);
  const activeSession = activeSessions?.[0];

  useEffect(() => {
    if (!activeSession || !activeSession.startTime) {
      setElapsedTime("0h 0m 0s");
      setAmountToPay("0.00");
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const start = activeSession.startTime.toDate();
      const diffMs = now.getTime() - start.getTime();

      const hours = Math.floor(diffMs / 3600000);
      const minutes = Math.floor((diffMs % 3600000) / 60000);
      const seconds = Math.floor((diffMs % 60000) / 1000);
      setElapsedTime(`${hours}h ${minutes}m ${seconds}s`);
      
      const cost = (diffMs / 3600000) * TARIFF_PER_HOUR;
      setAmountToPay(cost.toFixed(2));

    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession]);

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4">
          <h1 className="mb-8 font-headline text-4xl font-bold tracking-tight md:text-5xl">
            Mi Cuenta
          </h1>
          <Card>
            <CardHeader>
              <CardTitle>Sesión de Aparcamiento Actual</CardTitle>
              <CardDescription>
                {loading 
                  ? "Buscando sesión activa..." 
                  : activeSession 
                  ? `Estacionado en la plaza ${activeSession.spotId}.`
                  : "No tienes ninguna sesión de aparcamiento activa."
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="flex items-center space-x-4 rounded-md border p-4">
                    <Clock className="h-8 w-8 text-primary" />
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Tiempo Transcurrido</p>
                        <p className="text-2xl font-bold">{elapsedTime}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4 rounded-md border p-4">
                    <span className="text-2xl font-bold text-primary">Q</span>
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Monto a Pagar</p>
                        <p className="text-2xl font-bold">{amountToPay}</p>
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
