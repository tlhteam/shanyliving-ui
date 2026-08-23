"use client";

import Link from "next/link";
import { Headphones, Plus, Sofa } from "lucide-react";
import { useMemo, useState } from "react";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppConfirmationDialog } from "@/components/app/AppConfirmationDialog";
import { AppDialog } from "@/components/app/AppDialog";
import { AppImage } from "@/components/app/AppImage";
import { CustomerTopbar } from "@/components/customer/CustomerShell";
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

const statusLabels: Record<string, string> = {
  in_progress: "In Progress",
  requested: "Requested",
  consulted: "Consulted",
  ordered: "Ordered"
};

const fields: Array<{ key: keyof DesignForm; placeholder: string }> = [
  { key: "title", placeholder: "Design name" },
  { key: "configuration", placeholder: "Configuration" },
  { key: "fabric", placeholder: "Fabric" },
  { key: "size", placeholder: "Size" },
  { key: "extras", placeholder: "Extras" },
  { key: "image", placeholder: "Image URL" },
  { key: "price", placeholder: "Estimated price" },
  { key: "notes", placeholder: "Notes" }
];

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
    { successMessage: "Design saved.", onSuccess: closeDialog }
  );

  const consultationMutation = useCustomerMutation<CustomerSavedDesign, CustomerSavedDesign>(
    "saved-designs",
    (design) => ({ path: `/customer/saved-designs/${design.id}`, options: { method: "PATCH", body: { status: "requested" } } }),
    { successMessage: "Consultation requested." }
  );

  const deleteMutation = useCustomerMutation<CustomerSavedDesign, null>(
    "saved-designs",
    (design) => ({ path: `/customer/saved-designs/${design.id}`, options: { method: "DELETE" } }),
    {
      successMessage: "Design deleted.",
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
      <CustomerTopbar title="My Saved Designs" subtitle="Your custom sofa designs are saved here. Continue editing, share, or request a consultation." />
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-6 text-sm font-bold">
          <span className="border-b-2 border-black pb-2">All Designs ({designs.length})</span>
          {Object.entries(statusLabels).map(([status, label]) => (
            <span key={status} className="pb-2 text-neutral-500">{label} ({designs.filter((design) => design.status === status).length})</span>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search design name..." className="h-10 rounded-md border border-neutral-300 px-3 text-sm lg:w-72" />
          <AppButton className="gap-2" onClick={startCreate}><Plus className="size-4" /> Add Design</AppButton>
        </div>
      </div>

      {designsQuery.isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-40 animate-pulse rounded-lg bg-neutral-200" />)}
        </div>
      ) : null}

      {!designsQuery.isLoading && filteredDesigns.length === 0 ? (
        <AppCard className="grid place-items-center gap-3 p-12 text-center">
          <Sofa className="size-8 text-neutral-400" />
          <p className="text-sm text-neutral-600">No saved designs found.</p>
          <AppButton onClick={startCreate}>Add Design</AppButton>
        </AppCard>
      ) : null}

      <div className="space-y-4">
        {filteredDesigns.map((design) => (
          <AppCard key={design.id} className="grid gap-4 p-4 lg:grid-cols-[240px_1fr_180px] lg:items-center">
            <AppImage src={design.image ?? null} alt={design.title} className="aspect-[1.6/1] rounded-lg" sizes="240px" />
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-serif text-2xl font-bold">{design.title}</h2>
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-950 dark:bg-white/15 dark:text-white">{statusLabels[design.status] ?? design.status}</span>
              </div>
              <p className="mt-1 text-xs text-neutral-600">Saved design #{design.reference}</p>
              <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-4">
                <div><dt className="font-bold">Configuration</dt><dd>{configurationSummary(design)}</dd></div>
                <div><dt className="font-bold">Fabric</dt><dd>{design.fabric ?? "-"}</dd></div>
                <div><dt className="font-bold">Size</dt><dd>{design.size ?? "-"}</dd></div>
                <div><dt className="font-bold">Extras</dt><dd>{design.extras ?? "-"}</dd></div>
              </dl>
            </div>
            <div className="space-y-2">
              <Link href={`/customize-your-sofa?design=${design.id}`}><AppButton className="w-full" size="sm">Continue Editing</AppButton></Link>
              <AppButton variant="outline" className="w-full" size="sm" onClick={() => setViewing(design)}>View Design</AppButton>
              <AppButton variant="outline" className="w-full" size="sm" loading={consultationMutation.isPending} onClick={() => consultationMutation.mutate(design)}>Request Consultation</AppButton>
              <AppButton variant="outline" className="w-full" size="sm" onClick={() => startEdit(design)}>Edit Design</AppButton>
              <AppButton variant="outline" className="w-full" size="sm" onClick={() => { setPendingDelete(design); setTyped(""); }}>Delete</AppButton>
            </div>
          </AppCard>
        ))}
      </div>

      <AppCard className="mt-5 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3"><Headphones className="size-8" /><div><p className="font-bold">Need help with your design?</p><p className="text-sm text-neutral-600">Our consultants are here to help you create the perfect sofa.</p></div></div>
        <Link href="/showroom"><AppButton>Book a Consultation</AppButton></Link>
      </AppCard>

      <AppDialog
        open={open}
        onOpenChange={(next) => (next ? setOpen(true) : closeDialog())}
        title={editing ? "Edit Design" : "Add Design"}
        description="Save a custom design to your account."
        footer={
          <>
            <AppButton variant="outline" onClick={closeDialog}>Cancel</AppButton>
            <AppButton loading={saveMutation.isPending} disabled={!form.title.trim()} onClick={() => saveMutation.mutate(form)}>Save Design</AppButton>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <select
            value={form.status}
            onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as DesignForm["status"] }))}
            className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950"
          >
            {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
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

      <AppDialog
        open={Boolean(viewing)}
        onOpenChange={(next) => !next && setViewing(null)}
        title={viewing?.title ?? "Saved Design"}
        description={viewing ? `Saved design #${viewing.reference}` : undefined}
        footer={
          viewing ? (
            <>
              <AppButton variant="outline" onClick={() => setViewing(null)}>Close</AppButton>
              <Link href={`/customize-your-sofa?design=${viewing.id}`}>
                <AppButton>Open Editor</AppButton>
              </Link>
            </>
          ) : null
        }
      >
        {viewing ? (
          <div className="space-y-5">
            <AppImage src={viewing.image ?? null} alt={viewing.title} className="aspect-[1.7/1] rounded-lg" sizes="560px" />
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div><dt className="font-bold">Status</dt><dd>{statusLabels[viewing.status] ?? viewing.status}</dd></div>
              <div><dt className="font-bold">Configuration</dt><dd>{configurationSummary(viewing)}</dd></div>
              <div><dt className="font-bold">Fabric</dt><dd>{viewing.fabric ?? "-"}</dd></div>
              <div><dt className="font-bold">Size</dt><dd>{viewing.size ?? "-"}</dd></div>
              <div><dt className="font-bold">Extras</dt><dd>{viewing.extras ?? "-"}</dd></div>
              <div><dt className="font-bold">Price</dt><dd>{viewing.price ? `₪ ${Number(viewing.price).toLocaleString()}` : "-"}</dd></div>
            </dl>
            {viewing.notes ? <p className="rounded-md bg-neutral-100 p-3 text-sm text-neutral-700 dark:bg-white/10 dark:text-neutral-200">{viewing.notes}</p> : null}
          </div>
        ) : null}
      </AppDialog>

      <AppConfirmationDialog
        open={Boolean(pendingDelete)}
        itemName={pendingDelete?.title ?? "this design"}
        typedValue={typed}
        onTypedValueChange={setTyped}
        onCancel={() => { setPendingDelete(null); setTyped(""); }}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete)}
      />
    </>
  );
}
