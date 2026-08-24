"use client";

import Link from "next/link";
import { Headphones, Plus, Sofa } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppConfirmationDialog } from "@/components/app/AppConfirmationDialog";
import { AppDialog } from "@/components/app/AppDialog";
import { AppImage } from "@/components/app/AppImage";
import { CustomerTopbar } from "@/components/customer/CustomerShell";
import { formatMoney } from "@/lib/format";
import { whatsappHref } from "@/lib/whatsapp";
import { useCustomerMutation, useCustomerQuery } from "@/hooks/use-customer";
import type { CustomerSavedDesign } from "@/types/customer";

type DesignForm = {
  title: string;
  status: "in_progress" | "requested" | "consulted" | "ordered";
  configuration: string;
  fabric: string;
  size: string;
  extras: string;
  image: string;
  price: string;
  notes: string;
};

const emptyForm: DesignForm = {
  title: "",
  status: "in_progress",
  configuration: "",
  fabric: "",
  size: "",
  extras: "",
  image: "",
  price: "",
  notes: ""
};

const statuses = ["in_progress", "requested", "consulted", "ordered"] as const;

const fields: Array<keyof DesignForm> = ["title", "configuration", "fabric", "size", "extras", "image", "price", "notes"];

function toPayload(form: DesignForm) {
  return {
    ...form,
    price: form.price ? Number(form.price) : null
  };
}

function configurationSummary(design: CustomerSavedDesign) {
  if (!design.configuration) {
    return "-";
  }

  try {
    const parsed = JSON.parse(design.configuration) as { product?: string; modules?: unknown[]; roomSize?: string; style?: string; color?: string; leg?: string };
    return [parsed.product, parsed.modules ? `${parsed.modules.length} modules` : null, parsed.roomSize, parsed.style, parsed.color, parsed.leg].filter(Boolean).join(" / ");
  } catch {
    return design.configuration;
  }
}

