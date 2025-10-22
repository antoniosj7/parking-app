'use client';

import { useCollection } from '@/firebase';
import { collection, getFirestore, limit, orderBy, query } from 'firebase/firestore';
import type { ParkingSession } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { CheckCircle2, ParkingSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const ActivityItem = ({ session }: { session: ParkingSession }) => {
  const isCompleted = session.status === 'completed';
  const timeAgo = session.startTime ? formatDistanceToNow(session.startTime.toDate(), { addSuffix: true, locale: es }) : 'hace un momento';

  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0">
        <span className={`flex h-10 w-10 items-center justify-center rounded-full ${isCompleted ? 'bg-secondary' : 'bg-primary/10'}`}>
          {isCompleted 
            ? <CheckCircle2 className="h-5 w-5 text-muted-foreground" /> 
            : <ParkingSquare className="h-5 w-5 text-primary" />
          }
        </span>
      </div>
      <div className="flex-grow">
        <div className="flex items-center justify-between">
            <p className="font-medium">
                <span className="font-bold text-primary">{session.user}</span> inició sesión en la plaza <span className="font-bold">{session.spotId}</span>
            </p>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
        </div>
        <Badge variant={isCompleted ? 'secondary' : 'default'} className="mt-1">
            {isCompleted ? 'Completada' : 'Activa'}
        </Badge>
      </div>
    </div>
  );
};


const ActivitySkeleton = () => {
  return (
     <div className="flex items-start space-x-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-grow space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  )
}

export default function ActivityPage() {
  const firestore = typeof window !== 'undefined' ? getFirestore() : null;
  const sessionsQuery = firestore
    ? query(collection(firestore, 'sessions'), orderBy('startTime', 'desc'), limit(20))
    : null;
    
  const { data: sessions, loading } = useCollection<ParkingSession>(sessionsQuery);

  return (
    <div className="flex-1 space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight font-headline">Actividad Reciente</h2>
        <p className="text-muted-foreground">
          Un registro de las últimas sesiones de aparcamiento en el sistema.
        </p>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Feed de Actividad</CardTitle>
            <CardDescription>Mostrando las últimas 20 sesiones iniciadas.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-8">
              {loading && Array.from({length: 5}).map((_, i) => <ActivitySkeleton key={i} />)}

              {!loading && sessions && sessions.map(session => (
                <ActivityItem key={session.id} session={session} />
              ))}
              
              {!loading && (!sessions || sessions.length === 0) && (
                <div className="text-center py-10 text-muted-foreground">
                  <p>No hay actividad reciente para mostrar.</p>
                </div>
              )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
