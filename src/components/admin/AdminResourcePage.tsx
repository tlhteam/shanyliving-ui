"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { CellContext, ColumnDef } from "@tanstack/react-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Path, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Eye, Pencil, RefreshCcw, Trash2, X } from "lucide-react";
import { AppConfirmationDialog } from "@/components/app/AppConfirmationDialog";
import { AppDialog } from "@/components/app/AppDialog";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppForm } from "@/components/app/AppForm";
import { AppImage } from "@/components/app/AppImage";
import { AppPagination } from "@/components/app/AppPagination";
import { AppSearch } from "@/components/app/AppSearch";
import { AppSwitch } from "@/components/app/AppSwitch";
import { AppTable } from "@/components/app/AppTable";
import { AppTextField } from "@/components/app/AppTextField";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AdminRow } from "@/lib/admin-data";
import { api } from "@/lib/api";
import { isUsableImagePath, mediaUrl } from "@/lib/media";
import { useAdminCrudStore } from "@/stores/admin-crud-store";

type AdminResourcePageProps = {
  eyebrow: string;
  title: string;
  description: string;
  action: string;
  rows: AdminRow[];
  columns: {
    key: string;
    label: string;
    badge?: boolean;
    swatch?: boolean;
    input?: AdminColumnInput;
    formInput?: AdminColumnInput;
    expandable?: boolean;
    switchLabels?: {
      on: string;
      off: string;
      onHint?: string;
      offHint?: string;
    };
  }[];
  apiPath?: string;
  mapApiRow?: (row: Record<string, unknown>) => AdminRow;
  getResourceKey?: (row: AdminRow) => string;
  createHref?: string;
  editHref?: (row: AdminRow) => string;
};

type AdminColumnInput =
  | "text"
  | "textarea"
  | "color"
  | "image"
  | "images"
  | "switch";
type AdminFormValues = Record<string, unknown>;
type ApiPageMeta = {
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
};
type ResourceQueryData = AdminRow[] | { rows: AdminRow[]; meta?: ApiPageMeta };

function rowKey(row: AdminRow) {
  return String(
    row.id ??
      row.productId ??
      row.categoryId ??
      row.slug ??
      row.sku ??
      row.reference ??
      row.event ??
      row.setting ??
      row.name,
  );
}

function createEmptyRow(columns: AdminResourcePageProps["columns"]) {
  return columns.reduce<AdminRow>((draft, column) => {
    draft[column.key] =
      (column.formInput ?? column.input) === "switch"
        ? (column.switchLabels?.on ?? true)
        : "";
    return draft;
  }, {});
}

function rowToFormValues(row: AdminRow) {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [key, value ?? ""]),
  );
}

function isBlankValue(value: unknown) {
  if (value === undefined || value === null) {
    return true;
  }

  const normalized = String(value).trim().toLowerCase();

  return (
    normalized === "" ||
    normalized === "undefined" ||
    normalized === "null" ||
    normalized === "nan" ||
    normalized === "[object object]"
  );
}

function isImageValue(value: unknown) {
  return typeof value === "string" && isUsableImagePath(value);
}

function hasDisplayValue(value: unknown) {
  return !isBlankValue(value);
}

function toBoolean(value: unknown) {
  return (
    value === true ||
    value === 1 ||
    ["1", "true", "yes", "active", "visible"].includes(
      String(value).toLowerCase(),
    )
  );
}

function EmptyValue({ image = false }: { image?: boolean }) {
  if (image) {
    return (
      <div className="grid h-12 w-16 place-items-center rounded-md border border-dashed border-neutral-300 bg-neutral-50 px-2 text-center text-[10px] font-semibold leading-tight text-neutral-500 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-400">
        No image found
      </div>
    );
  }

  return (
    <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
      null
    </span>
  );
}

function statusVariant(
  value: unknown,
): "default" | "secondary" | "destructive" {
  const text = String(value).toLowerCase();

  if (
    text.includes("active") ||
    text.includes("booked") ||
    text.includes("sent") ||
    text.includes("yes")
  ) {
    return "default";
  }

  if (
    text.includes("draft") ||
    text.includes("pending") ||
    text.includes("required") ||
    text.includes("needs")
  ) {
    return "destructive";
  }

  return "secondary";
}

