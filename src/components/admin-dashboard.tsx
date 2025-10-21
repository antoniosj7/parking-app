// Antonio SJ
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CacheMetricsChart from "./cache-metrics-chart";
import SessionManagementTable from "./session-management-table";
import { Activity, GanttChartSquare, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ALLOWED_SPOTS } from "@/lib/allowed-spots";

export default function AdminDashboard() {
  const allowedSpotsList = Array.from(ALLOWED_SPOTS).join(', ');

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-headline text-2xl font-medium">Configuración de Plazas</CardTitle>
            <CheckCircle className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="flex items-center space-x-2">
                <span className="font-medium">Plazas Permitidas:</span>
                <Badge variant="secondary">{allowedSpotsList}</Badge>
            </div>
        </CardContent>
      </Card>

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
