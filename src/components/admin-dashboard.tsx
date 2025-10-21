import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CacheMetricsChart from "./cache-metrics-chart";
import SessionManagementTable from "./session-management-table";
import { Activity, GanttChartSquare } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="grid gap-8">
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-headline text-2xl font-medium">Cache Metrics</CardTitle>
          <Activity className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <CacheMetricsChart />
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-headline text-2xl font-medium">Session Management</CardTitle>
          <GanttChartSquare className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <SessionManagementTable />
        </CardContent>
      </Card>
    </div>
  );
}
