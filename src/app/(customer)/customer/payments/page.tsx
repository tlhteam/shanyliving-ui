"use client";

import { CreditCard, Landmark, Plus } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("customer.payments");
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
    { successMessage: t("saved"), onSuccess: closeDialog }
  );

  const defaultMutation = useCustomerMutation<CustomerPaymentMethod, CustomerPaymentMethod>(
    "payment-methods",
    (method) => ({ path: `/customer/payment-methods/${method.id}`, options: { method: "PATCH", body: { is_default: true } } }),
    { successMessage: t("defaultUpdated") }
  );

  const deleteMutation = useCustomerMutation<CustomerPaymentMethod, null>(
    "payment-methods",
    (method) => ({ path: `/customer/payment-methods/${method.id}`, options: { method: "DELETE" } }),
    {
      successMessage: t("removed"),
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
      <CustomerTopbar title={t("title")} subtitle={t("subtitle")} />
      <div className="mb-5 flex justify-end">
        <AppButton className="gap-2" onClick={startCreate}><Plus className="size-4" /> {t("add")}</AppButton>
      </div>

      {methodsQuery.isLoading ? (
        <div className="grid gap-5 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => <div key={index} className="h-52 animate-pulse rounded-lg bg-neutral-200 dark:bg-white/10" />)}
        </div>
      ) : null}

      {!methodsQuery.isLoading && methods.length === 0 ? (
        <AppCard className="grid place-items-center gap-3 p-12 text-center">
          <CreditCard className="size-8 text-neutral-400" />
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{t("empty")}</p>
          <AppButton onClick={startCreate}>{t("add")}</AppButton>
        </AppCard>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        {methods.map((method) => {
          const Icon = method.type === "bank" ? Landmark : CreditCard;

          return (
            <AppCard key={method.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <Icon className="size-8" />
                {method.is_default ? <span className="rounded bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-950 dark:bg-white/15 dark:text-white">{t("default")}</span> : null}
              </div>
              <h2 className="mt-6 font-serif text-2xl font-bold">{method.holder || t("fallbackName", { brand: method.brand ?? method.type })}</h2>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400"><bdi>{t("ending", { brand: method.brand ?? method.type, last4: method.last4 ?? "" })}</bdi></p>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400"><bdi>{t("expires", { value: method.expires ?? t("verified") })}</bdi></p>
              <div className="mt-6 flex flex-wrap gap-3">
                <AppButton
                  variant={method.is_default ? "primary" : "outline"}
                  disabled={method.is_default || defaultMutation.isPending}
                  onClick={() => defaultMutation.mutate(method)}
                >
                  {t("default")}
                </AppButton>
                <AppButton variant="outline" onClick={() => startEdit(method)}>{t("edit")}</AppButton>
                <AppButton variant="outline" onClick={() => { setPendingDelete(method); setTyped(""); }}>{t("remove")}</AppButton>
              </div>
            </AppCard>
          );
        })}
      </div>

      <AppDialog
        open={open}
        onOpenChange={(next) => (next ? setOpen(true) : closeDialog())}
        title={editing ? t("editTitle") : t("addTitle")}
        description={t("dialogText")}
        footer={
          <>
            <AppButton variant="outline" onClick={closeDialog}>{t("cancel")}</AppButton>
            <AppButton
              loading={saveMutation.isPending}
              disabled={!form.last4.match(/^\d{4}$/)}
              onClick={() => saveMutation.mutate(form)}
            >
              {t("save")}
            </AppButton>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <select
            value={form.type}
            onChange={(event) => setForm((current) => ({ ...current, type: event.target.value as PaymentForm["type"] }))}
            className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:focus:border-white"
          >
            <option value="card">{t("card")}</option>
            <option value="bank">{t("bank")}</option>
          </select>
          <input value={form.brand} onChange={(event) => setForm((current) => ({ ...current, brand: event.target.value }))} placeholder={t("brand")} className="h-11 rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:focus:border-white" />
          <input value={form.holder} onChange={(event) => setForm((current) => ({ ...current, holder: event.target.value }))} placeholder={t("holder")} className="h-11 rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:focus:border-white" />
          <input value={form.last4} maxLength={4} onChange={(event) => setForm((current) => ({ ...current, last4: event.target.value.replace(/\D/g, "").slice(0, 4) }))} placeholder={t("last4")} className="h-11 rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:focus:border-white" />
          <input value={form.expires} onChange={(event) => setForm((current) => ({ ...current, expires: event.target.value }))} placeholder={t("expiryPlaceholder")} className="h-11 rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:focus:border-white" />
          <label className="flex h-11 items-center justify-between rounded-md border border-neutral-300 px-3 text-sm font-bold dark:border-white/15">
            {t("defaultMethod")}
            <AppSwitch checked={form.is_default} onClick={() => setForm((current) => ({ ...current, is_default: !current.is_default }))} />
          </label>
        </div>
      </AppDialog>

      <AppConfirmationDialog
        open={Boolean(pendingDelete)}
        itemName={pendingDelete?.holder ?? t("thisMethod")}
        typedValue={typed}
        onTypedValueChange={setTyped}
        onCancel={() => { setPendingDelete(null); setTyped(""); }}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete)}
      />
    </>
  );
}
