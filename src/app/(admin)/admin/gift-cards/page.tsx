"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Gift, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppConfirmationDialog } from "@/components/app/AppConfirmationDialog";
import { AppDialog } from "@/components/app/AppDialog";
import { AppPagination } from "@/components/app/AppPagination";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/hooks/use-api";
import type { CustomerGiftCard } from "@/types/customer";

type GiftCardForm = {
  code: string;
  name: string;
  initial_balance: string;
  balance: string;
  currency: string;
  status: string;
  expires_at: string;
};

const pageSize = 10;

const emptyForm: GiftCardForm = {
  code: "",
  name: "",
  initial_balance: "",
  balance: "",
  currency: "ILS",
  status: "active",
  expires_at: ""
};

function payload(form: GiftCardForm) {
  return {
    ...form,
    initial_balance: Number(form.initial_balance || 0),
    balance: form.balance ? Number(form.balance) : undefined,
    expires_at: form.expires_at || null
  };
}

export default function AdminGiftCardsPage() {
  const { request, token } = useApi();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CustomerGiftCard | null>(null);
  const [pendingDelete, setPendingDelete] = useState<CustomerGiftCard | null>(null);
  const [typed, setTyped] = useState("");
  const [form, setForm] = useState<GiftCardForm>(emptyForm);

  const cardsQuery = useQuery({
    queryKey: ["admin", "gift-cards"],
    enabled: Boolean(token),
    queryFn: () => request<CustomerGiftCard[]>("/admin/gift-cards")
  });
  const cards = useMemo(() => cardsQuery.data ?? [], [cardsQuery.data]);
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return cards.filter((card) => `${card.code} ${card.name} ${card.user?.name ?? ""} ${card.user?.email ?? ""}`.toLowerCase().includes(term));
  }, [cards, search]);
  const lastPage = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, lastPage);
  const paginated = useMemo(() => filtered.slice((safePage - 1) * pageSize, safePage * pageSize), [filtered, safePage]);

  const saveMutation = useMutation({
    mutationFn: (values: GiftCardForm) => request<CustomerGiftCard>(editing ? `/admin/gift-cards/${editing.id}` : "/admin/gift-cards", {
      method: editing ? "PATCH" : "POST",
      body: payload(values)
    }),
    onSuccess: () => {
      toast.success(editing ? "Gift card updated." : "Gift card created.");
      queryClient.invalidateQueries({ queryKey: ["admin", "gift-cards"] });
      closeDialog();
    },
    onError: (error: Error) => toast.error(error.message)
  });

  const deleteMutation = useMutation({
    mutationFn: (card: CustomerGiftCard) => request<null>(`/admin/gift-cards/${card.id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Gift card deleted.");
      queryClient.invalidateQueries({ queryKey: ["admin", "gift-cards"] });
      setPendingDelete(null);
      setTyped("");
    },
    onError: (error: Error) => toast.error(error.message)
  });

  const closeDialog = () => {
    setOpen(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const startEdit = (card: CustomerGiftCard) => {
    setEditing(card);
    setForm({
      code: card.code,
      name: card.name,
      initial_balance: String(card.initial_balance),
      balance: String(card.balance),
      currency: card.currency,
      status: card.status,
      expires_at: card.expires_at ? String(card.expires_at).slice(0, 10) : ""
    });
    setOpen(true);
  };

  const canSave = form.code.trim().length >= 4 && form.name.trim().length >= 2 && Number(form.initial_balance) >= 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">People</p>
          <h1 className="mt-2 font-serif text-3xl font-bold">Gift Cards</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Create gift cards and design credits customers can redeem.</p>
        </div>
        <AppButton className="gap-2" onClick={() => { setEditing(null); setForm(emptyForm); setOpen(true); }}><Plus className="size-4" /> Add Gift Card</AppButton>
      </div>

      <AppCard className="overflow-hidden">
        <div className="relative border-b border-neutral-200 p-4 dark:border-white/10">
          <Search className="pointer-events-none absolute left-7 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search code, name, or customer..." className="h-11 w-full rounded-md border border-neutral-300 bg-white px-9 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-white" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="border-b border-neutral-200 text-left dark:border-white/10">
              <tr className="text-xs uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">
                <th className="p-4">Card</th>
                <th className="p-4">Balance</th>
                <th className="p-4">Redeemed By</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((card) => (
                <tr key={card.id} className="border-b border-neutral-100 last:border-0 dark:border-white/10">
                  <td className="p-4"><p className="font-bold">{card.name}</p><p className="font-mono text-xs text-neutral-500 dark:text-neutral-400">{card.code}</p></td>
                  <td className="p-4 font-bold">{card.currency} {Number(card.balance).toLocaleString()}</td>
                  <td className="p-4 text-neutral-600 dark:text-neutral-400">{card.user?.email ?? "Not redeemed"}</td>
                  <td className="p-4"><Badge variant={card.status === "active" ? "default" : "secondary"}>{card.status}</Badge></td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <AppButton variant="outline" size="sm" className="gap-2" onClick={() => startEdit(card)}><Pencil className="size-4" /> Edit</AppButton>
                      <AppButton variant="outline" size="sm" className="gap-2" onClick={() => { setPendingDelete(card); setTyped(""); }}><Trash2 className="size-4" /> Delete</AppButton>
                    </div>
                  </td>
                </tr>
              ))}
              {!cardsQuery.isLoading && filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-12 text-center text-neutral-500 dark:text-neutral-400"><Gift className="mx-auto mb-2 size-6" />No gift cards found.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
        {!cardsQuery.isLoading ? (
          <AppPagination page={safePage} pageSize={pageSize} total={filtered.length} onPageChange={setPage} />
        ) : null}
      </AppCard>

      <AppDialog
        open={open}
        onOpenChange={(next) => (next ? setOpen(true) : closeDialog())}
        title={editing ? "Edit Gift Card" : "Add Gift Card"}
        description="Customers can redeem active cards from their Gift Cards page."
        footer={<><AppButton variant="outline" onClick={closeDialog}>Cancel</AppButton><AppButton loading={saveMutation.isPending} disabled={!canSave} onClick={() => saveMutation.mutate(form)}>Save Gift Card</AppButton></>}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <input value={form.code} onChange={(event) => setForm((current) => ({ ...current, code: event.target.value.toUpperCase() }))} placeholder="Code" className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-white" />
          <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Name" className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-white" />
          <input value={form.initial_balance} onChange={(event) => setForm((current) => ({ ...current, initial_balance: event.target.value }))} placeholder="Initial balance" className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-white" />
          <input value={form.balance} onChange={(event) => setForm((current) => ({ ...current, balance: event.target.value }))} placeholder="Current balance" className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-white" />
          <input value={form.currency} onChange={(event) => setForm((current) => ({ ...current, currency: event.target.value.toUpperCase() }))} placeholder="Currency" className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-white" />
          <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-white">
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="expired">Expired</option>
          </select>
          <input type="date" value={form.expires_at} onChange={(event) => setForm((current) => ({ ...current, expires_at: event.target.value }))} className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-white" />
        </div>
      </AppDialog>

      <AppConfirmationDialog
        open={Boolean(pendingDelete)}
        itemName={pendingDelete?.name ?? "this gift card"}
        typedValue={typed}
        onTypedValueChange={setTyped}
        onCancel={() => { setPendingDelete(null); setTyped(""); }}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete)}
      />
    </div>
  );
}