function imageListFromValue(value: unknown): Array<string | File> {
  if (!value) {
    return [];
  }

  if (value instanceof File) {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.filter(
      (item): item is string | File =>
        item instanceof File ||
        (typeof item === "string" && isUsableImagePath(item)),
    );
  }

  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(isUsableImagePath);
}

function previewSrc(value: string | File) {
  return value instanceof File
    ? URL.createObjectURL(value)
    : (mediaUrl(value) ?? "");
}

function normalizeResourcePayload(responseData: unknown) {
  const root = responseData as
    | { data?: unknown; meta?: ApiPageMeta }
    | undefined;
  const payload = root?.data ?? responseData;
  const resource = payload as
    | {
        data?: unknown;
        meta?: ApiPageMeta;
        current_page?: number;
        last_page?: number;
        per_page?: number;
        total?: number;
      }
    | undefined;
  const records = Array.isArray(resource?.data)
    ? resource.data
    : Array.isArray(payload)
      ? payload
      : [];
  const meta =
    resource?.meta ??
    (resource && ("total" in resource || "last_page" in resource)
      ? {
          current_page: resource.current_page,
          last_page: resource.last_page,
          per_page: resource.per_page,
          total: resource.total,
        }
      : undefined);

  return { records: records as Record<string, unknown>[], meta };
}

function DetailField({
  column,
  value,
  row,
}: {
  column: AdminResourcePageProps["columns"][number];
  value: unknown;
  row: AdminRow;
}) {
  if (column.input === "image") {
    return isImageValue(value) ? (
      <AppImage
        src={String(value)}
        alt={String(row.name ?? column.label)}
        className="mt-2 aspect-video rounded-md border border-neutral-200 dark:border-white/10"
        sizes="320px"
      />
    ) : (
      <EmptyValue image />
    );
  }

  if (column.input === "images") {
    const images = imageListFromValue(value).filter(
      (image): image is string => typeof image === "string",
    );

    return images.length ? (
      <div className="mt-2 grid grid-cols-3 gap-2">
        {images.map((image, index) => (
          <AppImage
            key={`${image}-${index}`}
            src={image}
            alt={`${String(row.name ?? column.label)} gallery ${index + 1}`}
            className="aspect-square rounded-md border border-neutral-200 dark:border-white/10"
            sizes="120px"
          />
        ))}
      </div>
    ) : (
      <EmptyValue image />
    );
  }

  if (column.swatch) {
    return hasDisplayValue(value) ? (
      <div className="mt-2 flex items-center gap-2">
        <span
          className="size-5 rounded-full border border-neutral-300"
          style={{ backgroundColor: String(value) }}
        />
        <span className="font-mono text-xs">{String(value)}</span>
      </div>
    ) : (
      <EmptyValue />
    );
  }

  if (column.badge) {
    return hasDisplayValue(value) ? (
      <Badge className="mt-2" variant={statusVariant(value)}>
        {String(value)}
      </Badge>
    ) : (
      <EmptyValue />
    );
  }

  if (!hasDisplayValue(value)) {
    return <EmptyValue />;
  }

  return (
    <p className="mt-1 whitespace-pre-wrap font-semibold">
      {Array.isArray(value) ? value.join(", ") : String(value)}
    </p>
  );
}

