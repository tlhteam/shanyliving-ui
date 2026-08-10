"use client";

import { useState } from "react";
import { Home, Plus, Truck } from "lucide-react";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppConfirmationDialog } from "@/components/app/AppConfirmationDialog";
import { AppDialog } from "@/components/app/AppDialog";
import { CustomerTopbar } from "@/components/customer/CustomerShell";
import { useCustomerMutation, useCustomerQuery } from "@/hooks/use-customer";
import type { CustomerAddress } from "@/types/customer";

type AddressForm = {
  label: string;
  line1: string;
  city: string;
  country: string;
  phone: string;
  postcode: string;
};

const emptyForm: AddressForm = { label: "", line1: "", city: "", country: "Israel", phone: "", postcode: "" };

const fields: Array<{ key: keyof AddressForm; placeholder: string }> = [
  { key: "label", placeholder: "Label" },
  { key: "line1", placeholder: "Street" },
  { key: "city", placeholder: "City" },
  { key: "country", placeholder: "Country" },
  { key: "phone", placeholder: "Phone" },
  { key: "postcode", placeholder: "Postal Code" }
];

export default function AddressesPage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CustomerAddress | null>(null);
  const [form, setForm] = useState<AddressForm>(emptyForm);
  const [pendingDelete, setPendingDelete] = useState<CustomerAddress | null>(null);
  const [typed, setTyped] = useState("");

  const addressesQuery = useCustomerQuery<CustomerAddress[]>("addresses", "/customer/addresses");
  const addresses = addressesQuery.data ?? [];

  const closeDialog = () => {
    setOpen(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const saveMutation = useCustomerMutation<AddressForm, CustomerAddress>(
    "addresses",
    (values) => ({
      path: editing ? `/customer/addresses/${editing.id}` : "/customer/addresses",
      options: { method: editing ? "PATCH" : "POST", body: values }
    }),
    { successMessage: "Address saved.", onSuccess: closeDialog }
  );

  const defaultMutation = useCustomerMutation<CustomerAddress, CustomerAddress>(
    "addresses",
    (address) => ({ path: `/customer/addresses/${address.id}`, options: { method: "PATCH", body: { is_default: true } } }),
    { successMessage: "Default address updated." }
  );

  const deleteMutation = useCustomerMutation<CustomerAddress, null>(
    "addresses",
    (address) => ({ path: `/customer/addresses/${address.id}`, options: { method: "DELETE" } }),
    {
      successMessage: "Address deleted.",
      onSuccess: () => {
        setPendingDelete(null);
        setTyped("");
      }
    }
  );

  const startEdit = (address: CustomerAddress) => {
    setEditing(address);
    setForm({
      label: address.label ?? "",
      line1: address.line1,
      city: address.city,
      country: address.country ?? "Israel",
      phone: address.phone ?? "",
      postcode: address.postcode ?? ""
    });
    setOpen(true);
  };

  return (
    <>
      <CustomerTopbar title="My Addresses" subtitle="Manage your saved addresses for a faster and smoother checkout experience." />
      <div className="mb-5 flex justify-end">
        <AppButton className="gap-2" onClick={() => { setEditing(null); setForm(emptyForm); setOpen(true); }}>
          <Plus className="size-4" /> Add New Address
        </AppButton>
      </div>

      {addressesQuery.isLoading ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => <div key={index} className="h-64 animate-pulse rounded-lg bg-neutral-200" />)}
        </div>
      ) : null}

      {!addressesQuery.isLoading && addresses.length === 0 ? (
        <AppCard className="grid place-items-center gap-3 p-12 text-center">
          <Home className="size-8 text-neutral-400" />
          <p className="text-sm text-neutral-600">No saved addresses yet.</p>
          <AppButton onClick={() => setOpen(true)}>Add New Address</AppButton>
        </AppCard>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2">
        {addresses.map((address) => (
          <AppCard key={address.id} className="p-8">
            {address.is_default ? <span className="rounded bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-950 dark:bg-white/15 dark:text-white">Default</span> : null}
            <div className="mt-5 flex items-start gap-3">
              <Home className="size-6 stroke-[1.5]" />
              <div>
                <h2 className="font-serif text-2xl font-bold">{address.label}</h2>
                <p className="mt-3 text-sm leading-6 text-neutral-700">
                  {address.line1}<br />
                  {[address.city, address.postcode].filter(Boolean).join(" ")}<br />
                  {address.country}<br />
                  {address.phone ? `Tel: ${address.phone}` : null}
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 sm:justify-end">
              <AppButton
                variant={address.is_default ? "primary" : "outline"}
                disabled={address.is_default || defaultMutation.isPending}
                onClick={() => defaultMutation.mutate(address)}
              >
                Default Address
              </AppButton>
              <AppButton variant="outline" onClick={() => startEdit(address)}>Edit</AppButton>
              <AppButton variant="outline" onClick={() => { setPendingDelete(address); setTyped(""); }}>Delete</AppButton>
            </div>
          </AppCard>
        ))}
      </div>

      <AppCard className="mt-5 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid size-12 place-items-center rounded-full bg-neutral-100"><Truck className="size-6" /></span>
          <div>
            <p className="font-bold">Shipping Made Easy</p>
            <p className="text-sm text-neutral-600">Add and manage delivery addresses to make checkout faster.</p>
          </div>
        </div>
        <AppButton variant="outline">Learn more about delivery</AppButton>
      </AppCard>

      <AppDialog
        open={open}
        onOpenChange={(next) => (next ? setOpen(true) : closeDialog())}
        title={editing ? "Edit Address" : "Add Address"}
        description="Save a delivery address for future orders."
        footer={
          <>
            <AppButton variant="outline" onClick={closeDialog}>Cancel</AppButton>
            <AppButton
              loading={saveMutation.isPending}
              disabled={!form.line1.trim() || !form.city.trim()}
              onClick={() => saveMutation.mutate(form)}
            >
              Save Address
            </AppButton>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <input
              key={field.key}
              value={form[field.key]}
              onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
              placeholder={field.placeholder}
              className="h-11 rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-950"
            />
          ))}
        </div>
      </AppDialog>

      <AppConfirmationDialog
        open={Boolean(pendingDelete)}
        itemName={pendingDelete?.label ?? "this address"}
        typedValue={typed}
        onTypedValueChange={setTyped}
        onCancel={() => { setPendingDelete(null); setTyped(""); }}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete)}
      />
    </>
  );
}
