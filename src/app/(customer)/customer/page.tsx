import Link from "next/link";
import { CalendarClock, Heart, MessageCircle, Sofa } from "lucide-react";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppSection } from "@/components/app/AppSection";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";

const cards = [
  { label: "Saved configurations", value: "0", icon: Sofa },
  { label: "Favorites", value: "0", icon: Heart },
  { label: "Appointments", value: "0", icon: CalendarClock }
];

export default function CustomerPage() {
  return (
    <>
      <AppHeader />
      <main className="bg-[#f7f3ec]">
        <AppSection>
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">Customer Panel</p>
            <h1 className="mt-3 font-serif text-4xl font-bold">Your SHANY Living selections</h1>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              For MVP, this panel should stay simple: saved sofa selections, favorite products, showroom appointments and direct WhatsApp follow-up.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {cards.map(({ label, value, icon: Icon }) => (
              <AppCard key={label} className="p-6">
                <Icon className="size-6" />
                <p className="mt-5 text-sm font-semibold text-neutral-500">{label}</p>
                <p className="mt-2 text-3xl font-bold">{value}</p>
              </AppCard>
            ))}
          </div>
          <AppCard className="mt-6 p-6">
            <h2 className="font-serif text-2xl font-bold">Recommended next step</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
              The customer area should not duplicate the admin dashboard. Customers mainly need to resume a saved configuration, contact WhatsApp, or book a showroom visit.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/sofas"><AppButton className="w-full sm:w-auto">Start Sofa Selection</AppButton></Link>
              <Link href="/contact"><AppButton variant="outline" className="w-full gap-2 sm:w-auto"><MessageCircle className="size-4" /> Contact WhatsApp</AppButton></Link>
            </div>
          </AppCard>
        </AppSection>
      </main>
      <AppFooter />
    </>
  );
}
