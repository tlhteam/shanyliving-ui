"use client";

import { Heart, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppDialog } from "@/components/app/AppDialog";
import { AppImage } from "@/components/app/AppImage";
import { CustomerTopbar } from "@/components/customer/CustomerShell";
import { formatMoney } from "@/lib/format";
import { useCustomerMutation, useCustomerQuery } from "@/hooks/use-customer";
import type { CustomerWishlistItem } from "@/types/customer";

type WishlistForm = {
  title: string;
  price: string;
  image: string;
  note: string;
};

const emptyForm: WishlistForm = { title: "", price: "", image: "", note: "" };

export default function WishlistPage() {
  const t = useTranslations("customer.wishlist");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<WishlistForm>(emptyForm);
  const wishlistQuery = useCustomerQuery<CustomerWishlistItem[]>("wishlist", "/customer/wishlist");
  const items = wishlistQuery.data ?? [];

  const addMutation = useCustomerMutation<WishlistForm, CustomerWishlistItem>(
    "wishlist",
    (values) => ({
      path: "/customer/wishlist",
      options: { method: "POST", body: { ...values, price: values.price ? Number(values.price) : null } }
    }),
    {
      successMessage: t("added"),
      onSuccess: () => {
        setOpen(false);
        setForm(emptyForm);
      }
    }
  );

  const removeMutation = useCustomerMutation<CustomerWishlistItem, null>(
    "wishlist",
    (item) => ({ path: `/customer/wishlist/${item.id}`, options: { method: "DELETE" } }),
    { successMessage: t("removed") }
  );

  return (
    <>
      <CustomerTopbar title={t("title")} subtitle={t("subtitle")} />
      <div className="mb-5 flex flex-wrap justify-end gap-3">
        <AppButton variant="outline">{t("share")}</AppButton>
        <AppButton variant="outline" className="gap-2" onClick={() => setOpen(true)}><Plus className="size-4" /> {t("add")}</AppButton>
        <AppButton className="gap-2"><ShoppingBag className="size-4" /> {t("addAll")}</AppButton>
      </div>

      {wishlistQuery.isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-72 animate-pulse rounded-lg bg-neutral-200 dark:bg-white/10" />)}
        </div>
      ) : null}

      {!wishlistQuery.isLoading && items.length === 0 ? (
        <AppCard className="grid place-items-center gap-3 p-12 text-center">
          <Heart className="size-8 text-neutral-400" />
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{t("empty")}</p>
          <AppButton onClick={() => setOpen(true)}>{t("add")}</AppButton>
        </AppCard>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <AppCard key={item.id} className="overflow-hidden p-0">
            <div className="relative">
              <AppImage src={item.image ?? null} alt={item.title} className="aspect-[1.15/1]" sizes="25vw" />
              <button
                type="button"
                aria-label={t("removeLabel", { title: item.title })}
                disabled={removeMutation.isPending}
                onClick={() => removeMutation.mutate(item)}
                className="absolute end-3 top-3 grid size-8 place-items-center rounded-full bg-white/80 transition hover:bg-white disabled:opacity-50"
              >
                <Heart className="size-4 fill-current" />
              </button>
            </div>
            <div className="p-4">
              <p className="font-bold">{item.title}</p>
              <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">{item.note ?? t("savedItem")}</p>
              <p className="mt-2 font-bold">{formatMoney(Number(item.price ?? 0), locale)}</p>
              <AppButton variant="outline" className="mt-4 w-full" size="sm">{t("view")}</AppButton>
            </div>
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
            <AppButton loading={addMutation.isPending} disabled={!form.title.trim()} onClick={() => addMutation.mutate(form)}>{t("save")}</AppButton>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder={t("name")} className="h-11 rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:focus:border-white" />
          <input value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} placeholder={t("price")} className="h-11 rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:focus:border-white" />
          <input value={form.image} onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))} placeholder={t("image")} className="h-11 rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:focus:border-white" />
          <input value={form.note} onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))} placeholder={t("note")} className="h-11 rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:focus:border-white" />
        </div>
      </AppDialog>
    </>
  );
}
