import { AppCard } from "@/components/app/AppCard";
const stats = [["Products", "24"], ["New leads", "18"], ["WhatsApp clicks", "42"], ["Won leads", "7"]];
export default function AdminPage() {
    return <>
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{stats.map(([label, value]) =>
            <AppCard key={label} className="p-6">
                <p className="text-sm text-neutral-500">{label}</p>
                <p className="mt-3 text-3xl font-semibold">{value}</p>
            </AppCard>)}
        </div>
    </>
}
