"use client";

import { useEffect, useMemo } from "react";
import type { CellContext, ColumnDef } from "@tanstack/react-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Path, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Eye, Pencil, RefreshCcw, Trash2 } from "lucide-react";
import { AppConfirmationDialog } from "@/components/app/AppConfirmationDialog";
import { AppDialog } from "@/components/app/AppDialog";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppForm } from "@/components/app/AppForm";
import { AppPagination } from "@/components/app/AppPagination";
import { AppSearch } from "@/components/app/AppSearch";
import { AppTable } from "@/components/app/AppTable";
import { AppTextField } from "@/components/app/AppTextField";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AdminRow } from "@/lib/admin-data";
import { useAdminCrudStore } from "@/stores/admin-crud-store";

type AdminResourcePageProps = {
  eyebrow: string;
  title: string;
  description: string;
  action: string;
  rows: AdminRow[];
  columns: { key: string; label: string; badge?: boolean; swatch?: boolean }[];
};

type AdminFormValues = Record<string, string>;

function rowKey(row: AdminRow) {
  return String(row.id ?? row.reference ?? row.event ?? row.setting ?? row.name);
}

function createEmptyRow(columns: AdminResourcePageProps["columns"]) {
  return columns.reduce<AdminRow>((draft, column) => {
    draft[column.key] = "";
    return draft;
  }, {});
}

function rowToFormValues(row: AdminRow) {
  return Object.fromEntries(Object.entries(row).map(([key, value]) => [key, String(value)]));
}

function statusVariant(value: string | number): "default" | "secondary" | "destructive" {
  const text = String(value).toLowerCase();

  if (text.includes("active") || text.includes("booked") || text.includes("sent") || text.includes("yes")) {
    return "default";
  }

  if (text.includes("draft") || text.includes("pending") || text.includes("required") || text.includes("needs")) {
    return "destructive";
  }

  return "secondary";
}

