import { AppCard } from "@/components/app/AppCard";
import { AppSection } from "@/components/app/AppSection";

export default function CustomerPage() {
    return
    <AppSection>
        <h1 className="text-3xl font-semibold">Customer dashboard</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
            <AppCard className="p-6">
                <p className="text-sm text-neutral-500">Saved configurations</p>
                <p className="mt-3 text-3xl font-semibold">0</p>
            </AppCard><AppCard className="p-6">
                <p className="text-sm text-neutral-500">Favorites</p>
                <p className="mt-3 text-3xl font-semibold">0</p>
            </AppCard><AppCard className="p-6">
                <p className="text-sm text-neutral-500">Appointments</p>
                <p className="mt-3 text-3xl font-semibold">0</p>
            </AppCard>
        </div>
    </AppSection>
}
