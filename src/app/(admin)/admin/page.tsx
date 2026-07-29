import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AppCard } from "@/components/app/AppCard";
import { analyticsEvents, appointments, configurations, leads, products } from "@/lib/admin-data";

const stats = [["Products", "24"], ["New leads", "18"], ["WhatsApp clicks", "42"], ["Won leads", "7"]];

export default function AdminPage() {
  return (
    <>
      <AdminPageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Track the SHANY Living customer journey from product views to WhatsApp-qualified leads."
        action="Create Report"
      />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => (
          <AppCard key={label} className="p-6">
            <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">{label}</p>
            <p className="mt-3 text-3xl font-bold">{value}</p>
          </AppCard>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AppCard className="p-6">
          <h2 className="font-serif text-2xl font-bold">Business Process Flow</h2>
          <div className="mt-5 grid gap-3">
            {["Customer selects model", "Chooses size, structure, fabric and color", "Optional room photo upload", "Summary saved with reference", "WhatsApp intent captured", "Sales team sends quote or books showroom"].map((item, index) => (
              <div key={item} className="flex items-center gap-3 rounded-md border border-neutral-200 p-3 dark:border-white/10">
                <span className="grid size-7 place-items-center rounded-full bg-neutral-950 text-xs font-bold text-white dark:bg-white dark:text-neutral-950">{index + 1}</span>
                <span className="text-sm font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </AppCard>
        <AppCard className="p-6">
          <h2 className="font-serif text-2xl font-bold">What Is Left</h2>
          <div className="mt-5 space-y-4 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            <p>Products still need live create, edit, upload and sort actions connected to the backend.</p>
            <p>The public storefront still needs product detail pages and the full sofa configurator flow.</p>
            <p>Analytics, appointments and media are prepared as admin sections, but need real integrations before launch.</p>
          </div>
        </AppCard>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <AppCard className="p-5">
          <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400">Featured Products</p>
          <p className="mt-2 text-2xl font-bold">{products.length}</p>
        </AppCard>
        <AppCard className="p-5">
          <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400">Active Configurations</p>
          <p className="mt-2 text-2xl font-bold">{configurations.length}</p>
        </AppCard>
        <AppCard className="p-5">
          <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400">Upcoming Appointments</p>
          <p className="mt-2 text-2xl font-bold">{appointments.length}</p>
        </AppCard>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <AppCard className="p-6">
          <h2 className="font-serif text-2xl font-bold">Priority Leads</h2>
          <div className="mt-4 space-y-3">
            {leads.map((lead) => (
              <div key={lead.reference} className="flex items-center justify-between rounded-md border border-neutral-200 p-3 dark:border-white/10">
                <div>
                  <p className="font-bold">{lead.name}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{lead.product} · {lead.source}</p>
                </div>
                <span className="text-sm font-bold">{lead.status}</span>
              </div>
            ))}
          </div>
        </AppCard>
        <AppCard className="p-6">
          <h2 className="font-serif text-2xl font-bold">Key Events</h2>
          <div className="mt-4 space-y-3">
            {analyticsEvents.map((event) => (
              <div key={event.event} className="flex items-center justify-between rounded-md border border-neutral-200 p-3 dark:border-white/10">
                <div>
                  <p className="font-bold">{event.event}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{event.priority} priority</p>
                </div>
                <span className="text-sm font-bold">{event.count} {event.trend}</span>
              </div>
            ))}
          </div>
        </AppCard>
      </div>
    </>
  );
}
