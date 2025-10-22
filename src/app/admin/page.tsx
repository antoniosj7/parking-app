import AdminDashboard from "@/components/admin-dashboard";

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
        </div>
    )
}
