"use client"

import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { useCollection } from "@/firebase";
import { collection, query, where, getFirestore } from 'firebase/firestore';
import type { ParkingSession } from "@/lib/types";
import { useMemo } from "react";
import { subHours, format, startOfHour } from 'date-fns';

const chartConfig = {
  occupied: {
    label: "Ocupadas",
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
    ? query(collection(firestore, 'sessions')) // Query all sessions
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
            const end = session.endTime ? session.endTime.toDate() : new Date(); // If not ended, it's active now

            timeSlots.forEach(slot => {
                const slotEnd = new Date(slot.getTime() + 3599999); // End of the hour
                 // A session contributes to a slot if it was active at any point during that hour
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
        <LineChart data={occupancyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
            cursor={{fill: 'hsla(var(--card))'}}
            content={<ChartTooltipContent />}
          />
          <Line
            dataKey="occupied"
            type="monotone"
            stroke="var(--color-occupied)"
            strokeWidth={2}
            dot={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
