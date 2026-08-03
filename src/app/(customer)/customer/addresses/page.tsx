"use client";

import { useState } from "react";
import { Home, Plus, Truck } from "lucide-react";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppConfirmationDialog } from "@/components/app/AppConfirmationDialog";
import { AppDialog } from "@/components/app/AppDialog";
import { CustomerTopbar } from "@/components/customer/CustomerShell";
import { addresses } from "@/lib/customer-panel";

export default function AddressesPage() {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [typed, setTyped] = useState("");

  return (
    <>
      <CustomerTopbar title="My Addresses" subtitle="Manage your saved addresses for a faster and smoother checkout experience." />
      <div className="mb-5 flex justify-end">
        <AppButton className="gap-2" onClick={() => setOpen(true)}><Plus className="size-4" /> Add New Address</AppButton>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {addresses.map((address) => (
          <AppCard key={address.id} className="p-8">
            {address.isDefault ? <span className="rounded bg-neutral-100 px-3 py-1 text-xs font-bold">Default</span> : null}
            <div className="mt-5 flex items-start gap-3">
              <Home className="size-6 stroke-[1.5]" />
              <div>
                <h2 className="font-serif text-2xl font-bold">{address.label}</h2>
                <p className="mt-3 text-sm leading-6 text-neutral-700">{address.line}<br />{address.city}<br />{address.country}<br />Tel: {address.phone}</p>
              </div>
            </div>
            <div className="mt-8 flex gap-3 sm:justify-end">
              <AppButton variant={address.isDefault ? "primary" : "outline"}>Default Address</AppButton>
              <AppButton variant="outline" onClick={() => setConfirmOpen(true)}>Delete</AppButton>
            </div>
          </AppCard>
        ))}
      </div>
      <AppCard className="mt-5 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4"><span className="grid size-12 place-items-center rounded-full bg-neutral-100"><Truck className="size-6" /></span><div><p className="font-bold">Shipping Made Easy</p><p className="text-sm text-neutral-600">Add and manage delivery addresses to make checkout faster.</p></div></div>
        <AppButton variant="outline">Learn more about delivery</AppButton>
      </AppCard>
      <AppDialog open={open} onOpenChange={setOpen} title="Add Address" description="Save a delivery address for future orders." footer={<><AppButton variant="outline" onClick={() => setOpen(false)}>Cancel</AppButton><AppButton onClick={() => setOpen(false)}>Save Address</AppButton></>}>
        <div className="grid gap-4 sm:grid-cols-2">
          {["Label", "Street", "City", "Country", "Phone", "Postal Code"].map((field) => <input key={field} placeholder={field} className="h-11 rounded-md border border-neutral-300 px-3 text-sm" />)}
        </div>
      </AppDialog>
      <AppConfirmationDialog open={confirmOpen} itemName="this address" typedValue={typed} onTypedValueChange={setTyped} onCancel={() => setConfirmOpen(false)} onConfirm={() => setConfirmOpen(false)} />
    </>
  );
}
