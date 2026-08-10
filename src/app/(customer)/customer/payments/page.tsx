"use client";

import { CreditCard, Landmark, Plus } from "lucide-react";
import { useState } from "react";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppConfirmationDialog } from "@/components/app/AppConfirmationDialog";
import { AppDialog } from "@/components/app/AppDialog";
import { AppSwitch } from "@/components/app/AppSwitch";
import { CustomerTopbar } from "@/components/customer/CustomerShell";
import { useCustomerMutation, useCustomerQuery } from "@/hooks/use-customer";
import type { CustomerPaymentMethod } from "@/types/customer";

type PaymentForm = {
  type: "card" | "bank";
  brand: string;
  holder: string;
  last4: string;
  expires: string;
  is_default: boolean;
};

const emptyForm: PaymentForm = {
  type: "card",
  brand: "",
  holder: "",
  last4: "",
  expires: "",
  is_default: false
};

export default function PaymentsPage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CustomerPaymentMethod | null>(null);
  const [pendingDelete, setPendingDelete] = useState<CustomerPaymentMethod | null>(null);
  const [typed, setTyped] = useState("");
  const [form, setForm] = useState<PaymentForm>(emptyForm);

  const methodsQuery = useCustomerQuery<CustomerPaymentMethod[]>("payment-methods", "/customer/payment-methods");
  const methods = methodsQuery.data ?? [];

  const closeDialog = () => {
    setOpen(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const saveMutation = useCustomerMutation<PaymentForm, CustomerPaymentMethod>(
    "payment-methods",
    (values) => ({
      path: editing ? `/customer/payment-methods/${editing.id}` : "/customer/payment-methods",
      options: { method: editing ? "PATCH" : "POST", body: values }
    }),
    { successMessage: "Payment method saved.", onSuccess: closeDialog }
  );

  const defaultMutation = useCustomerMutation<CustomerPaymentMethod, CustomerPaymentMethod>(
    "payment-methods",
    (method) => ({ path: `/customer/payment-methods/${method.id}`, options: { method: "PATCH", body: { is_default: true } } }),
    { successMessage: "Default payment method updated." }
  );

  const deleteMutation = useCustomerMutation<CustomerPaymentMethod, null>(
    "payment-methods",
    (method) => ({ path: `/customer/payment-methods/${method.id}`, options: { method: "DELETE" } }),
    {
      successMessage: "Payment method removed.",
      onSuccess: () => {
        setPendingDelete(null);
        setTyped("");
      }
    }
  );

  const startCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const startEdit = (method: CustomerPaymentMethod) => {
    setEditing(method);
    setForm({
      type: method.type === "bank" ? "bank" : "card",
      brand: method.brand ?? "",
      holder: method.holder ?? "",
      last4: method.last4 ?? "",
      expires: method.expires ?? "",
      is_default: method.is_default
    });
    setOpen(true);
  };

  return (
    <>
      <CustomerTopbar title="Cards & Bank" subtitle="Save cards and bank details for faster checkout and future orders." />
      <div className="mb-5 flex justify-end">
        <AppButton className="gap-2" onClick={startCreate}><Plus className="size-4" /> Add Payment Method</AppButton>
      </div>

      {methodsQuery.isLoading ? (
        <div className="grid gap-5 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => <div key={index} className="h-52 animate-pulse rounded-lg bg-neutral-200" />)}
        </div>
      ) : null}

      {!methodsQuery.isLoading && methods.length === 0 ? (
        <AppCard className="grid place-items-center gap-3 p-12 text-center">
          <CreditCard className="size-8 text-neutral-400" />
          <p className="text-sm text-neutral-600">No payment methods saved yet.</p>
          <AppButton onClick={startCreate}>Add Payment Method</AppButton>
        </AppCard>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        {methods.map((method) => {
          const Icon = method.type === "bank" ? Landmark : CreditCard;

          return (
            <AppCard key={method.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <Icon className="size-8" />
                {method.is_default ? <span className="rounded bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-950 dark:bg-white/15 dark:text-white">Default</span> : null}
              </div>
              <h2 className="mt-6 font-serif text-2xl font-bold">{method.holder || `${method.brand ?? method.type} method`}</h2>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{method.brand ?? method.type} ending in {method.last4}</p>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Expires / Status: {method.expires ?? "Verified"}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <AppButton
                  variant={method.is_default ? "primary" : "outline"}
                  disabled={method.is_default || defaultMutation.isPending}
                  onClick={() => defaultMutation.mutate(method)}
                >
                  Default
                </AppButton>
                <AppButton variant="outline" onClick={() => startEdit(method)}>Edit</AppButton>
                <AppButton variant="outline" onClick={() => { setPendingDelete(method); setTyped(""); }}>Remove</AppButton>
              </div>
            </AppCard>
          );
        })}
      </div>

      <AppDialog
        open={open}
        onOpenChange={(next) => (next ? setOpen(true) : closeDialog())}
        title={editing ? "Edit Payment Method" : "Add Payment Method"}
        description="Save card or bank details for future orders."
        footer={
          <>
            <AppButton variant="outline" onClick={closeDialog}>Cancel</AppButton>
            <AppButton
              loading={saveMutation.isPending}
              disabled={!form.last4.match(/^\d{4}$/)}
              onClick={() => saveMutation.mutate(form)}
            >
              Save Method
            </AppButton>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <select
            value={form.type}
            onChange={(event) => setForm((current) => ({ ...current, type: event.target.value as PaymentForm["type"] }))}
            className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950"
          >
            <option value="card">Card</option>
            <option value="bank">Bank</option>
          </select>
          <input value={form.brand} onChange={(event) => setForm((current) => ({ ...current, brand: event.target.value }))} placeholder="Brand" className="h-11 rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-950" />
          <input value={form.holder} onChange={(event) => setForm((current) => ({ ...current, holder: event.target.value }))} placeholder="Holder Name" className="h-11 rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-950" />
          <input value={form.last4} maxLength={4} onChange={(event) => setForm((current) => ({ ...current, last4: event.target.value.replace(/\D/g, "").slice(0, 4) }))} placeholder="Last 4 digits" className="h-11 rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-950" />
          <input value={form.expires} onChange={(event) => setForm((current) => ({ ...current, expires: event.target.value }))} placeholder="Expiry or status" className="h-11 rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-950" />
          <label className="flex h-11 items-center justify-between rounded-md border border-neutral-300 px-3 text-sm font-bold">
            Default method
            <AppSwitch checked={form.is_default} onClick={() => setForm((current) => ({ ...current, is_default: !current.is_default }))} />
          </label>
        </div>
      </AppDialog>

      <AppConfirmationDialog
        open={Boolean(pendingDelete)}
        itemName={pendingDelete?.holder ?? "this payment method"}
        typedValue={typed}
        onTypedValueChange={setTyped}
        onCancel={() => { setPendingDelete(null); setTyped(""); }}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete)}
      />
    </>
  );
}
