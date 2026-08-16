"use client";

import { ChangeEvent, useEffect, useMemo } from "react";
import type { CellContext, ColumnDef } from "@tanstack/react-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Path, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Eye, Pencil, RefreshCcw, Trash2 } from "lucide-react";
import { AppConfirmationDialog } from "@/components/app/AppConfirmationDialog";
import { AppDialog } from "@/components/app/AppDialog";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppForm } from "@/components/app/AppForm";
import { AppImage } from "@/components/app/AppImage";
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
  columns: { key: string; label: string; badge?: boolean; swatch?: boolean; input?: "text" | "textarea" | "color" | "image" | "images" }[];
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

function isImageValue(value: unknown) {
  return typeof value === "string" && (value.startsWith("data:image") || value.startsWith("/") || value.startsWith("http"));
}

function hasDisplayValue(value: unknown) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

function EmptyValue({ image = false }: { image?: boolean }) {
  if (image) {
    return (
      <div className="grid h-12 w-16 place-items-center rounded-md border border-dashed border-neutral-300 bg-neutral-50 px-2 text-center text-[10px] font-semibold leading-tight text-neutral-500 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-400">
        No image found
      </div>
    );
  }

  return <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">null</span>;
}

function filesToDataUrls(files: FileList | null) {
  return Promise.all(Array.from(files ?? []).map((file) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  })));
}

function statusVariant(value: unknown): "default" | "secondary" | "destructive" {
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
  const watchedValues = useWatch({ control: form.control });
  const queryKey = useMemo(() => ["admin-resource", title], [title]);
  const { query, page, pageSize, mode, selected, draft, confirmText, setQuery, setPage, openCreate, openView, openEdit, openDelete, setConfirmText, close } = useAdminCrudStore();
  const { data = rows, isFetching, isLoading } = useQuery({
    queryKey,
    queryFn: async () => new Promise<AdminRow[]>((resolve) => {
      window.setTimeout(() => resolve(rows), 250);
    })
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
          if (!hasDisplayValue(value)) {
            return <EmptyValue />;
          }

          return (
            <div className="flex items-center gap-2">
              <span className="size-5 rounded-full border border-neutral-300" style={{ backgroundColor: String(value) }} />
              <span className="font-mono text-xs">{String(value)}</span>
            </div>
          );
        }

        if (column.badge) {
          if (!hasDisplayValue(value)) {
            return <EmptyValue />;
          }

          return <Badge variant={statusVariant(value)}>{String(value)}</Badge>;
        }

        if (column.input === "image") {
          return isImageValue(value)
            ? <AppImage src={String(value)} alt={String(row.original.name ?? column.label)} className="h-12 w-16 rounded-md" sizes="64px" />
            : <EmptyValue image />;
        }

        if (column.input === "images") {
          const images = String(value ?? "").split(",").map((item) => item.trim()).filter(Boolean);

          return images.length ? (
            <div className="flex -space-x-2">
              {images.slice(0, 3).map((image, index) => (
                <AppImage key={`${image}-${index}`} src={image} alt={String(row.original.name ?? column.label)} className="size-10 rounded-md border border-white dark:border-neutral-900" sizes="40px" />
              ))}
              {images.length > 3 ? <span className="grid size-10 place-items-center rounded-md bg-neutral-100 text-xs font-bold dark:bg-neutral-800">+{images.length - 3}</span> : null}
            </div>
          ) : <EmptyValue image />;
        }

        if (!hasDisplayValue(value)) {
          return <EmptyValue />;
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
  const handleFileInput = async (event: ChangeEvent<HTMLInputElement>, key: string, multiple: boolean) => {
    try {
      const files = await filesToDataUrls(event.target.files);
      form.setValue(key as Path<AdminFormValues>, multiple ? files.join(",") : files[0] ?? "", { shouldDirty: true, shouldValidate: true });
    } catch {
      toast.error("Unable to read selected image.");
    }
  };

  return (
    <>
      <AdminPageHeader eyebrow={eyebrow} title={title} description={description} action={action} onAction={() => openCreate(createEmptyRow(columns))} />
      <AppCard className="overflow-hidden dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50">
        <div className="grid gap-4 border-b border-neutral-200 p-4 dark:border-white/10 lg:grid-cols-[1fr_320px] lg:items-center">
          <div>
            <h2 className="font-bold">{title} List</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{isLoading ? "Loading records for management" : `${filteredRows.length} of ${data.length} records ready for management`}</p>
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
        <AppTable data={paginatedRows} columns={tableColumns} loading={isLoading || isFetching} skeletonRows={pageSize} emptyMessage="No matching records found." />
        {!isLoading && !isFetching ? <AppPagination page={safePage} pageSize={pageSize} total={filteredRows.length} onPageChange={setPage} /> : null}
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
              <p className="mt-1 font-semibold">{hasDisplayValue(value) ? String(value) : "null"}</p>
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
          {formColumns.map((column) => {
            const value = watchedValues?.[column.key];
            const images = String(value ?? "").split(",").map((item) => item.trim()).filter(Boolean);

            if (column.input === "image" || column.input === "images") {
              return (
                <div key={column.key} className="space-y-2">
                  <label className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{column.label}</label>
                  <input type="hidden" {...form.register(column.key as Path<AdminFormValues>, { required: `${column.label} is required` })} />
                  <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-neutral-300 bg-white p-4 text-center text-sm font-bold text-neutral-700 hover:bg-neutral-50 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-white/10">
                    Upload {column.input === "images" ? "images" : "image"}
                    <span className="mt-1 text-xs font-medium text-neutral-500">PNG, JPG, or WebP</span>
                    <input type="file" accept="image/*" multiple={column.input === "images"} className="sr-only" onChange={(event) => handleFileInput(event, column.key, column.input === "images")} />
                  </label>
                  {images.length ? (
                    <div className="grid grid-cols-3 gap-2">
                      {images.map((image, index) => (
                        <AppImage key={`${image}-${index}`} src={image} alt={`${column.label} preview`} className="aspect-square rounded-md border border-neutral-200 dark:border-white/10" sizes="120px" />
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            }

            return (
              <AppTextField<AdminFormValues>
                key={column.key}
                label={column.label}
                name={column.key as Path<AdminFormValues>}
                type={column.input === "color" ? "color" : "text"}
                multiline={column.input === "textarea"}
                rules={{ required: `${column.label} is required` }}
                className={column.input === "color" ? "h-12 p-1" : undefined}
              />
            );
          })}
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
