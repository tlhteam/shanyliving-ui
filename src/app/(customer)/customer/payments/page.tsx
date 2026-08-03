"use client";

import { CreditCard, Landmark, Plus } from "lucide-react";
import { useState } from "react";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppDialog } from "@/components/app/AppDialog";
import { CustomerTopbar } from "@/components/customer/CustomerShell";
import { paymentMethods } from "@/lib/customer-panel";

export default function PaymentsPage() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CustomerTopbar title="Cards & Bank" subtitle="Save cards and bank details for faster checkout and future orders." />
      <div className="mb-5 flex justify-end"><AppButton className="gap-2" onClick={() => setOpen(true)}><Plus className="size-4" /> Add Payment Method</AppButton></div>
      <div className="grid gap-5 md:grid-cols-2">
        {paymentMethods.map((method) => {
          const Icon = method.brand === "Bank" ? Landmark : CreditCard;
          return (
            <AppCard key={method.id} className="p-6">
              <Icon className="size-8" />
              <h2 className="mt-6 font-serif text-2xl font-bold">{method.label}</h2>
              <p className="mt-2 text-sm text-neutral-600">{method.brand} ending in {method.last4}</p>
              <p className="mt-1 text-sm text-neutral-600">Expires / Status: {method.expires}</p>
              <div className="mt-6 flex gap-3">
                <AppButton variant="outline">Edit</AppButton>
                <AppButton variant="outline">Remove</AppButton>
              </div>
            </AppCard>
          );
        })}
      </div>
      <AppDialog open={open} onOpenChange={setOpen} title="Add Payment Method" description="This form is ready for tokenized card or bank provider integration." footer={<><AppButton variant="outline" onClick={() => setOpen(false)}>Cancel</AppButton><AppButton onClick={() => setOpen(false)}>Save Method</AppButton></>}>
        <div className="grid gap-4 sm:grid-cols-2">
          {["Cardholder Name", "Card Number", "Expiry", "CVC", "Billing Address", "Bank Account"].map((field) => <input key={field} placeholder={field} className="h-11 rounded-md border border-neutral-300 px-3 text-sm" />)}
        </div>
      </AppDialog>
    </>
  );
}
