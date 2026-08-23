"use client";

import { Gift, Plus } from "lucide-react";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppDialog } from "@/components/app/AppDialog";
import { CustomerTopbar } from "@/components/customer/CustomerShell";
import { formatMoney } from "@/lib/format";
import { useCustomerMutation, useCustomerQuery } from "@/hooks/use-customer";
import type { CustomerGiftCard } from "@/types/customer";

export default function GiftCardsPage() {
  const t = useTranslations("customer.giftCards");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");

  const cardsQuery = useCustomerQuery<CustomerGiftCard[]>("gift-cards", "/customer/gift-cards");
  const cards = cardsQuery.data ?? [];

  const redeemMutation = useCustomerMutation<{ code: string }, CustomerGiftCard>(
    "gift-cards",
    (values) => ({ path: "/customer/gift-cards/redeem", options: { method: "POST", body: values } }),
    {
      successMessage: t("redeemed"),
      onSuccess: () => {
        setOpen(false);
        setCode("");
      }
    }
  );

  return (
    <>
      <CustomerTopbar title={t("title")} subtitle={t("subtitle")} />
      <div className="mb-5 flex justify-end">
        <AppButton className="gap-2" onClick={() => setOpen(true)}><Plus className="size-4" /> {t("add")}</AppButton>
      </div>

      {cardsQuery.isLoading ? (
        <div className="grid gap-5 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => <div key={index} className="h-56 animate-pulse rounded-lg bg-neutral-200 dark:bg-white/10" />)}
        </div>
      ) : null}

      {!cardsQuery.isLoading && cards.length === 0 ? (
        <AppCard className="grid place-items-center gap-3 p-12 text-center">
          <Gift className="size-8 text-neutral-400" />
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{t("empty")}</p>
          <AppButton onClick={() => setOpen(true)}>{t("add")}</AppButton>
        </AppCard>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        {cards.map((card) => (
          <AppCard key={card.id} className="relative overflow-hidden p-6">
            <div className="absolute end-0 top-0 size-36 rounded-bl-full bg-amber-100 dark:bg-amber-500/20" />
            <Gift className="relative size-9" />
            <h2 className="relative mt-6 font-serif text-3xl font-bold">{card.name}</h2>
            <p className="relative mt-1 text-xs font-bold text-neutral-500 dark:text-neutral-400"><bdi>{card.code}</bdi></p>
            <p className="relative mt-2 text-sm text-neutral-600 dark:text-neutral-400">{t("balance")}</p>
            <p className="relative text-3xl font-bold">{formatMoney(Number(card.balance), locale)}</p>
            <span className="relative mt-5 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-amber-600 dark:text-white">{card.status}</span>
          </AppCard>
        ))}
      </div>

      <AppDialog
        open={open}
        onOpenChange={setOpen}
        title={t("dialogTitle")}
        description={t("dialogText")}
        footer={
          <>
            <AppButton variant="outline" onClick={() => setOpen(false)}>{t("cancel")}</AppButton>
            <AppButton loading={redeemMutation.isPending} disabled={!code.trim()} onClick={() => redeemMutation.mutate({ code })}>{t("save")}</AppButton>
          </>
        }
      >
        <input value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder={t("codePlaceholder")} className="h-11 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:focus:border-white" />
      </AppDialog>
    </>
  );
}
