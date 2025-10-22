"use client"

import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, AreaChart, Area } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { useCollection } from "@/firebase";
import { collection, query, where, getFirestore } from 'firebase/firestore';
import type { ParkingSession } from "@/lib/types";
import { useMemo } from "react";
import { subHours, format, startOfHour } from 'date-fns';

const chartConfig = {
  occupied: {
    label: "Plazas Ocupadas",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const generateTimeSlots = (hours: number) => {
  const now = new Date();
  const slots = [];
  for (let i = hours - 1; i >= 0; i--) {
    const date = subHours(now, i);
    slots.push(startOfHour(date));
  }
  return slots;
};

export default function OccupancyChart() {
  const firestore = typeof window !== 'undefined' ? getFirestore() : null;
  const sessionsQuery = firestore 
    ? query(collection(firestore, 'sessions'))
    : null;
    
  const { data: sessions, loading } = useCollection<ParkingSession>(sessionsQuery);

  const occupancyData = useMemo(() => {
    if (!sessions) return [];
    
    const timeSlots = generateTimeSlots(12); // Last 12 hours
    const dataMap = new Map<string, number>();

    timeSlots.forEach(slot => {
        dataMap.set(format(slot, 'HH:00'), 0);
    });

    sessions.forEach(session => {
        if (session.startTime) {
            const start = session.startTime.toDate();
            const end = session.endTime ? session.endTime.toDate() : new Date();

            timeSlots.forEach(slot => {
                const slotEnd = new Date(slot.getTime() + 3599999);
                if (start < slotEnd && end > slot) {
                    const hourKey = format(slot, 'HH:00');
                    dataMap.set(hourKey, (dataMap.get(hourKey) || 0) + 1);
                }
            });
        }
    });

    return Array.from(dataMap.entries()).map(([hour, occupied]) => ({ hour, occupied }));
  }, [sessions]);

  if (loading) {
      return <div className="flex justify-center items-center h-[350px]">Cargando gráfico de ocupación...</div>
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={occupancyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="colorOccupied" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-occupied)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="var(--color-occupied)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="hour"
            stroke="hsl(var(--foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            domain={[0, 'dataMax + 2']}
          />
          <Tooltip
            cursor={{fill: 'hsla(var(--muted))'}}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Area
            dataKey="occupied"
            type="monotone"
            fill="url(#colorOccupied)"
            stroke="var(--color-occupied)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
