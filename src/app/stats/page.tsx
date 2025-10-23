'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { DollarSign, Clock, Hash, Loader2, BarChart as BarChartIcon } from "lucide-react";
import { useRtdbValue } from "@/firebase";
import { type Session } from "@/lib/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function processSessionData(sessions: Record<string, Session> | null) {
    if (!sessions) {
        return {
            totalRevenue: 0,
            averageDuration: 0,
            totalSessions: 0,
            dailyRevenue: [],
        };
    }

    const sessionList = Object.values(sessions).filter(s => s.status === 'completed' && s.total && s.endTime);
    const totalSessions = Object.keys(sessions).length;
    
    const totalRevenue = sessionList.reduce((acc, s) => acc + (s.total || 0), 0);
    
    const totalDuration = sessionList.reduce((acc, s) => acc + (s.endTime! - s.startTime), 0);
    const averageDuration = sessionList.length > 0 ? (totalDuration / sessionList.length) / 60000 : 0; // in minutes

    // Calculate daily revenue for the last 7 days
    const dailyRevenue: { [key: string]: number } = {};
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
        dailyRevenue[key] = 0;
    }

    sessionList.forEach(s => {
        const date = new Date(s.endTime!);
         const key = date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
        if (key in dailyRevenue) {
            dailyRevenue[key] += s.total || 0;
        }
    });
    
    const chartData = Object.entries(dailyRevenue).map(([name, Ingresos]) => ({ name, Ingresos }));

    return {
        totalRevenue,
        averageDuration,
        totalSessions,
        dailyRevenue: chartData,
    };
}


export default function StatsPage() {
    const { data: sessions, loading } = useRtdbValue<Record<string, Session>>('/sessions');
    const { totalRevenue, averageDuration, totalSessions, dailyRevenue } = processSessionData(sessions);
    
    if (loading) {
        return (
            <div className="flex-1 space-y-8 flex items-center justify-center">
                 <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-8">
             <div>
                <h2 className="text-3xl font-bold tracking-tight font-headline">Estadísticas</h2>
                <p className="text-muted-foreground">
                    Visualiza el rendimiento y la ocupación del parqueo.
                </p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Q{totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">de todas las sesiones completadas</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{averageDuration.toFixed(0)} min</div>
                        <p className="text-xs text-muted-foreground">de duración por sesión</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sesiones Totales</CardTitle>
                        <Hash className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalSessions}</div>
                         <p className="text-xs text-muted-foreground">sesiones activas y completadas</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                 <CardHeader>
                    <CardTitle>Ingresos de la Última Semana</CardTitle>
                    <CardDescription>Rendimiento de los últimos 7 días.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dailyRevenue}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip 
                                formatter={(value: number) => `Q${value.toFixed(2)}`}
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    borderColor: 'hsl(var(--border))'
                                }}
                            />
                            <Legend />
                            <Bar dataKey="Ingresos" fill="hsl(var(--primary))" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}
