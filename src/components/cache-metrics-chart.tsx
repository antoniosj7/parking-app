"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { time: "09:00", hits: 120, misses: 15 },
  { time: "09:05", hits: 150, misses: 10 },
  { time: "09:10", hits: 130, misses: 5 },
  { time: "09:15", hits: 180, misses: 2 },
  { time: "09:20", hits: 160, misses: 8 },
  { time: "09:25", hits: 200, misses: 1 },
]

const chartConfig = {
  hits: {
    label: "Aciertos (Hits)",
    color: "hsl(var(--chart-2))",
  },
  misses: {
    label: "Fallos (Misses)",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export default function CacheMetricsChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="time"
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
          />
          <Tooltip
            cursor={{fill: 'hsla(var(--card))'}}
            content={<ChartTooltipContent />}
          />
          <Bar dataKey="hits" fill="var(--color-hits)" radius={4} />
          <Bar dataKey="misses" fill="var(--color-misses)" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
