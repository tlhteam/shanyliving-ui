"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormatter, useTranslations } from "next-intl";
import { Pencil, Plus, Search, Trash2, UserCog } from "lucide-react";
import { toast } from "sonner";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppConfirmationDialog } from "@/components/app/AppConfirmationDialog";
import { AppDialog } from "@/components/app/AppDialog";
import { AppPagination } from "@/components/app/AppPagination";
import { AppPasswordInput } from "@/components/app/AppPasswordInput";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/hooks/use-api";
import type { AdminUserAccount } from "@/types/customer";

type UserForm = {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: "admin" | "customer";
  password: string;
};

const pageSize = 10;

const emptyForm: UserForm = { name: "", email: "", phone: "", avatar: "", role: "customer", password: "" };

export default function AdminUsersPage() {
  const t = useTranslations("adminPanel.users");
  const format = useFormatter();
  const { request, token } = useApi();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [role, setRole] = useState<"all" | "admin" | "customer">("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUserAccount | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminUserAccount | null>(null);
  const [typed, setTyped] = useState("");
  const [form, setForm] = useState<UserForm>(emptyForm);

  const usersQuery = useQuery({
    queryKey: ["admin", "users", search, role],
    enabled: Boolean(token),
    queryFn: () => request<AdminUserAccount[]>("/admin/users", { query: { search, role: role === "all" ? undefined : role } })
  });

  const users = useMemo(() => usersQuery.data ?? [], [usersQuery.data]);
  const lastPage = Math.max(1, Math.ceil(users.length / pageSize));
  const safePage = Math.min(page, lastPage);
  const paginated = useMemo(() => users.slice((safePage - 1) * pageSize, safePage * pageSize), [users, safePage]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    }, 250);

    return () => window.clearTimeout(timer);
  }, [queryClient, search, role]);

  const saveMutation = useMutation({
    mutationFn: (values: UserForm) => request<AdminUserAccount>(editing ? `/admin/users/${editing.id}` : "/admin/users", {
      method: editing ? "PATCH" : "POST",
      body: {
        ...values,
        password: values.password || undefined
      }
    }),
    onSuccess: () => {
      toast.success(editing ? t("updated") : t("createdToast"));
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      closeDialog();
    },
    onError: (error: Error) => toast.error(error.message)
  });

  const deleteMutation = useMutation({
    mutationFn: (user: AdminUserAccount) => request<null>(`/admin/users/${user.id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success(t("deleted"));
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
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

  const startCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const startEdit = (user: AdminUserAccount) => {
    setEditing(user);
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone ?? "",
      avatar: user.avatar ?? "",
      role: user.role,
      password: ""
    });
    setOpen(true);
  };

  const canSave = form.name.trim().length >= 2 && form.email.includes("@") && (editing || form.password.length >= 8);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">{t("eyebrow")}</p>
          <h1 className="mt-2 font-serif text-3xl font-bold">{t("title")}</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{t("subtitle")}</p>
        </div>
        <AppButton className="gap-2" onClick={startCreate}><Plus className="size-4" /> {t("add")}</AppButton>
      </div>

      <AppCard className="overflow-hidden">
        <div className="grid gap-3 border-b border-neutral-200 p-4 dark:border-white/10 lg:grid-cols-[1fr_180px]">
          <div className="relative">
            <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
            <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder={t("search")} className="h-11 w-full rounded-md border border-neutral-300 bg-white px-9 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-white" />
          </div>
          <select value={role} onChange={(event) => setRole(event.target.value as typeof role)} className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-white">
            <option value="all">{t("allRoles")}</option>
            <option value="admin">{t("admins")}</option>
            <option value="customer">{t("customers")}</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-sm">
            <thead className="border-b border-neutral-200 text-start dark:border-white/10">
              <tr className="text-xs uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">
                <th className="p-4">{t("user")}</th>
                <th className="p-4">{t("role")}</th>
                <th className="p-4">{t("phone")}</th>
                <th className="p-4">{t("created")}</th>
                <th className="p-4 text-end">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((user) => (
                <tr key={user.id} className="border-b border-neutral-100 last:border-0 dark:border-white/10">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-900 dark:bg-neutral-800 dark:text-white">
                        {user.avatar ? <span className="sr-only">{t("avatar")}</span> : user.name.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-bold">{user.name}</span>
                        <span className="block truncate text-xs text-neutral-500 dark:text-neutral-400">{user.email}</span>
                      </span>
                    </div>
                  </td>
                  <td className="p-4"><Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge></td>
                  <td className="p-4 text-neutral-600 dark:text-neutral-400">{user.phone ?? t("notSet")}</td>
                  <td className="p-4 text-neutral-600 dark:text-neutral-400">{user.created_at ? format.dateTime(new Date(user.created_at), { dateStyle: "medium" }) : t("notSet")}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <AppButton variant="outline" size="sm" className="gap-2" onClick={() => startEdit(user)}><Pencil className="size-4" /> {t("edit")}</AppButton>
                      <AppButton variant="outline" size="sm" className="gap-2" onClick={() => { setPendingDelete(user); setTyped(""); }}><Trash2 className="size-4" /> {t("delete")}</AppButton>
                    </div>
                  </td>
                </tr>
              ))}
              {!usersQuery.isLoading && paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-neutral-500 dark:text-neutral-400">
                    <UserCog className="mx-auto mb-2 size-6" />
                    {t("empty")}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      
        {!usersQuery.isLoading ? (
          <AppPagination page={safePage} pageSize={pageSize} total={users.length} onPageChange={setPage} />
        ) : null}
      </AppCard>

      <AppDialog
        open={open}
        onOpenChange={(next) => (next ? setOpen(true) : closeDialog())}
        title={editing ? t("editTitle") : t("addTitle")}
        description={t("dialogText")}
        footer={
          <>
            <AppButton variant="outline" onClick={closeDialog}>{t("cancel")}</AppButton>
            <AppButton loading={saveMutation.isPending} disabled={!canSave} onClick={() => saveMutation.mutate(form)}>{editing ? t("saveChanges") : t("create")}</AppButton>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder={t("name")} className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-white" />
          <input value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder={t("email")} className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-white" />
          <input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} placeholder={t("phone")} className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-white" />
          <input value={form.avatar} onChange={(event) => setForm((current) => ({ ...current, avatar: event.target.value }))} placeholder={t("avatarUrl")} className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-white" />
          <select value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value as UserForm["role"] }))} className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-white">
            <option value="customer">{t("customer")}</option>
            <option value="admin">{t("admin")}</option>
          </select>
          <AppPasswordInput value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} placeholder={editing ? t("passwordOptional") : t("password")} className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-white" />
        </div>
      </AppDialog>

      <AppConfirmationDialog
        open={Boolean(pendingDelete)}
        itemName={pendingDelete?.name ?? t("thisUser")}
        typedValue={typed}
        onTypedValueChange={setTyped}
        onCancel={() => { setPendingDelete(null); setTyped(""); }}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete)}
      />
    </div>
  );
}
