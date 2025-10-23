import AdminDashboard from "@/components/admin-dashboard";
import { Suspense } from "react";
import ParkingGrid from "@/components/parking-grid";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPage() {
    return (
        <div className="flex-1 space-y-8">
             <div>
                <h2 className="text-3xl font-bold tracking-tight font-headline">Panel Principal</h2>
                <p className="text-muted-foreground">
                    Vista general del estado del parqueo y configuración.
                </p>
            </div>
            <AdminDashboard />
            <div className="space-y-4">
                <h3 className="text-2xl font-bold tracking-tight font-headline">Vista Rápida del Parqueo</h3>
                <Suspense fallback={<Skeleton className="h-48 w-full" />}>
                    <ParkingGrid />
                </Suspense>
            </div>
        </div>
    )
}
