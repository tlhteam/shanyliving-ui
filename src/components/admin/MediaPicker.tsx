"use client";

import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Check, FileText, Search, Upload } from "lucide-react";
import { AppButton } from "@/components/app/AppButton";
import { AppDialog } from "@/components/app/AppDialog";
import { useApi } from "@/hooks/use-api";
import { cn } from "@/lib/utils";
import type { Paginated } from "@/lib/api-client";
import type { MediaItem } from "@/types/media";

type MediaPickerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (items: MediaItem[]) => void;
  multiple?: boolean;
  folder?: string;
  title?: string;
};

export function MediaPicker({ open, onOpenChange, onSelect, multiple = true, folder = "products", title = "Select image" }: MediaPickerProps) {
  const { request, token } = useApi();
  const queryClient = useQueryClient();
  const fileInput = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Record<number, MediaItem>>({});

  const mediaQuery = useQuery({
    queryKey: ["admin-media", "picker", folder, search],
    enabled: open && Boolean(token),
    queryFn: () =>
      request<Paginated<MediaItem>>("/admin/media", {
        query: { folder: folder || undefined, search: search || undefined, per_page: 48 }
      })
  });

  const uploadMutation = useMutation({
    mutationFn: async (files: FileList) => {
      const uploads = Array.from(files).map((file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        return request<MediaItem>("/admin/media", { method: "POST", formData });
      });

      return Promise.all(uploads);
    },
    onSuccess: (items) => {
      toast.success(items.length > 1 ? `${items.length} files uploaded.` : "File uploaded.");
      queryClient.invalidateQueries({ queryKey: ["admin-media"] });
      setSelected((current) => {
        const next = multiple ? { ...current } : {};
        items.forEach((item) => {
          next[item.id] = item;
        });

        return next;
      });
    },
    onError: (error: Error) => toast.error(error.message)
  });

  const items = mediaQuery.data?.data ?? [];
  const selectedList = Object.values(selected);

  const toggle = (item: MediaItem) => {
    setSelected((current) => {
      if (current[item.id]) {
        const next = { ...current };
        delete next[item.id];

        return next;
      }

      return multiple ? { ...current, [item.id]: item } : { [item.id]: item };
    });
  };

  const close = () => {
    setSelected({});
    setSearch("");
    onOpenChange(false);
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={(next) => (next ? onOpenChange(true) : close())}
      title={title}
      description="Pick from the media library or upload new files."
      className="sm:max-w-4xl"
      footer={
        <>
          <AppButton type="button" variant="outline" onClick={close}>Cancel</AppButton>
          <AppButton
            type="button"
            disabled={selectedList.length === 0}
            onClick={() => {
              onSelect(selectedList);
              close();
            }}
          >
            Done{selectedList.length ? ` (${selectedList.length})` : ""}
          </AppButton>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-neutral-300 px-3 dark:border-white/15">
            <Search className="size-4 shrink-0 text-neutral-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search files"
              className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
          </div>
          <AppButton type="button" variant="outline" className="gap-2" loading={uploadMutation.isPending} onClick={() => fileInput.current?.click()}>
            <Upload className="size-4" /> Add files
          </AppButton>
        </div>

        <input
          ref={fileInput}
          type="file"
          multiple={multiple}
          accept="image/*,video/mp4,video/webm,application/pdf"
          className="hidden"
          onChange={(event) => {
            if (event.target.files?.length) {
              uploadMutation.mutate(event.target.files);
            }

            event.target.value = "";
          }}
        />

        <div className="max-h-[52vh] overflow-y-auto">
          {mediaQuery.isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {Array.from({ length: 12 }).map((_, index) => <div key={index} className="aspect-square animate-pulse rounded-md bg-neutral-200 dark:bg-white/10" />)}
            </div>
          ) : null}

          {!mediaQuery.isLoading && items.length === 0 ? (
            <div className="grid place-items-center gap-2 rounded-md border border-dashed border-neutral-300 p-10 text-center dark:border-white/15">
              <Upload className="size-6 text-neutral-400" />
              <p className="text-sm text-neutral-600 dark:text-neutral-300">No files in this folder yet.</p>
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {items.map((item) => {
              const active = Boolean(selected[item.id]);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggle(item)}
                  className={cn(
                    "group relative overflow-hidden rounded-md border-2 text-left transition",
                    active ? "border-neutral-950 dark:border-white" : "border-transparent hover:border-neutral-300"
                  )}
                >
                  <span className="relative block aspect-square bg-neutral-100 dark:bg-neutral-800">
                    {item.type === "image" && item.url ? (
                      <Image src={item.url} alt={item.alt ?? item.name} fill sizes="160px" className="object-cover" />
                    ) : (
                      <span className="grid h-full place-items-center text-neutral-400"><FileText className="size-6" /></span>
                    )}
                  </span>
                  <span
                    className={cn(
                      "absolute start-1.5 top-1.5 grid size-5 place-items-center rounded border bg-white/90",
                      active ? "border-neutral-950 text-neutral-950" : "border-neutral-300 text-transparent"
                    )}
                  >
                    <Check className="size-3.5" />
                  </span>
                  <span className="block truncate px-1.5 py-1 text-[11px] font-semibold">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </AppDialog>
  );
}