export function AdminResourcePage({
  eyebrow,
  title,
  description,
  action,
  rows,
  columns,
  apiPath,
  mapApiRow,
  getResourceKey,
  createHref,
  editHref,
}: AdminResourcePageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, status: sessionStatus } = useSession();
  const form = useForm<AdminFormValues>({ defaultValues: {} });
  const watchedValues = useWatch({ control: form.control });
  const queryKey = useMemo(() => ["admin-resource", title], [title]);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const {
    query,
    page,
    pageSize,
    mode,
    selected,
    draft,
    confirmText,
    setQuery,
    setPage,
    openCreate,
    openView,
    openEdit,
    openDelete,
    setConfirmText,
    close,
  } = useAdminCrudStore();
  const accessToken = (session as { accessToken?: string } | null)?.accessToken;
  const authHeaders = useMemo(
    () =>
      accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    [accessToken],
  );
  const requiresSession = Boolean(
    apiPath?.startsWith("/admin") || apiPath?.startsWith("/customer"),
  );
  const {
    data: resourceData,
    isFetching,
    isLoading,
    isError,
    error: resourceError,
    refetch: refetchResource,
  } = useQuery<ResourceQueryData>({
    queryKey: apiPath
      ? [...queryKey, page, pageSize, query, accessToken ?? "guest"]
      : queryKey,
    queryFn: async () => {
      if (!apiPath) {
        return new Promise<AdminRow[]>((resolve) => {
          window.setTimeout(() => resolve(rows), 250);
        });
      }

      const response = await api.get(apiPath, {
        params: { page, per_page: pageSize, search: query || undefined },
        headers: authHeaders,
      });
      const { records, meta } = normalizeResourcePayload(response.data);
      const mappedRows = mapApiRow ? records.map(mapApiRow) : records;

      return apiPath ? { rows: mappedRows, meta } : mappedRows;
    },
    enabled: !requiresSession || sessionStatus !== "loading",
  });

  const resourceErrorMessage = useMemo(() => {
    const status = (resourceError as { response?: { status?: number } } | null)?.response?.status;
    const apiMessage = (resourceError as { response?: { data?: { message?: string } } } | null)?.response?.data?.message;

    if (status === 401 || status === 403) {
      return "Your admin session expired. Sign in again to load these records.";
    }

    return apiMessage || (resourceError as Error | null)?.message || "Unable to load records from the API.";
  }, [resourceError]);

  useEffect(() => {
    if (!isError) {
      return;
    }

    toast.error(`${title} could not be loaded`, {
      description: resourceErrorMessage,
      action: { label: "Retry", onClick: () => refetchResource() },
    });
  }, [isError, refetchResource, resourceErrorMessage, title]);

  const data = useMemo(
    () =>
      Array.isArray(resourceData)
        ? resourceData
        : (resourceData?.rows ?? (apiPath ? [] : rows)),
    [apiPath, resourceData, rows],
  );
  const serverMeta = !Array.isArray(resourceData)
    ? resourceData?.meta
    : undefined;

  const filteredRows = useMemo(() => {
    if (apiPath) {
      return data;
    }

    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return data;
    }

    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [apiPath, data, query]);

  const totalRows = serverMeta?.total ?? filteredRows.length;
  const pageCount = Math.max(
    1,
    serverMeta?.last_page ?? Math.ceil(totalRows / pageSize),
  );
  const safePage = Math.min(page, pageCount);
  const paginatedRows = apiPath
    ? filteredRows
    : filteredRows.slice((safePage - 1) * pageSize, safePage * pageSize);

  useEffect(() => {
    if (mode === "create" || mode === "edit") {
      form.reset(rowToFormValues(draft));
    }
  }, [draft, form, mode]);

  const formColumns = columns.filter((column) => column.key !== "actions");

  const saveMutation = useMutation({
    mutationFn: async (payload: AdminRow) => {
      if (!apiPath) {
        return payload;
      }

      const formData = new FormData();

      formColumns.forEach((column) => {
        const formInput = column.formInput ?? column.input;
        const value = payload[column.key];

        if (formInput === "image") {
          if (value instanceof File) {
            formData.append(column.key, value);
          } else if (!hasDisplayValue(value) && selected?.[column.key]) {
            formData.append("remove_cover", "1");
          }
          return;
        }

        if (formInput === "images") {
          formData.append(`${column.key}_touched`, "1");
          imageListFromValue(value).forEach((item) => {
            if (item instanceof File) {
              formData.append(`${column.key}[]`, item);
            } else {
              formData.append(`${column.key}_keep[]`, item);
            }
          });
          return;
        }

        if (formInput === "switch") {
          formData.append(column.key, toBoolean(value) ? "1" : "0");
          return;
        }

        formData.append(
          column.key,
          hasDisplayValue(value) ? String(value) : "",
        );
      });

      const targetRow =
        selected ?? data.find((row) => rowKey(row) === rowKey(payload));
      const resourceKey = targetRow
        ? getResourceKey
          ? getResourceKey(targetRow)
          : rowKey(targetRow)
        : null;
      const url = resourceKey
        ? `${apiPath}/${encodeURIComponent(resourceKey)}`
        : apiPath;
      const response = await api.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(authHeaders ?? {}),
        },
      });
      const responseRow = response.data?.data ?? response.data;

      return mapApiRow ? mapApiRow(responseRow) : responseRow;
    },
    onSuccess: (payload) => {
      if (apiPath) {
        queryClient.invalidateQueries({ queryKey });
      } else {
        queryClient.setQueryData<AdminRow[]>(queryKey, (current = rows) => {
          const payloadKey = rowKey(payload);
          const exists = current.some((row) => rowKey(row) === payloadKey);

          return exists
            ? current.map((row) => (rowKey(row) === payloadKey ? payload : row))
            : [payload, ...current];
        });
      }
      toast.success(`${title} saved`);
      close();
    },
    onError: () => toast.error(`Unable to save ${title.toLowerCase()}`),
  });

  const deleteMutation = useMutation({
    mutationFn: async (payload: AdminRow) => {
      if (apiPath) {
        const resourceKey = getResourceKey
          ? getResourceKey(payload)
          : rowKey(payload);
        await api.delete(`${apiPath}/${encodeURIComponent(resourceKey)}`, {
          headers: authHeaders,
        });
      }

      return payload;
    },
    onSuccess: (payload) => {
      if (apiPath) {
        queryClient.invalidateQueries({ queryKey });
      } else {
        queryClient.setQueryData<AdminRow[]>(queryKey, (current = rows) =>
          current.filter((row) => rowKey(row) !== rowKey(payload)),
        );
      }
      toast.success(`${title} deleted`);
      close();
    },
    onError: () => toast.error(`Unable to delete ${title.toLowerCase()}`),
  });

  const tableColumns = useMemo<ColumnDef<AdminRow>[]>(
    () => [
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
                <span
                  className="size-5 rounded-full border border-neutral-300"
                  style={{ backgroundColor: String(value) }}
                />
                <span className="font-mono text-xs">{String(value)}</span>
              </div>
            );
          }

          if ((column.formInput ?? column.input) === "switch") {
            const checked = toBoolean(value);
            const label = checked
              ? (column.switchLabels?.on ?? "Yes")
              : (column.switchLabels?.off ?? "No");

            return <Badge variant={statusVariant(label)}>{label}</Badge>;
          }

          if (column.badge) {
            if (!hasDisplayValue(value)) {
              return <EmptyValue />;
            }

            return (
              <Badge variant={statusVariant(value)}>{String(value)}</Badge>
            );
          }

          if (column.input === "image") {
            return isImageValue(value) ? (
              <AppImage
                src={String(value)}
                alt={String(row.original.name ?? column.label)}
                className="h-12 w-16 rounded-md"
                sizes="64px"
              />
            ) : (
              <EmptyValue image />
            );
          }

          if (column.input === "images") {
            const images = imageListFromValue(value).filter(
              (image): image is string => typeof image === "string",
            );

            return images.length ? (
              <div className="flex -space-x-2">
                {images.slice(0, 3).map((image, index) => (
                  <AppImage
                    key={`${image}-${index}`}
                    src={image}
                    alt={String(row.original.name ?? column.label)}
                    className="size-10 rounded-md border border-white dark:border-neutral-900"
                    sizes="40px"
                  />
                ))}
                {images.length > 3 ? (
                  <span className="grid size-10 place-items-center rounded-md bg-neutral-100 text-xs font-bold dark:bg-neutral-800">
                    +{images.length - 3}
                  </span>
                ) : null}
              </div>
            ) : (
              <EmptyValue image />
            );
          }

          if (!hasDisplayValue(value)) {
            return <EmptyValue />;
          }

          if (column.expandable) {
            const rowId = rowKey(row.original);
            const isExpanded = expandedRows[rowId];

            return (
              <div className="min-w-0 max-w-md overflow-hidden">
                <p
                  className={
                    isExpanded
                      ? "whitespace-normal break-words font-medium"
                      : "line-clamp-2 whitespace-normal break-words font-medium"
                  }
                >
                  {String(value)}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setExpandedRows((current) => ({
                      ...current,
                      [rowId]: !isExpanded,
                    }))
                  }
                  className="mt-1 text-xs font-semibold text-neutral-600 hover:underline dark:text-neutral-300"
                >
                  {isExpanded ? "Show less ↑" : "Show more ↓"}
                </button>
              </div>
            );
          }

          return <span className="font-medium">{String(value)}</span>;
        },
      })),
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                openView(row.original);
                toast.info(`${title} details opened`);
              }}
            >
              <Eye className="size-3.5" />
              View
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                editHref
                  ? router.push(editHref(row.original))
                  : openEdit(row.original)
              }
            >
              <Pencil className="size-3.5" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => openDelete(row.original)}
            >
              <Trash2 className="size-3.5" />
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [
      columns,
      editHref,
      openDelete,
      openEdit,
      openView,
      router,
      saveMutation,
      title,
    ],
  );

  const handleSave = (values: AdminFormValues) => {
    const fallbackKey = rowKey(selected ?? values);
    const payload: AdminRow = { ...values };

    if (
      !payload.id &&
      !payload.productId &&
      !payload.categoryId &&
      !payload.reference &&
      !payload.event &&
      !payload.setting
    ) {
      payload.id = `${title.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-5)}`;
    }

    if (
      selected &&
      !payload.id &&
      !payload.productId &&
      !payload.categoryId &&
      !payload.reference &&
      !payload.event &&
      !payload.setting
    ) {
      payload.id = fallbackKey;
    }

    saveMutation.mutate(payload);
  };

  const selectedName = selected
    ? String(
        selected.name ??
          selected.id ??
          selected.reference ??
          selected.event ??
          selected.setting ??
          "this record",
      )
    : "this record";
  const handleFileInput = (
    event: ChangeEvent<HTMLInputElement>,
    key: string,
    multiple: boolean,
  ) => {
    const input = event.currentTarget;
    const files = Array.from(input.files ?? []);
    const existing = multiple
      ? imageListFromValue(form.getValues(key as Path<AdminFormValues>)).filter(
          (item) => typeof item === "string",
        )
      : [];
    form.setValue(
      key as Path<AdminFormValues>,
      (multiple ? [...existing, ...files] : (files[0] ?? "")) as never,
      { shouldDirty: true, shouldValidate: true },
    );
    input.value = "";
  };
  const removeImageValue = (key: string, index?: number) => {
    const value = form.getValues(key as Path<AdminFormValues>);

    if (typeof index === "number") {
      form.setValue(
        key as Path<AdminFormValues>,
        imageListFromValue(value).filter(
          (_, itemIndex) => itemIndex !== index,
        ) as never,
        { shouldDirty: true, shouldValidate: true },
      );
      return;
    }

    form.setValue(key as Path<AdminFormValues>, "" as never, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <>
      <AdminPageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        action={action}
        onAction={() =>
          createHref
            ? router.push(createHref)
            : openCreate(createEmptyRow(columns))
        }
      />
      <AppCard className="overflow-hidden dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50">
        <div className="grid gap-4 border-b border-neutral-200 p-4 dark:border-white/10 lg:grid-cols-[1fr_320px] lg:items-center">
          <div>
            <h2 className="font-bold">{title} List</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {isLoading
                ? "Loading records for management"
                : `${filteredRows.length} of ${totalRows} records ready for management`}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <AppSearch
              onSearch={setQuery}
              placeholder={`Search ${title.toLowerCase()}...`}
            />
            {isError ? (
              <Button variant="outline" onClick={() => refetchResource()}>
                <RefreshCcw className="size-4" />
                Retry
              </Button>
            ) : null}
            <Button
              variant="outline"
              onClick={() => {
                queryClient.invalidateQueries({ queryKey });
                toast.success(`${title} data refreshed`, {
                  description: "The list now matches the API.",
                  action: { label: "Reload", onClick: () => refetchResource() },
                });
              }}
            >
              <RefreshCcw className="size-4" />
              Refresh
            </Button>
          </div>
        </div>
        <AppTable
          data={isError ? [] : paginatedRows}
          columns={tableColumns}
          loading={isLoading || isFetching}
          skeletonRows={pageSize}
          emptyMessage={
            isError
              ? resourceErrorMessage
              : "No matching records found."
          }
        />
        {!isLoading && !isFetching ? (
          <AppPagination
            page={safePage}
            pageSize={pageSize}
            total={totalRows}
            onPageChange={setPage}
          />
        ) : null}
      </AppCard>

      <AppDialog
        open={mode === "view"}
        onOpenChange={(open) => !open && close()}
        title={`${title} Details`}
        description="Review the selected record before editing or syncing with the API."
        footer={
          <AppButton
            type="button"
            onClick={() => toast.success("Record queued for follow-up")}
          >
            Mark for Follow-up
          </AppButton>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {selected
            ? columns.map((column) => (
                <div
                  key={column.key}
                  className="rounded-md border border-neutral-200 p-3 dark:border-white/10"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                    {column.label}
                  </p>
                  <DetailField
                    column={column}
                    value={selected[column.key]}
                    row={selected}
                  />
                </div>
              ))
            : null}
        </div>
      </AppDialog>

      <AppDialog
        open={mode === "create" || mode === "edit"}
        onOpenChange={(open) => !open && close()}
        title={mode === "create" ? `Add ${title}` : `Edit ${title}`}
        description="Enter the record details below. These admin fields are reusable for API-backed CRUD."
      >
        <AppForm
          form={form}
          onSubmit={handleSave}
          submitLabel={mode === "create" ? "Create" : "Save Changes"}
          onCancel={close}
        >
          {formColumns.map((column) => {
            const formInput = column.formInput ?? column.input;
            const value = watchedValues?.[column.key];
            const images = imageListFromValue(value);

            if (formInput === "image" || formInput === "images") {
              return (
                <div key={column.key} className="space-y-2">
                  <label className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    {column.label}
                  </label>
                  <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-neutral-300 bg-white p-4 text-center text-sm font-bold text-neutral-700 hover:bg-neutral-50 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-white/10">
                    {images.length
                      ? `Add ${formInput === "images" ? "more images" : "new image"}`
                      : `Upload ${formInput === "images" ? "images" : "image"}`}
                    <span className="mt-1 text-xs font-medium text-neutral-500">
                      PNG, JPG, or WebP
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple={formInput === "images"}
                      className="sr-only"
                      onChange={(event) =>
                        handleFileInput(
                          event,
                          column.key,
                          formInput === "images",
                        )
                      }
                    />
                  </label>
                  {images.length ? (
                    <div className="grid grid-cols-3 gap-2">
                      {images.map((image, index) => (
                        <div
                          key={`${image instanceof File ? image.name : image}-${index}`}
                          className="relative"
                        >
                          <AppImage
                            src={previewSrc(image)}
                            alt={`${column.label} preview`}
                            className="aspect-square rounded-md border border-neutral-200 dark:border-white/10"
                            sizes="120px"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute right-1 top-1 size-7"
                            onClick={() =>
                              removeImageValue(
                                column.key,
                                formInput === "images" ? index : undefined,
                              )
                            }
                          >
                            <X className="size-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            }

            if (formInput === "switch") {
              const checked = toBoolean(value);
              const onLabel = column.switchLabels?.on ?? "Visible";
              const offLabel = column.switchLabels?.off ?? "Hidden";

              return (
                <div
                  key={column.key}
                  className="flex items-center justify-between rounded-md border border-neutral-200 p-3 dark:border-white/10"
                >
                  <div>
                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                      {column.label}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {checked
                        ? (column.switchLabels?.onHint ?? onLabel)
                        : (column.switchLabels?.offHint ?? offLabel)}
                    </p>
                  </div>
                  <AppSwitch
                    checked={checked}
                    aria-label={column.label}
                    onClick={() =>
                      form.setValue(
                        column.key as Path<AdminFormValues>,
                        (checked ? offLabel : onLabel) as never,
                        { shouldDirty: true, shouldValidate: true },
                      )
                    }
                  />
                </div>
              );
            }

            return (
              <AppTextField<AdminFormValues>
                key={column.key}
                label={column.label}
                name={column.key as Path<AdminFormValues>}
                type={formInput === "color" ? "color" : "text"}
                multiline={formInput === "textarea"}
                rules={
                  column.key === "name"
                    ? { required: `${column.label} is required` }
                    : undefined
                }
                className={formInput === "color" ? "h-12 p-1" : undefined}
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
