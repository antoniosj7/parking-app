import AdminDashboard from "@/components/admin-dashboard";

export default function AdminPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="mb-8 font-headline text-4xl font-bold tracking-tight md:text-5xl">
                Admin Dashboard
            </h1>
            <AdminDashboard />
        </div>
    )
}
