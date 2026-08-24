import { getTranslations } from "next-intl/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AppCard } from "@/components/app/AppCard";
import { analyticsEvents, appointments, configurations, leads, products } from "@/lib/admin-data";

const statKeys = ["products", "newLeads", "whatsappClicks", "wonLeads"] as const;
const statValues: Record<(typeof statKeys)[number], string> = {
  products: "24",
  newLeads: "18",
  whatsappClicks: "42",
  wonLeads: "7"
};

const flowKeys = ["model", "options", "photo", "summary", "whatsapp", "quote"] as const;
const leftKeys = ["products", "storefront", "integrations"] as const;

export default async function AdminPage() {
  const t = await getTranslations("adminPanel.dashboard");
  const groups = await getTranslations("adminPanel.groups");
  const values = await getTranslations("adminPanel.values");

  const badgeText = (value: string) => (values.has(value) ? values(value) : value);

  const counters = [
    { key: "featured", value: products.length },
    { key: "activeConfigurations", value: configurations.length },
    { key: "upcomingAppointments", value: appointments.length }
  ];

  return (
    <>
      <AdminPageHeader eyebrow={groups("overview")} title={t("title")} description={t("description")} action={t("action")} />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statKeys.map((key) => (
          <AppCard key={key} className="p-6">
            <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">{t(`stats.${key}`)}</p>
            <p className="mt-3 text-3xl font-bold">{statValues[key]}</p>
          </AppCard>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AppCard className="p-6">
          <h2 className="font-serif text-2xl font-bold">{t("flowTitle")}</h2>
          <div className="mt-5 grid gap-3">
            {flowKeys.map((key, index) => (
              <div key={key} className="flex items-center gap-3 rounded-md border border-neutral-200 p-3 dark:border-white/10">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-neutral-950 text-xs font-bold text-white dark:bg-white dark:text-neutral-950">
                  {index + 1}
                </span>
                <span className="text-sm font-semibold">{t(`flow.${key}`)}</span>
              </div>
            ))}
          </div>
        </AppCard>
        <AppCard className="p-6">
          <h2 className="font-serif text-2xl font-bold">{t("leftTitle")}</h2>
          <div className="mt-5 space-y-4 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            {leftKeys.map((key) => (
              <p key={key}>{t(`left.${key}`)}</p>
            ))}
          </div>
        </AppCard>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {counters.map((counter) => (
          <AppCard key={counter.key} className="p-5">
            <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400">{t(counter.key)}</p>
            <p className="mt-2 text-2xl font-bold">{counter.value}</p>
          </AppCard>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <AppCard className="p-6">
          <h2 className="font-serif text-2xl font-bold">{t("priorityLeads")}</h2>
          <div className="mt-4 space-y-3">
            {leads.map((lead) => (
              <div key={String(lead.reference)} className="flex items-center justify-between gap-3 rounded-md border border-neutral-200 p-3 dark:border-white/10">
                <div className="min-w-0">
                  <p className="truncate font-bold">{String(lead.name)}</p>
                  <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
                    {String(lead.product)} · {String(lead.source)}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-bold">{badgeText(String(lead.status))}</span>
              </div>
            ))}
          </div>
        </AppCard>
        <AppCard className="p-6">
          <h2 className="font-serif text-2xl font-bold">{t("keyEvents")}</h2>
          <div className="mt-4 space-y-3">
            {analyticsEvents.map((event) => (
              <div key={String(event.event)} className="flex items-center justify-between gap-3 rounded-md border border-neutral-200 p-3 dark:border-white/10">
                <div className="min-w-0">
                  <p className="truncate font-bold">{String(event.event)}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {t("priority", { priority: badgeText(String(event.priority)) })}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-bold">
                  {String(event.count)} {String(event.trend)}
                </span>
              </div>
            ))}
          </div>
        </AppCard>
      </div>
    </>
  );
}
