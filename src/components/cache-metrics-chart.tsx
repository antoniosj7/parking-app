"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { cacheMetrics } from "@/lib/data"

const chartConfig = {
  hits: {
    label: "Hits",
    color: "hsl(var(--chart-1))",
  },
  misses: {
    label: "Misses",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function CacheMetricsChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={cacheMetrics} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
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
            tickFormatter={(value) => `${value / 1000}k`}
          />
          <Tooltip
            cursor={{fill: 'hsla(var(--card))'}}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar dataKey="hits" fill="var(--color-hits)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="misses" fill="var(--color-misses)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
