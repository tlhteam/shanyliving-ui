"use client";

import { Gift, Plus } from "lucide-react";
import { useState } from "react";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppDialog } from "@/components/app/AppDialog";
import { CustomerTopbar } from "@/components/customer/CustomerShell";
import { giftCards } from "@/lib/customer-panel";

export default function GiftCardsPage() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CustomerTopbar title="Gift Cards" subtitle="Manage gift cards and design credits. Functionality is prepared for the next release." />
      <div className="mb-5 flex justify-end"><AppButton className="gap-2" onClick={() => setOpen(true)}><Plus className="size-4" /> Add Gift Card</AppButton></div>
      <div className="grid gap-5 md:grid-cols-2">
        {giftCards.map((card) => (
          <AppCard key={card.id} className="relative overflow-hidden p-6">
            <div className="absolute end-0 top-0 size-36 rounded-bl-full bg-amber-100" />
            <Gift className="relative size-9" />
            <h2 className="relative mt-6 font-serif text-3xl font-bold">{card.name}</h2>
            <p className="relative mt-2 text-sm text-neutral-600">Balance</p>
            <p className="relative text-3xl font-bold">₪ {card.balance}</p>
            <span className="relative mt-5 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">{card.status}</span>
          </AppCard>
        ))}
      </div>
      <AppDialog open={open} onOpenChange={setOpen} title="Add Gift Card" description="Gift cards are UI-ready and will be connected to checkout later." footer={<><AppButton variant="outline" onClick={() => setOpen(false)}>Cancel</AppButton><AppButton onClick={() => setOpen(false)}>Save Gift Card</AppButton></>}>
        <input placeholder="Gift card code" className="h-11 w-full rounded-md border border-neutral-300 px-3 text-sm" />
      </AppDialog>
    </>
  );
}
