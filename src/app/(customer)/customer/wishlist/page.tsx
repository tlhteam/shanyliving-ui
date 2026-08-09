"use client";

import { Heart, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppDialog } from "@/components/app/AppDialog";
import { AppImage } from "@/components/app/AppImage";
import { CustomerTopbar } from "@/components/customer/CustomerShell";
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
      successMessage: "Added to your wishlist.",
      onSuccess: () => {
        setOpen(false);
        setForm(emptyForm);
      }
    }
  );

  const removeMutation = useCustomerMutation<CustomerWishlistItem, null>(
    "wishlist",
    (item) => ({ path: `/customer/wishlist/${item.id}`, options: { method: "DELETE" } }),
    { successMessage: "Removed from your wishlist." }
  );

  return (
    <>
      <CustomerTopbar title="Wishlist" subtitle="Your favorite pieces, all in one place. Add items to your wishlist and save them for later." />
      <div className="mb-5 flex flex-wrap justify-end gap-3">
        <AppButton variant="outline">Share Wishlist</AppButton>
        <AppButton variant="outline" className="gap-2" onClick={() => setOpen(true)}><Plus className="size-4" /> Add Item</AppButton>
        <AppButton className="gap-2"><ShoppingBag className="size-4" /> Add All to Cart</AppButton>
      </div>

      {wishlistQuery.isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-72 animate-pulse rounded-lg bg-neutral-200" />)}
        </div>
      ) : null}

      {!wishlistQuery.isLoading && items.length === 0 ? (
        <AppCard className="grid place-items-center gap-3 p-12 text-center">
          <Heart className="size-8 text-neutral-400" />
          <p className="text-sm text-neutral-600">Your wishlist is empty. Save pieces you love while you browse.</p>
          <AppButton onClick={() => setOpen(true)}>Add Item</AppButton>
        </AppCard>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <AppCard key={item.id} className="overflow-hidden p-0">
            <div className="relative">
              <AppImage src={item.image ?? "/images/sofa-cloud-modular.png"} alt={item.title} className="aspect-[1.15/1]" sizes="25vw" />
              <button
                type="button"
                aria-label={`Remove ${item.title} from wishlist`}
                disabled={removeMutation.isPending}
                onClick={() => removeMutation.mutate(item)}
                className="absolute end-3 top-3 grid size-8 place-items-center rounded-full bg-white/80 transition hover:bg-white disabled:opacity-50"
              >
                <Heart className="size-4 fill-current" />
              </button>
            </div>
            <div className="p-4">
              <p className="font-bold">{item.title}</p>
              <p className="mt-1 text-xs text-neutral-600">{item.note ?? "Saved item"}</p>
              <p className="mt-2 font-bold">ILS {new Intl.NumberFormat("en").format(Number(item.price ?? 0))}</p>
              <AppButton variant="outline" className="mt-4 w-full" size="sm">View Details</AppButton>
            </div>
          </AppCard>
        ))}
      </div>

      <AppDialog
        open={open}
        onOpenChange={setOpen}
        title="Add Wishlist Item"
        description="Save a product or custom item to your wishlist."
        footer={
          <>
            <AppButton variant="outline" onClick={() => setOpen(false)}>Cancel</AppButton>
            <AppButton loading={addMutation.isPending} disabled={!form.title.trim()} onClick={() => addMutation.mutate(form)}>Save Item</AppButton>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="Item name" className="h-11 rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-950" />
          <input value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} placeholder="Price" className="h-11 rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-950" />
          <input value={form.image} onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))} placeholder="Image URL" className="h-11 rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-950" />
          <input value={form.note} onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))} placeholder="Note" className="h-11 rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-950" />
        </div>
      </AppDialog>
    </>
  );
}
