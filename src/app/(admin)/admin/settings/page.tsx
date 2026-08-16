import { Bell, Globe2, Link2, LockKeyhole, MessageCircle, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { Badge } from "@/components/ui/badge";

const settingTabs = [
  { label: "General", icon: SlidersHorizontal },
  { label: "Channels", icon: MessageCircle },
  { label: "Localization", icon: Globe2 },
  { label: "Tracking", icon: Link2 },
  { label: "Legal", icon: ShieldCheck }
];

const settingGroups = [
  {
    title: "Storefront Defaults",
    description: "Control the public shopping experience and launch-ready storefront behavior.",
    rows: [
      { label: "Default language", value: "Hebrew RTL for launch", status: "Planned" },
      { label: "Theme behavior", value: "Customer-selected light, dark, or system mode", status: "Active" },
      { label: "Homepage content", value: "Dynamic catalog sections, featured products, showroom details", status: "Active" }
    ]
  },
  {
    title: "Customer Communication",
    description: "Keep customer contact channels and notifications ready for orders and design help.",
    rows: [
      { label: "WhatsApp number", value: "Add live business number", status: "Required" },
      { label: "Order notifications", value: "Admin and customer notification flow", status: "Active" },
      { label: "Message replies", value: "Customer and admin conversations", status: "Active" }
    ]
  },
  {
    title: "Tracking & Compliance",
    description: "Review analytics and legal launch requirements before the public release.",
    rows: [
      { label: "Tracking pixels", value: "GA4, Meta, TikTok", status: "Planned" },
      { label: "Legal pages", value: "Privacy, accessibility, terms", status: "Needs review" },
      { label: "Security", value: "CAPTCHA, account protection, admin-only controls", status: "Active" }
    ]
  }
];

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

export default function Page() {
  return (
    <>
      <AdminPageHeader
        eyebrow="System"
        title="Settings"
        description="Configure storefront defaults, customer channels, tracking, legal content and launch readiness."
        action="Save Settings"
      />

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <AppCard className="h-max p-2 dark:border-white/10 dark:bg-neutral-900">
          <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible" aria-label="Settings sections">
            {settingTabs.map((tab, index) => {
              const Icon = tab.icon;

              return (
                <button
                  key={tab.label}
                  className={`flex h-11 shrink-0 items-center gap-3 rounded-md px-3 text-sm font-bold transition ${index === 0 ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950" : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-white/10"}`}
                  type="button"
                >
                  <Icon className="size-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </AppCard>

        <div className="space-y-4">
          <AppCard className="p-5 dark:border-white/10 dark:bg-neutral-900">
            <div className="flex flex-col gap-4 border-b border-neutral-200 pb-5 dark:border-white/10 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold">General Settings</h2>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Manage the values used across the admin panel, customer area, and public storefront.</p>
              </div>
              <AppButton className="gap-2">
                <LockKeyhole className="size-4" />
                Update Settings
              </AppButton>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-md border border-neutral-200 p-4 dark:border-white/10">
                <Bell className="size-5 text-neutral-500 dark:text-neutral-300" />
                <p className="mt-3 text-sm font-bold">Notifications</p>
                <p className="mt-1 text-xs leading-5 text-neutral-600 dark:text-neutral-400">Order, message, appointment, and admin alert preferences.</p>
              </div>
              <div className="rounded-md border border-neutral-200 p-4 dark:border-white/10">
                <Globe2 className="size-5 text-neutral-500 dark:text-neutral-300" />
                <p className="mt-3 text-sm font-bold">Localization</p>
                <p className="mt-1 text-xs leading-5 text-neutral-600 dark:text-neutral-400">Language, RTL layout, currency, and regional storefront display.</p>
              </div>
              <div className="rounded-md border border-neutral-200 p-4 dark:border-white/10">
                <ShieldCheck className="size-5 text-neutral-500 dark:text-neutral-300" />
                <p className="mt-3 text-sm font-bold">Launch Checks</p>
                <p className="mt-1 text-xs leading-5 text-neutral-600 dark:text-neutral-400">Legal pages, tracking pixels, and account protection status.</p>
              </div>
            </div>
          </AppCard>

          {settingGroups.map((group) => (
            <AppCard key={group.title} className="overflow-hidden dark:border-white/10 dark:bg-neutral-900">
              <div className="border-b border-neutral-200 p-5 dark:border-white/10">
                <h3 className="font-serif text-xl font-bold">{group.title}</h3>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{group.description}</p>
              </div>
              <div className="divide-y divide-neutral-200 dark:divide-white/10">
                {group.rows.map((row) => (
                  <div key={row.label} className="grid gap-3 p-5 sm:grid-cols-[220px_1fr_auto] sm:items-center">
                    <p className="text-sm font-bold">{row.label}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">{row.value}</p>
                    <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
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
