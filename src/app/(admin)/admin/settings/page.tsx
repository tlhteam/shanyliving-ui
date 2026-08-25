import { getTranslations } from "next-intl/server";
import { Bell, Globe2, Link2, LockKeyhole, MessageCircle, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { Badge } from "@/components/ui/badge";

const settingTabs = [
  { key: "general", icon: SlidersHorizontal },
  { key: "channels", icon: MessageCircle },
  { key: "localization", icon: Globe2 },
  { key: "tracking", icon: Link2 },
  { key: "legal", icon: ShieldCheck }
] as const;

const generalCards = [
  { key: "notifications", icon: Bell },
  { key: "localization", icon: Globe2 },
  { key: "launch", icon: ShieldCheck }
] as const;

const settingGroups = [
  { key: "storefront", rows: [["language", "Planned"], ["theme", "Active"], ["homepage", "Active"]] },
  { key: "communication", rows: [["whatsapp", "Active"], ["orders", "Active"], ["replies", "Active"]] },
  { key: "compliance", rows: [["pixels", "Planned"], ["legal", "Needs review"], ["security", "Active"]] }
] as const;

function statusVariant(status: string): "default" | "secondary" | "destructive" {
  const normalized = status.toLowerCase();

  if (normalized.includes("active")) {
    return "default";
  }

  if (normalized.includes("required") || normalized.includes("needs")) {
    return "destructive";
  }

  return "secondary";
}

export default async function Page() {
  const t = await getTranslations("adminPanel.settings");
  const groups = await getTranslations("adminPanel.groups");

  return (
    <>
      <AdminPageHeader eyebrow={groups("system")} title={t("title")} description={t("description")} action={t("action")} />

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <AppCard className="h-max p-2 dark:border-white/10 dark:bg-neutral-900">
          <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible" aria-label={t("sectionsLabel")}>
            {settingTabs.map((tab, index) => {
              const Icon = tab.icon;

              return (
                <button
                  key={tab.key}
                  className={`flex h-11 shrink-0 items-center gap-3 rounded-md px-3 text-sm font-bold transition ${index === 0 ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950" : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-white/10"}`}
                  type="button"
                >
                  <Icon className="size-4" />
                  {t(`tabs.${tab.key}`)}
                </button>
              );
            })}
          </nav>
        </AppCard>

        <div className="space-y-4">
          <AppCard className="p-5 dark:border-white/10 dark:bg-neutral-900">
            <div className="flex flex-col gap-4 border-b border-neutral-200 pb-5 dark:border-white/10 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold">{t("generalTitle")}</h2>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{t("generalDescription")}</p>
              </div>
              <AppButton className="gap-2">
                <LockKeyhole className="size-4" />
                {t("update")}
              </AppButton>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {generalCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div key={card.key} className="rounded-md border border-neutral-200 p-4 dark:border-white/10">
                    <Icon className="size-5 text-neutral-500 dark:text-neutral-300" />
                    <p className="mt-3 text-sm font-bold">{t(`cards.${card.key}.title`)}</p>
                    <p className="mt-1 text-xs leading-5 text-neutral-600 dark:text-neutral-400">{t(`cards.${card.key}.text`)}</p>
                  </div>
                );
              })}
            </div>
          </AppCard>

          {settingGroups.map((group) => (
            <AppCard key={group.key} className="overflow-hidden dark:border-white/10 dark:bg-neutral-900">
              <div className="border-b border-neutral-200 p-5 dark:border-white/10">
                <h3 className="font-serif text-xl font-bold">{t(`groups.${group.key}.title`)}</h3>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{t(`groups.${group.key}.description`)}</p>
              </div>
              <div className="divide-y divide-neutral-200 dark:divide-white/10">
                {group.rows.map(([rowKey, status]) => (
                  <div key={rowKey} className="grid gap-3 p-5 sm:grid-cols-[220px_1fr_auto] sm:items-center">
                    <p className="text-sm font-bold">{t(`groups.${group.key}.rows.${rowKey}.label`)}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">{t(`groups.${group.key}.rows.${rowKey}.value`)}</p>
                    <Badge variant={statusVariant(status)}>{t(`statuses.${status}`)}</Badge>
                  </div>
                ))}
              </div>
            </AppCard>
          ))}
        </div>
      </div>
    </>
  );
}
