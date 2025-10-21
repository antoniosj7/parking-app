"use client"

import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { occupancyData } from "@/lib/data"

const chartConfig = {
  occupied: {
    label: "Ocupadas",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function OccupancyChart() {
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
