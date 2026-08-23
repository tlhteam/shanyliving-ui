"use client";

import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { ChevronRight, Heart, Mail, Package, Sofa } from "lucide-react";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppImage } from "@/components/app/AppImage";
import { useCustomerQuery } from "@/hooks/use-customer";
import type { CustomerDashboard, CustomerOrder, CustomerOrderItem, CustomerProfile } from "@/types/customer";

const steps = ["confirmed", "production", "quality", "ship"] as const;

export default function CustomerDashboardPage() {
  const t = useTranslations("customer.dashboard");
  const format = useFormatter();
  const dashboardQuery = useCustomerQuery<CustomerDashboard>("dashboard", "/customer/dashboard");
  const profileQuery = useCustomerQuery<CustomerProfile>("profile", "/customer/profile");
  const dashboard = dashboardQuery.data;
  const activeOrder = dashboard?.active_order;
  const activeItem = activeOrder?.items?.[0];

  const itemTitle = (item?: CustomerOrderItem, order?: CustomerOrder | null) =>
    item?.product_name ??
    item?.title ??
    item?.name ??
    (order ? t("orderTitle", { reference: order.reference }) : t("noOrderTitle"));

  const stats = [
    { key: "activeOrders", value: dashboard?.summary.active_orders ?? 0, icon: Package, href: "/customer/orders" },
    { key: "savedDesigns", value: dashboard?.summary.saved_designs ?? 0, icon: Sofa, href: "/customer/saved-designs" },
    { key: "wishlist", value: dashboard?.summary.wishlist ?? 0, icon: Heart, href: "/customer/wishlist" },
    { key: "messages", value: dashboard?.summary.messages ?? 0, icon: Mail, href: "/customer/messages" }
  ] as const;

  return (
    <>
      <div className="mb-7">
        <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">{t("welcome")}</p>
        <h1 className="font-serif text-3xl font-bold sm:text-4xl">{profileQuery.data?.name ?? t("fallbackName")}</h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{t("intro")}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.key} href={stat.href}>
            <AppCard className="p-5 transition duration-300 hover:shadow-lg sm:hover:-translate-y-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-neutral-600 dark:text-neutral-400">{t(stat.key)}</p>
                  <p className="mt-2 text-3xl font-bold">{dashboardQuery.isLoading ? "-" : stat.value}</p>
                </div>
                <span className="grid size-10 place-items-center rounded-full bg-neutral-100 dark:bg-white/10">
                  <stat.icon className="size-5" />
                </span>
              </div>
              <p className="mt-4 flex items-center justify-between text-xs text-neutral-700 dark:text-neutral-300">
                {t(`${stat.key}Text`)}
                <ChevronRight className="size-4 rtl:rotate-180" />
              </p>
            </AppCard>
          </Link>
        ))}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <AppCard className="p-5">
          <h2 className="font-bold">{t("activeOrder")}</h2>
          {activeOrder ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-[180px_1fr]">
              <AppImage src={activeItem?.image ?? null} alt={itemTitle(activeItem, activeOrder)} className="aspect-[1.45/1] rounded-lg" sizes="180px" />
              <div>
                <h3 className="font-serif text-xl font-bold sm:text-2xl">{itemTitle(activeItem, activeOrder)}</h3>
                <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                  <bdi>{t("orderLine", { reference: activeOrder.reference })}</bdi> · {activeOrder.status}
                </p>
                <div className="mt-5 grid grid-cols-4 gap-2 text-center text-[11px]">
                  {steps.map((step, index) => (
                    <div key={step}>
                      <span
                        className={
                          index < 2
                            ? "mx-auto grid size-7 place-items-center rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950"
                            : "mx-auto grid size-7 place-items-center rounded-full border border-neutral-300 bg-white dark:border-white/15 dark:bg-neutral-900"
                        }
                      >
                        {index < 2 ? "OK" : ""}
                      </span>
                      <p className="mt-2 font-semibold">{t(`steps.${step}`)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-bold">
                    {t("placed")}
                    <br />
                    <span className="text-neutral-600 dark:text-neutral-400">
                      {activeOrder.placed_at ? format.dateTime(new Date(activeOrder.placed_at), { dateStyle: "medium" }) : t("pending")}
                    </span>
                  </p>
                  <Link href="/customer/orders">
                    <AppButton size="sm">{t("viewOrder")}</AppButton>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">{t("noOrder")}</p>
          )}
        </AppCard>
        <AppCard className="p-5">
          <h2 className="font-bold">{t("recentMessages")}</h2>
          <div className="mt-4 space-y-4">
            {(dashboard?.recent_messages ?? []).slice(0, 2).map((message) => (
              <div key={message.id} className="flex items-center gap-3">
                <div className="size-11 shrink-0 rounded-full bg-neutral-200 dark:bg-white/10" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{message.name ?? message.title ?? t("teamName")}</p>
                  <p className="truncate text-sm text-neutral-600 dark:text-neutral-400">{message.message}</p>
                </div>
                <span className="shrink-0 text-xs text-neutral-500 dark:text-neutral-400">{message.time}</span>
              </div>
            ))}
            {!dashboardQuery.isLoading && (dashboard?.recent_messages ?? []).length === 0 ? (
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{t("noMessages")}</p>
            ) : null}
          </div>
          <Link href="/customer/messages" className="block">
            <AppButton className="mt-5 w-full" size="sm">{t("goToMessages")}</AppButton>
          </Link>
        </AppCard>
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <AppCard className="p-5">
          <h2 className="font-bold">{t("mySavedDesigns")}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {(dashboard?.saved_designs ?? []).slice(0, 3).map((design) => (
              <Link key={design.id} href="/customer/saved-designs" className="group">
                <AppImage
                  src={design.image ?? null}
                  alt={design.title}
                  className="aspect-[1.5/1] rounded-lg"
                  sizes="220px"
                  imageClassName="transition duration-500 group-hover:scale-[1.04]"
                />
                <p className="mt-2 text-sm font-bold">{design.title}</p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">{design.fabric}</p>
              </Link>
            ))}
            {!dashboardQuery.isLoading && (dashboard?.saved_designs ?? []).length === 0 ? (
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{t("noDesigns")}</p>
            ) : null}
          </div>
          <Link href="/customize-your-sofa" className="block">
            <AppButton className="mt-5 w-full sm:w-auto">{t("continueCustomizing")}</AppButton>
          </Link>
        </AppCard>
        <AppCard className="p-5">
          <h2 className="font-bold">{t("quickLinks")}</h2>
          <div className="mt-4 grid gap-3">
            <Link href="/customer/wishlist" className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 text-sm font-bold dark:border-white/10">
              {t("wishlist")} <ChevronRight className="size-4 rtl:rotate-180" />
            </Link>
            <Link href="/customer/gift-cards" className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 text-sm font-bold dark:border-white/10">
              {t("giftCards")} <ChevronRight className="size-4 rtl:rotate-180" />
            </Link>
            <Link href="/customer/payments" className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 text-sm font-bold dark:border-white/10">
              {t("payments")} <ChevronRight className="size-4 rtl:rotate-180" />
            </Link>
          </div>
        </AppCard>
      </div>
      <div className="mt-6 flex flex-col gap-3 text-sm font-semibold text-neutral-700 sm:flex-row sm:items-center sm:justify-between dark:text-neutral-300">
        <span>{t("needHelp")}</span>
        <span>{t("whatsapp")}</span>
        <span>{t("call")}</span>
      </div>
    </>
  );
}
