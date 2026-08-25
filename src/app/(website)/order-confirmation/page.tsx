"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { AppButton } from "@/components/app/AppButton";
import { AppImage } from "@/components/app/AppImage";
import { AppSection } from "@/components/app/AppSection";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { formatMoney } from "@/lib/format";
import { useCustomerCommerceStore } from "@/stores/customer-commerce-store";

export default function OrderConfirmationPage() {
  const t = useTranslations("orderConfirmation");
  const cartCopy = useTranslations("cart");
  const locale = useLocale();
  const reference = useCustomerCommerceStore((state) => state.lastOrderReference);
  const items = useCustomerCommerceStore((state) => state.lastOrderItems);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AppSection className="max-w-xl text-center text-neutral-950 dark:text-neutral-50">
      <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm sm:p-8 dark:border-white/10 dark:bg-neutral-900">
        <span className="mx-auto grid size-20 place-items-center rounded-full bg-green-600 text-white">
          <SiteIcon name="check" className="size-10" />
        </span>
        <h1 className="mt-6 font-serif text-3xl font-bold sm:text-4xl">{t("title")}</h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{t("subtitle")}</p>
        <div className="mt-6 rounded-lg bg-neutral-50 p-5 dark:bg-neutral-950">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">{t("reference")}</p>
          <p className="mt-1 text-xl font-bold">{reference ?? t("empty")}</p>
          <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">{t("received")}</p>
          <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">{t("paymentNote")}</p>
        </div>
        {items.length > 0 ? (
          <div className="mt-6 text-start">
            <h2 className="font-serif text-xl font-bold">{t("summary")}</h2>
            <div className="mt-3 space-y-3">
              {items.map((item) => (
                <div key={item.slug} className="grid grid-cols-[72px_1fr_auto] items-center gap-3 border-b border-neutral-100 pb-3 last:border-0 dark:border-white/10">
                  <AppImage src={item.image} alt={item.name} className="aspect-square rounded-md" sizes="72px" />
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">{item.options?.size ?? t("standard")} / {item.options?.configuration ?? item.subcategory}</p>
                  </div>
                  <p className="font-bold">{formatMoney(item.price * item.quantity, locale)}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 flex justify-between border-t border-neutral-200 pt-4 font-bold dark:border-white/10"><span>{cartCopy("subtotal")}</span><span>{formatMoney(total, locale)}</span></p>
          </div>
        ) : null}
        <ol className="mt-6 grid gap-2 text-start text-sm">
          {(["confirmed", "payment", "production", "delivery"] as const).map((step, index) => (
            <li key={step} className="flex items-center gap-3 rounded-md border border-neutral-200 p-3 dark:border-white/10">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-neutral-100 text-xs font-bold dark:bg-white/10">{index + 1}</span>
              <span className={index === 0 ? "font-bold" : "text-neutral-600 dark:text-neutral-400"}>{t(`steps.${step}`)}</span>
            </li>
          ))}
        </ol>
        <div className="mt-6 grid gap-3">
          <Link href="/customer/orders" className="block"><AppButton className="w-full">{t("track")}</AppButton></Link>
          <Link href="/collections" className="block"><AppButton variant="outline" className="w-full">{t("continue")}</AppButton></Link>
        </div>
      </div>
    </AppSection>
  );
}
