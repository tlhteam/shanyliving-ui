"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Search, Trash2, UserCog } from "lucide-react";
import { toast } from "sonner";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppConfirmationDialog } from "@/components/app/AppConfirmationDialog";
import { AppDialog } from "@/components/app/AppDialog";
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

const emptyForm: UserForm = { name: "", email: "", phone: "", avatar: "", role: "customer", password: "" };

export default function AdminUsersPage() {
  const { request, token } = useApi();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
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
      toast.success(editing ? "User updated." : "User created.");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      closeDialog();
    },
    onError: (error: Error) => toast.error(error.message)
  });

  const deleteMutation = useMutation({
    mutationFn: (user: AdminUserAccount) => request<null>(`/admin/users/${user.id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("User deleted.");
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
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">People</p>
          <h1 className="mt-2 font-serif text-3xl font-bold">Accounts</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Manage customer and admin user accounts.</p>
        </div>
        <AppButton className="gap-2" onClick={startCreate}><Plus className="size-4" /> Add User</AppButton>
      </div>

      <AppCard className="overflow-hidden">
        <div className="grid gap-3 border-b border-neutral-200 p-4 dark:border-white/10 lg:grid-cols-[1fr_180px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or email..." className="h-11 w-full rounded-md border border-neutral-300 bg-white px-9 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-white" />
          </div>
          <select value={role} onChange={(event) => setRole(event.target.value as typeof role)} className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-white">
            <option value="all">All roles</option>
            <option value="admin">Admins</option>
            <option value="customer">Customers</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-sm">
            <thead className="border-b border-neutral-200 text-left dark:border-white/10">
              <tr className="text-xs uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Created</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-neutral-100 last:border-0 dark:border-white/10">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-900 dark:bg-neutral-800 dark:text-white">
                        {user.avatar ? <span className="sr-only">Avatar</span> : user.name.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-bold">{user.name}</span>
                        <span className="block truncate text-xs text-neutral-500 dark:text-neutral-400">{user.email}</span>
                      </span>
                    </div>
                  </td>
                  <td className="p-4"><Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge></td>
                  <td className="p-4 text-neutral-600 dark:text-neutral-400">{user.phone ?? "Not set"}</td>
                  <td className="p-4 text-neutral-600 dark:text-neutral-400">{user.created_at ? new Date(user.created_at).toLocaleDateString() : "Not set"}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <AppButton variant="outline" size="sm" className="gap-2" onClick={() => startEdit(user)}><Pencil className="size-4" /> Edit</AppButton>
                      <AppButton variant="outline" size="sm" className="gap-2" onClick={() => { setPendingDelete(user); setTyped(""); }}><Trash2 className="size-4" /> Delete</AppButton>
                    </div>
                  </td>
                </tr>
              ))}
              {!usersQuery.isLoading && users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-neutral-500 dark:text-neutral-400">
                    <UserCog className="mx-auto mb-2 size-6" />
                    No accounts found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </AppCard>

      <AppDialog
        open={open}
        onOpenChange={(next) => (next ? setOpen(true) : closeDialog())}
        title={editing ? "Edit User" : "Add User"}
        description="Create customer or admin accounts for panel access."
        footer={
          <>
            <AppButton variant="outline" onClick={closeDialog}>Cancel</AppButton>
            <AppButton loading={saveMutation.isPending} disabled={!canSave} onClick={() => saveMutation.mutate(form)}>{editing ? "Save Changes" : "Create User"}</AppButton>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Full name" className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-white" />
          <input value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="Email" className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-white" />
          <input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} placeholder="Phone" className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-white" />
          <input value={form.avatar} onChange={(event) => setForm((current) => ({ ...current, avatar: event.target.value }))} placeholder="Avatar URL" className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-white" />
          <select value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value as UserForm["role"] }))} className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-white">
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
          <input value={form.password} type="password" onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} placeholder={editing ? "New password optional" : "Password"} className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-white" />
        </div>
      </AppDialog>

      <AppConfirmationDialog
        open={Boolean(pendingDelete)}
        itemName={pendingDelete?.name ?? "this user"}
        typedValue={typed}
        onTypedValueChange={setTyped}
        onCancel={() => { setPendingDelete(null); setTyped(""); }}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete)}
      />
    </div>
  );
}