export function AdminResourcePage({ eyebrow, title, description, action, rows, columns }: AdminResourcePageProps) {
  const queryClient = useQueryClient();
  const form = useForm<AdminFormValues>({ defaultValues: {} });
  const queryKey = useMemo(() => ["admin-resource", title], [title]);
  const { query, page, pageSize, mode, selected, draft, confirmText, setQuery, setPage, openCreate, openView, openEdit, openDelete, setConfirmText, close } = useAdminCrudStore();
  const { data = rows, isFetching } = useQuery({
    queryKey,
    queryFn: async () => rows,
    initialData: rows
  });

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return data;
    }

    return data.filter((row) => Object.values(row).some((value) => String(value).toLowerCase().includes(normalizedQuery)));
  }, [data, query]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const paginatedRows = filteredRows.slice((safePage - 1) * pageSize, safePage * pageSize);

  useEffect(() => {
    if (mode === "create" || mode === "edit") {
      form.reset(rowToFormValues(draft));
    }
  }, [draft, form, mode]);

  const saveMutation = useMutation({
    mutationFn: async (payload: AdminRow) => payload,
    onSuccess: (payload) => {
      queryClient.setQueryData<AdminRow[]>(queryKey, (current = rows) => {
        const payloadKey = rowKey(payload);
        const exists = current.some((row) => rowKey(row) === payloadKey);

        return exists ? current.map((row) => rowKey(row) === payloadKey ? payload : row) : [payload, ...current];
      });
      toast.success(`${title} saved`);
      close();
    },
    onError: () => toast.error(`Unable to save ${title.toLowerCase()}`)
  });

  const deleteMutation = useMutation({
    mutationFn: async (payload: AdminRow) => payload,
    onSuccess: (payload) => {
      queryClient.setQueryData<AdminRow[]>(queryKey, (current = rows) => current.filter((row) => rowKey(row) !== rowKey(payload)));
      toast.success(`${title} deleted`);
      close();
    },
    onError: () => toast.error(`Unable to delete ${title.toLowerCase()}`)
  });

  const tableColumns = useMemo<ColumnDef<AdminRow>[]>(() => [
    ...columns.map((column) => ({
      accessorKey: column.key,
      header: column.label,
      cell: ({ row }: CellContext<AdminRow, unknown>) => {
        const value = row.original[column.key];

        if (column.swatch) {
          return (
            <div className="flex items-center gap-2">
              <span className="size-5 rounded-full border border-neutral-300" style={{ backgroundColor: String(value) }} />
              <span className="font-mono text-xs">{String(value)}</span>
            </div>
          );
        }

        if (column.badge) {
          return <Badge variant={statusVariant(value)}>{String(value)}</Badge>;
        }

        return <span className="font-medium">{String(value)}</span>;
      }
    })),
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => {
            openView(row.original);
            toast.info(`${title} details opened`);
          }}>
            <Eye className="size-3.5" />
            View
          </Button>
          <Button variant="ghost" size="sm" onClick={() => openEdit(row.original)}>
            <Pencil className="size-3.5" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => openDelete(row.original)}>
            <Trash2 className="size-3.5" />
            Delete
          </Button>
        </div>
      )
    }
  ], [columns, openDelete, openEdit, openView, title]);

  const handleSave = (values: AdminFormValues) => {
    const fallbackKey = rowKey(selected ?? values);
    const payload: AdminRow = { ...values };

    if (!payload.id && !payload.reference && !payload.event && !payload.setting) {
      payload.id = `${title.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-5)}`;
    }

    if (selected && !payload.id && !payload.reference && !payload.event && !payload.setting) {
      payload.id = fallbackKey;
    }

    saveMutation.mutate(payload);
  };

  const formColumns = columns.filter((column) => column.key !== "actions");
  const selectedName = selected ? String(selected.name ?? selected.id ?? selected.reference ?? selected.event ?? selected.setting ?? "this record") : "this record";

  return (
    <>
      <AdminPageHeader eyebrow={eyebrow} title={title} description={description} action={action} onAction={() => openCreate(createEmptyRow(columns))} />
      <AppCard className="overflow-hidden dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50">
        <div className="grid gap-4 border-b border-neutral-200 p-4 dark:border-white/10 lg:grid-cols-[1fr_320px] lg:items-center">
          <div>
            <h2 className="font-bold">{title} List</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{filteredRows.length} of {data.length} records ready for management</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <AppSearch onSearch={setQuery} placeholder={`Search ${title.toLowerCase()}...`} />
            <Button variant="outline" onClick={() => {
              queryClient.invalidateQueries({ queryKey });
              toast.success(`${title} data refreshed`);
            }}>
              <RefreshCcw className="size-4" />
              Refresh
            </Button>
          </div>
        </div>
        <AppTable data={paginatedRows} columns={tableColumns} emptyMessage={isFetching ? "Loading records..." : "No matching records found."} />
        <AppPagination page={safePage} pageSize={pageSize} total={filteredRows.length} onPageChange={setPage} />
      </AppCard>

      <AppDialog
        open={mode === "view"}
        onOpenChange={(open) => !open && close()}
        title={`${title} Details`}
        description="Review the selected record before editing or syncing with the API."
        footer={<AppButton type="button" onClick={() => toast.success("Record queued for follow-up")}>Mark for Follow-up</AppButton>}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {selected ? Object.entries(selected).map(([key, value]) => (
            <div key={key} className="rounded-md border border-neutral-200 p-3 dark:border-white/10">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">{key.replace(/([A-Z])/g, " $1")}</p>
              <p className="mt-1 font-semibold">{String(value)}</p>
            </div>
          )) : null}
        </div>
      </AppDialog>

      <AppDialog
        open={mode === "create" || mode === "edit"}
        onOpenChange={(open) => !open && close()}
        title={mode === "create" ? `Add ${title}` : `Edit ${title}`}
        description="Enter the record details below. These admin fields are reusable for API-backed CRUD."
      >
        <AppForm form={form} onSubmit={handleSave} submitLabel={mode === "create" ? "Create" : "Save Changes"} onCancel={close}>
          {formColumns.map((column) => (
            <AppTextField<AdminFormValues>
              key={column.key}
              label={column.label}
              name={column.key as Path<AdminFormValues>}
              rules={{ required: `${column.label} is required` }}
            />
          ))}
        </AppForm>
      </AppDialog>

      <AppConfirmationDialog
        open={mode === "delete"}
        itemName={selectedName}
        typedValue={confirmText}
        onTypedValueChange={setConfirmText}
        onCancel={close}
        onConfirm={() => selected && deleteMutation.mutate(selected)}
      />
    </>
  );
}
