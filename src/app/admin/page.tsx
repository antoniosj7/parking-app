import AdminDashboard from "@/components/admin-dashboard";

export default function AdminPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <h1 className="mb-8 font-headline text-4xl font-bold tracking-tight md:text-5xl">
                Panel Principal
            </h1>
            <AdminDashboard />
        </div>
    )
}