export default function SavedDesignsPage() {
  const t = useTranslations("customer.savedDesigns");
  const common = useTranslations("common");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CustomerSavedDesign | null>(null);
  const [viewing, setViewing] = useState<CustomerSavedDesign | null>(null);
  const [pendingDelete, setPendingDelete] = useState<CustomerSavedDesign | null>(null);
  const [typed, setTyped] = useState("");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<DesignForm>(emptyForm);

  const designsQuery = useCustomerQuery<CustomerSavedDesign[]>("saved-designs", "/customer/saved-designs");
  const designs = useMemo(() => designsQuery.data ?? [], [designsQuery.data]);
  const filteredDesigns = useMemo(
    () => designs.filter((design) => design.title.toLowerCase().includes(search.trim().toLowerCase())),
    [designs, search]
  );

  const closeDialog = () => {
    setOpen(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const saveMutation = useCustomerMutation<DesignForm, CustomerSavedDesign>(
    "saved-designs",
    (values) => ({
      path: editing ? `/customer/saved-designs/${editing.id}` : "/customer/saved-designs",
      options: { method: editing ? "PATCH" : "POST", body: toPayload(values) }
    }),
    { successMessage: t("saved"), onSuccess: closeDialog }
  );

  const consultationMutation = useCustomerMutation<CustomerSavedDesign, CustomerSavedDesign>(
    "saved-designs",
    (design) => ({ path: `/customer/saved-designs/${design.id}`, options: { method: "PATCH", body: { status: "requested" } } }),
    { successMessage: t("consultRequested") }
  );

  const deleteMutation = useCustomerMutation<CustomerSavedDesign, null>(
    "saved-designs",
    (design) => ({ path: `/customer/saved-designs/${design.id}`, options: { method: "DELETE" } }),
    {
      successMessage: t("deleted"),
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

  const startEdit = (design: CustomerSavedDesign) => {
    setEditing(design);
    setForm({
      title: design.title,
      status: (design.status as DesignForm["status"]) || "in_progress",
      configuration: design.configuration ?? "",
      fabric: design.fabric ?? "",
      size: design.size ?? "",
      extras: design.extras ?? "",
      image: design.image ?? "",
      price: design.price ? String(design.price) : "",
      notes: design.notes ?? ""
    });
    setOpen(true);
  };

  return (
    <>
      <CustomerTopbar title={t("title")} subtitle={t("subtitle")} />
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-6 text-sm font-bold">
          <span className="border-b-2 border-neutral-950 pb-2 dark:border-white">{t("all", { count: designs.length })}</span>
          {statuses.map((status) => (
            <span key={status} className="pb-2 text-neutral-500 dark:text-neutral-400">
              {t("tab", { label: t(`statuses.${status}`), count: designs.filter((design) => design.status === status).length })}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("search")} className="h-10 rounded-md border border-neutral-300 px-3 text-sm lg:w-72 dark:border-white/15 dark:bg-neutral-950" />
          <AppButton className="gap-2" onClick={startCreate}><Plus className="size-4" /> {t("add")}</AppButton>
        </div>
      </div>

      {designsQuery.isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-40 animate-pulse rounded-lg bg-neutral-200 dark:bg-white/10" />)}
        </div>
      ) : null}

      {!designsQuery.isLoading && filteredDesigns.length === 0 ? (
        <AppCard className="grid place-items-center gap-3 p-12 text-center">
          <Sofa className="size-8 text-neutral-400" />
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{t("empty")}</p>
          <AppButton onClick={startCreate}>{t("add")}</AppButton>
        </AppCard>
      ) : null}

      <div className="space-y-4">
        {filteredDesigns.map((design) => (
          <AppCard key={design.id} className="grid gap-4 p-4 lg:grid-cols-[240px_1fr_180px] lg:items-center">
            <AppImage src={design.image ?? null} alt={design.title} className="aspect-[1.6/1] rounded-lg" sizes="240px" />
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-serif text-2xl font-bold">{design.title}</h2>
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-950 dark:bg-white/15 dark:text-white">{t.has(`statuses.${design.status}`) ? t(`statuses.${design.status}`) : design.status}</span>
              </div>
              <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">{t("reference", { reference: design.reference })}</p>
              <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-4">
                <div><dt className="font-bold">{t("configuration")}</dt><dd>{configurationSummary(design)}</dd></div>
                <div><dt className="font-bold">{t("fabric")}</dt><dd>{design.fabric ?? "-"}</dd></div>
                <div><dt className="font-bold">{t("size")}</dt><dd>{design.size ?? "-"}</dd></div>
                <div><dt className="font-bold">{t("extras")}</dt><dd>{design.extras ?? "-"}</dd></div>
              </dl>
            </div>
            <div className="space-y-2">
              <Link href={`/customize-your-sofa?design=${design.id}`}><AppButton className="w-full" size="sm">{t("continueEditing")}</AppButton></Link>
              <AppButton variant="outline" className="w-full" size="sm" onClick={() => setViewing(design)}>{t("view")}</AppButton>
              <AppButton variant="outline" className="w-full" size="sm" loading={consultationMutation.isPending} onClick={() => consultationMutation.mutate(design)}>{t("consult")}</AppButton>
              <AppButton variant="outline" className="w-full" size="sm" onClick={() => startEdit(design)}>{t("edit")}</AppButton>
              <AppButton variant="outline" className="w-full" size="sm" onClick={() => { setPendingDelete(design); setTyped(""); }}>{t("delete")}</AppButton>
            </div>
          </AppCard>
        ))}
      </div>

      <AppCard className="mt-5 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3"><Headphones className="size-8" /><div><p className="font-bold">{t("helpTitle")}</p><p className="text-sm text-neutral-600 dark:text-neutral-400">{t("helpText")}</p></div></div>
        <Link href={whatsappHref(common("whatsappDesignMessage"))} target="_blank" rel="noreferrer noopener" className="block"><AppButton className="w-full sm:w-auto">{t("helpCta")}</AppButton></Link>
      </AppCard>

      <AppDialog
        open={open}
        onOpenChange={(next) => (next ? setOpen(true) : closeDialog())}
        title={editing ? t("editTitle") : t("addTitle")}
        description={t("dialogText")}
        footer={
          <>
            <AppButton variant="outline" onClick={closeDialog}>{t("cancel")}</AppButton>
            <AppButton loading={saveMutation.isPending} disabled={!form.title.trim()} onClick={() => saveMutation.mutate(form)}>{t("save")}</AppButton>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <select
            value={form.status}
            onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as DesignForm["status"] }))}
            className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:focus:border-white"
          >
            {statuses.map((value) => <option key={value} value={value}>{t(`statuses.${value}`)}</option>)}
          </select>
          {fields.map((field) => (
            <input
              key={field}
              value={form[field]}
              onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
              placeholder={t(`fields.${field}`)}
              className="h-11 rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:focus:border-white"
            />
          ))}
        </div>
      </AppDialog>

      <AppDialog
        open={Boolean(viewing)}
        onOpenChange={(next) => !next && setViewing(null)}
        title={viewing?.title ?? t("viewFallback")}
        description={viewing ? t("reference", { reference: viewing.reference }) : undefined}
        footer={
          viewing ? (
            <>
              <AppButton variant="outline" onClick={() => setViewing(null)}>{t("close")}</AppButton>
              <Link href={`/customize-your-sofa?design=${viewing.id}`}>
                <AppButton>{t("openEditor")}</AppButton>
              </Link>
            </>
          ) : null
        }
      >
        {viewing ? (
          <div className="space-y-5">
            <AppImage src={viewing.image ?? null} alt={viewing.title} className="aspect-[1.7/1] rounded-lg" sizes="560px" />
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div><dt className="font-bold">{t("status")}</dt><dd>{t.has(`statuses.${viewing.status}`) ? t(`statuses.${viewing.status}`) : viewing.status}</dd></div>
              <div><dt className="font-bold">{t("configuration")}</dt><dd>{configurationSummary(viewing)}</dd></div>
              <div><dt className="font-bold">{t("fabric")}</dt><dd>{viewing.fabric ?? "-"}</dd></div>
              <div><dt className="font-bold">{t("size")}</dt><dd>{viewing.size ?? "-"}</dd></div>
              <div><dt className="font-bold">{t("extras")}</dt><dd>{viewing.extras ?? "-"}</dd></div>
              <div><dt className="font-bold">{t("price")}</dt><dd>{viewing.price ? formatMoney(Number(viewing.price), locale) : "-"}</dd></div>
            </dl>
            {viewing.notes ? <p className="rounded-md bg-neutral-100 p-3 text-sm text-neutral-700 dark:bg-white/10 dark:text-neutral-200">{viewing.notes}</p> : null}
          </div>
        ) : null}
      </AppDialog>

      <AppConfirmationDialog
        open={Boolean(pendingDelete)}
        itemName={pendingDelete?.title ?? t("thisDesign")}
        typedValue={typed}
        onTypedValueChange={setTyped}
        onCancel={() => { setPendingDelete(null); setTyped(""); }}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete)}
      />
    </>
  );
}
