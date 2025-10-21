import AdminDashboard from "@/components/admin-dashboard";
import Header from "@/components/header";

export default function AdminPage() {
    return (
        <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto py-8 px-4">
                    <h1 className="mb-8 font-headline text-4xl font-bold tracking-tight md:text-5xl">
                        Panel Principal
                    </h1>
                    <AdminDashboard />
                </div>
            </main>
        </div>
    )
}
