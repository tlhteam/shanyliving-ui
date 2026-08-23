"use client";

import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Check, Copy, FileText, Search, Trash2, Upload } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppConfirmationDialog } from "@/components/app/AppConfirmationDialog";
import { useApi } from "@/hooks/use-api";
import type { Paginated } from "@/lib/api-client";
import type { MediaItem } from "@/types/media";

const folders = ["library", "products", "collections", "showroom", "inspiration"];

function formatSize(size: number | null, unknown: string) {
  if (!size) {
    return unknown;
  }

  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function AdminMediaLibrary() {
  const t = useTranslations("adminPanel.media");
  const { request, token } = useApi();
  const queryClient = useQueryClient();
  const fileInput = useRef<HTMLInputElement>(null);
  const [folder, setFolder] = useState("");
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<MediaItem | null>(null);
  const [confirmValue, setConfirmValue] = useState("");

  const mediaQuery = useQuery({
    queryKey: ["admin-media", folder, search],
    enabled: Boolean(token),
    queryFn: () =>
      request<Paginated<MediaItem>>("/admin/media", {
        query: { folder: folder || undefined, search: search || undefined, per_page: 48 }
      })
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-media"] });

  const uploadMutation = useMutation({
    mutationFn: async (files: FileList) => {
      const uploads = Array.from(files).map((file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder || "library");

        return request<MediaItem>("/admin/media", { method: "POST", formData });
      });

      return Promise.all(uploads);
    },
    onSuccess: (items) => {
      toast.success(items.length > 1 ? `${items.length} files uploaded.` : t("uploaded"));
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message)
  });

  const deleteMutation = useMutation({
    mutationFn: (item: MediaItem) => request<null>(`/admin/media/${item.id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success(t("deleted"));
      setPendingDelete(null);
      setConfirmValue("");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message)
  });

  const renameMutation = useMutation({
    mutationFn: ({ item, alt }: { item: MediaItem; alt: string }) =>
      request<MediaItem>(`/admin/media/${item.id}`, { method: "PATCH", body: { alt } }),
    onSuccess: () => {
      toast.success(t("updated"));
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message)
  });

  const copyUrl = async (item: MediaItem) => {
    if (!item.url) {
      return;
    }

    await navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    toast.success("URL copied to the clipboard.");
    window.setTimeout(() => setCopiedId((current) => (current === item.id ? null : current)), 1600);
  };

  const items = mediaQuery.data?.data ?? [];

  return (
    <>
      <AdminPageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("subtitle")}
        action={t("upload")}
        onAction={() => fileInput.current?.click()}
      />

      <input
        ref={fileInput}
        type="file"
        multiple
        accept="image/*,video/mp4,video/webm,application/pdf"
        className="hidden"
        onChange={(event) => {
          if (event.target.files?.length) {
            uploadMutation.mutate(event.target.files);
          }

          event.target.value = "";
        }}
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 dark:border-white/15 dark:bg-neutral-900">
          <Search className="size-4 shrink-0 text-neutral-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("search")}
            className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </div>
        <select
          value={folder}
          onChange={(event) => setFolder(event.target.value)}
          className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none dark:border-white/15 dark:bg-neutral-900"
        >
          <option value="">{t("allFolders")}</option>
          {folders.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <AppButton className="gap-2 sm:w-auto" loading={uploadMutation.isPending} onClick={() => fileInput.current?.click()}>
          <Upload className="size-4" />
          {t("uploadShort")}
        </AppButton>
      </div>

      {mediaQuery.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-64 animate-pulse rounded-lg bg-neutral-200 dark:bg-white/10" />
          ))}
        </div>
      ) : null}

      {mediaQuery.isError ? (
        <AppCard className="p-6 dark:border-white/10 dark:bg-neutral-900">
          <p className="text-sm text-red-600">{(mediaQuery.error as Error).message}</p>
        </AppCard>
      ) : null}

      {!mediaQuery.isLoading && !mediaQuery.isError && items.length === 0 ? (
        <AppCard className="grid place-items-center gap-3 p-12 text-center dark:border-white/10 dark:bg-neutral-900">
          <Upload className="size-8 text-neutral-400" />
          <p className="text-sm text-neutral-600 dark:text-neutral-300">{t("empty")}</p>
          <AppButton onClick={() => fileInput.current?.click()}>{t("upload")}</AppButton>
        </AppCard>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <AppCard key={item.id} className="flex flex-col overflow-hidden dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50">
            <div className="relative aspect-4/3 bg-neutral-100 dark:bg-neutral-800">
              {item.type === "image" && item.url ? (
                <Image src={item.url} alt={item.alt ?? item.name} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
              ) : (
                <span className="grid h-full place-items-center text-neutral-400">
                  <FileText className="size-8" />
                </span>
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold" title={item.name}>{item.name}</p>
                <p className="mt-1 text-xs text-neutral-500">
                  {item.folder ?? "library"} · {formatSize(item.size, t("unknownSize"))}
                  {item.width && item.height ? ` · ${item.width}x${item.height}` : ""}
                </p>
              </div>
              <input
                defaultValue={item.alt ?? ""}
                placeholder={t("altText")}
                onBlur={(event) => {
                  const value = event.target.value.trim();

                  if (value !== (item.alt ?? "")) {
                    renameMutation.mutate({ item, alt: value });
                  }
                }}
                className="h-9 w-full rounded-md border border-neutral-300 px-2.5 text-xs outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950"
              />
              <div className="mt-auto grid grid-cols-[1fr_auto] gap-2">
                <AppButton size="sm" variant="outline" className="gap-2" onClick={() => copyUrl(item)} disabled={!item.url}>
                  {copiedId === item.id ? <Check className="size-4" /> : <Copy className="size-4" />}
                  {copiedId === item.id ? t("copied") : t("copy")}
                </AppButton>
                <AppButton
                  size="sm"
                  variant="danger"
                  aria-label={t("deleteLabel", { name: item.name })}
                  onClick={() => {
                    setPendingDelete(item);
                    setConfirmValue("");
                  }}
                >
                  <Trash2 className="size-4" />
                </AppButton>
              </div>
            </div>
          </AppCard>
        ))}
      </div>

      <AppConfirmationDialog
        open={Boolean(pendingDelete)}
        title={t("deleteTitle")}
        itemName={pendingDelete?.name ?? t("thisFile")}
        typedValue={confirmValue}
        onTypedValueChange={setConfirmValue}
        onCancel={() => {
          setPendingDelete(null);
          setConfirmValue("");
        }}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete)}
      />
    </>
  );
}
