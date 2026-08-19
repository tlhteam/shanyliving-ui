"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ImagePlus, Star, Trash2 } from "lucide-react";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppRichTextEditor } from "@/components/app/AppRichTextEditor";
import { AppSwitch } from "@/components/app/AppSwitch";
import { AppTagInput } from "@/components/app/AppTagInput";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { VariantEditor } from "@/components/admin/products/VariantEditor";
import { useApi } from "@/hooks/use-api";
import { cn } from "@/lib/utils";
import type { AdminProduct, ProductOptionDraft, ProductVariantDraft } from "@/types/product";
import type { MediaItem } from "@/types/media";

type GalleryEntry = { media_id: number | null; url: string | null; path: string | null; is_primary: boolean };

type ProductForm = {
  name: string;
  category: string;
  subcategory: string;
  description: string;
  features: string;
  price: string;
  compare_at_price: string;
  seat_range: string;
  colors: string;
  status: "active" | "draft";
  customizable: boolean;
};

const emptyForm: ProductForm = {
  name: "",
  category: "",
  subcategory: "",
  description: "",
  features: "",
  price: "",
  compare_at_price: "",
  seat_range: "",
  colors: "",
  status: "active",
  customizable: true
};

const tagSuggestions = ["sofa", "customizable", "new arrival", "best seller", "showroom pick", "living room", "dining", "bedroom"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function fieldClass(invalid = false) {
  return cn(
    "h-11 w-full rounded-md border px-3 text-sm outline-none transition focus:border-neutral-950 dark:bg-neutral-950 dark:focus:border-white",
    invalid ? "border-red-400" : "border-neutral-300 dark:border-white/15"
  );
}

export function ProductEditor({ slug }: { slug?: string }) {
  const router = useRouter();
  const { request, token } = useApi();
  const queryClient = useQueryClient();
  const editing = Boolean(slug);

  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [manualSlug, setManualSlug] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [gallery, setGallery] = useState<GalleryEntry[]>([]);
  const [options, setOptions] = useState<ProductOptionDraft[]>([]);
  const [variants, setVariants] = useState<ProductVariantDraft[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [hydratedId, setHydratedId] = useState<number | null>(null);

  const productQuery = useQuery({
    queryKey: ["admin-product", slug],
    enabled: editing && Boolean(token),
    queryFn: () => request<AdminProduct>(`/admin/catalog/products/${slug}`)
  });

  const hydrate = (product: AdminProduct) => {
    setForm({
    name: product.name ?? "",
    category: product.category?.name ?? "",
    subcategory: product.subcategory ?? "",
    description: product.description ?? "",
    features: "",
    price: product.price ? String(product.price) : "",
    compare_at_price: product.compare_at_price ? String(product.compare_at_price) : "",
    seat_range: product.seat_range ?? "",
    colors: (product.colors ?? []).join(", "),
    status: product.is_active ? "active" : "draft",
    customizable: Boolean(product.is_customizable)
    });
    setManualSlug(product.slug ?? "");
    setTags((product.tags ?? []).map((tag) => tag.name));
    setGallery(
    (product.images ?? []).map((image) => ({
      media_id: image.media_id,
      url: image.url,
      path: image.path,
      is_primary: image.is_primary
    }))
    );
    setOptions(
    (product.options ?? []).map((option) => ({
      id: option.id,
      name: option.name,
      values: option.values.map((value) => ({
        id: value.id,
        value: value.value,
        swatch: value.swatch,
        media_id: value.media_id,
        media_url: value.media_url
      }))
    }))
    );
    setVariants(
    (product.variants ?? []).map((variant) => ({
      id: variant.id,
      options: variant.options ?? {},
      sku: variant.sku ?? "",
      price: variant.price ? String(variant.price) : "",
      stock: String(variant.stock ?? 0),
      media_id: variant.media_id,
      media_url: variant.media_url,
      is_default: variant.is_default,
      is_active: variant.is_active
    }))
    );
  };

  const hydratedProduct = productQuery.data;

  if (hydratedProduct && hydratedId !== hydratedProduct.id) {
    setHydratedId(hydratedProduct.id);
    hydrate(hydratedProduct);
  }


  const derivedSlug = useMemo(() => {
    if (editing) {
      return manualSlug;
    }

    return slugTouched ? manualSlug : slugify(form.name);
  }, [editing, form.name, manualSlug, slugTouched]);

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = {
        name: form.name,
        slug: derivedSlug || undefined,
        category: form.category || undefined,
        subcategory: form.subcategory || undefined,
        description: form.description || null,
        price: form.price === "" ? undefined : Number(form.price),
        compare_at_price: form.compare_at_price === "" ? undefined : Number(form.compare_at_price),
        seat_range: form.seat_range || undefined,
        colors: form.colors
          .split(",")
          .map((color) => color.trim())
          .filter(Boolean),
        status: form.status,
        customizable: form.customizable,
        tags,
        media_ids: gallery.map((entry) => entry.media_id).filter((id): id is number => typeof id === "number"),
        primary_media_id: gallery.find((entry) => entry.is_primary)?.media_id ?? undefined,
        options: options
          .filter((option) => option.name.trim() && option.values.some((value) => value.value.trim()))
          .map((option, index) => ({
            name: option.name.trim(),
            position: index + 1,
            values: option.values
              .filter((value) => value.value.trim())
              .map((value, valueIndex) => ({
                value: value.value.trim(),
                swatch: value.swatch || null,
                media_id: value.media_id ?? null,
                position: valueIndex + 1
              }))
          })),
        variants: variants.map((variant, index) => ({
          sku: variant.sku || undefined,
          price: variant.price === "" ? undefined : Number(variant.price),
          stock: variant.stock === "" ? 0 : Number(variant.stock),
          media_id: variant.media_id ?? null,
          options: variant.options,
          is_default: variant.is_default,
          is_active: variant.is_active,
          position: index + 1
        }))
      };

      return request<AdminProduct>(editing ? `/admin/catalog/products/${slug}` : "/admin/catalog/products", {
        method: editing ? "PATCH" : "POST",
        body: payload
      });
    },
    onSuccess: (product) => {
      setErrors({});
      toast.success(editing ? "Product updated." : "Product created.");
      queryClient.invalidateQueries({ queryKey: ["admin-product"] });
      queryClient.invalidateQueries({ queryKey: ["admin-resource"] });

      if (!editing) {
        router.push(`/admin/products/${product.slug}/edit`);
        return;
      }

      productQuery.refetch();
    },
    onError: (error: Error & { errors?: Record<string, string[]> }) => {
      setErrors(error.errors ?? {});
      toast.error(error.message);
    }
  });

  const addMedia = (items: MediaItem[]) => {
    setGallery((current) => {
      const existing = new Set(current.map((entry) => entry.media_id));
      const additions = items
        .filter((item) => !existing.has(item.id))
        .map((item) => ({ media_id: item.id, url: item.url, path: item.path, is_primary: false }));
      const next = [...current, ...additions];

      if (next.length && !next.some((entry) => entry.is_primary)) {
        next[0] = { ...next[0], is_primary: true };
      }

      return next;
    });
  };

  const removeMedia = (mediaId: number | null, index: number) => {
    setGallery((current) => {
      const next = current.filter((entry, current_index) => (mediaId ? entry.media_id !== mediaId : current_index !== index));

      if (next.length && !next.some((entry) => entry.is_primary)) {
        next[0] = { ...next[0], is_primary: true };
      }

      return next;
    });
  };

  const setPrimary = (index: number) => {
    setGallery((current) => current.map((entry, current_index) => ({ ...entry, is_primary: current_index === index })));
  };

  const fieldError = (key: string) => errors[key]?.[0];

  if (editing && productQuery.isLoading) {
    return <div className="h-96 animate-pulse rounded-lg bg-neutral-200 dark:bg-white/10" />;
  }

  if (editing && productQuery.isError) {
    return (
      <AppCard className="p-6 dark:border-white/10 dark:bg-neutral-900">
        <p className="text-sm text-red-600">{(productQuery.error as Error).message}</p>
        <Link href="/admin/products"><AppButton variant="outline" className="mt-4">Back to products</AppButton></Link>
      </AppCard>
    );
  }

  return (
    <div className="pb-24">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/admin/products" aria-label="Back to products" className="grid size-9 shrink-0 place-items-center rounded-md border border-neutral-300 transition hover:bg-neutral-100 dark:border-white/15 dark:hover:bg-white/10">
            <ArrowLeft className="size-4 rtl:rotate-180" />
          </Link>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">Catalog</p>
            <h1 className="truncate font-serif text-2xl font-bold sm:text-3xl">{editing ? form.name || "Edit product" : "Add product"}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/products"><AppButton type="button" variant="outline">Discard</AppButton></Link>
          <AppButton type="button" loading={saveMutation.isPending} disabled={!form.name.trim()} onClick={() => saveMutation.mutate()}>
            Save
          </AppButton>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px] lg:items-start">
        <div className="min-w-0 space-y-5">
          <AppCard className="p-5 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50 sm:p-6">
            <label htmlFor="product-name" className="mb-2 block text-sm font-semibold">Title</label>
            <input
              id="product-name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Lian"
              className={fieldClass(Boolean(fieldError("name")))}
            />
            {derivedSlug ? <p className="mt-1.5 font-mono text-xs text-neutral-500 dark:text-neutral-400">/{derivedSlug}</p> : null}
            {fieldError("name") ? <p className="mt-1.5 text-sm text-red-600">{fieldError("name")}</p> : null}
            {editing ? (
              <button
                type="button"
                onClick={() => {
                  setSlugTouched(true);
                  const next = window.prompt("Update the product slug", manualSlug);

                  if (next) {
                    setManualSlug(slugify(next));
                  }
                }}
                className="mt-1 text-xs font-semibold text-neutral-600 underline dark:text-neutral-300"
              >
                Edit slug
              </button>
            ) : null}

            <div className="mt-5">
              <span className="mb-2 block text-sm font-semibold">Description</span>
              <AppRichTextEditor
                value={form.description}
                onChange={(value) => setForm((current) => ({ ...current, description: value }))}
                placeholder="Describe the product, materials and comfort"
              />
            </div>
          </AppCard>

          <AppCard className="p-5 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-serif text-xl font-bold">Media</h2>
              <AppButton type="button" size="sm" variant="outline" className="gap-2" onClick={() => setPickerOpen(true)}>
                <ImagePlus className="size-4" /> Select from media
              </AppButton>
            </div>

            {gallery.length === 0 ? (
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="mt-4 grid w-full place-items-center gap-2 rounded-lg border border-dashed border-neutral-300 p-10 text-center transition hover:border-neutral-950 dark:border-white/15"
              >
                <ImagePlus className="size-6 text-neutral-400" />
                <span className="text-sm text-neutral-600 dark:text-neutral-300">Add images from the media library</span>
              </button>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {gallery.map((entry, index) => (
                  <div key={`${entry.media_id ?? entry.path}-${index}`} className="group relative overflow-hidden rounded-md border border-neutral-200 dark:border-white/10">
                    <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-800">
                      {entry.url ? <Image src={entry.url} alt="Product image" fill sizes="200px" className="object-cover" /> : null}
                    </div>
                    <div className="absolute inset-x-1 top-1 flex items-center justify-between">
                      <button
                        type="button"
                        aria-label="Set as primary image"
                        onClick={() => setPrimary(index)}
                        className={cn(
                          "grid size-7 place-items-center rounded-full bg-white/90 transition",
                          entry.is_primary ? "text-amber-500" : "text-neutral-400 hover:text-neutral-900"
                        )}
                      >
                        <Star className={cn("size-3.5", entry.is_primary && "fill-current")} />
                      </button>
                      <button
                        type="button"
                        aria-label="Remove image"
                        onClick={() => removeMedia(entry.media_id, index)}
                        className="grid size-7 place-items-center rounded-full bg-white/90 text-neutral-500 transition hover:text-red-600"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                    {entry.is_primary ? (
                      <span className="absolute inset-x-0 bottom-0 bg-neutral-950/80 py-1 text-center text-[10px] font-bold uppercase tracking-wide text-white">Primary</span>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </AppCard>

          <AppCard className="p-5 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50 sm:p-6">
            <h2 className="font-serif text-xl font-bold">Pricing</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="product-price" className="mb-2 block text-sm font-semibold">Price</label>
                <input id="product-price" value={form.price} inputMode="decimal" onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} placeholder="0.00" className={fieldClass(Boolean(fieldError("price")))} />
              </div>
              <div>
                <label htmlFor="product-compare" className="mb-2 block text-sm font-semibold">Compare at price</label>
                <input id="product-compare" value={form.compare_at_price} inputMode="decimal" onChange={(event) => setForm((current) => ({ ...current, compare_at_price: event.target.value }))} placeholder="0.00" className={fieldClass()} />
              </div>
            </div>
          </AppCard>

          <VariantEditor options={options} variants={variants} onOptionsChange={setOptions} onVariantsChange={setVariants} />
        </div>

        <div className="space-y-5">
          <AppCard className="p-5 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50">
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">Status</h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{form.status === "active" ? "Active" : "Draft"}</p>
                  <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                    {form.status === "active" ? "Visible on the storefront" : "Hidden from the storefront"}
                  </p>
                </div>
                <AppSwitch
                  checked={form.status === "active"}
                  aria-label="Toggle product status"
                  onClick={() => setForm((current) => ({ ...current, status: current.status === "active" ? "draft" : "active" }))}
                />
              </div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{form.customizable ? "Customizable" : "Fixed product"}</p>
                  <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                    {form.customizable ? "Continues into the customizer" : "Sold as shown"}
                  </p>
                </div>
                <AppSwitch
                  checked={form.customizable}
                  aria-label="Toggle customizable"
                  onClick={() => setForm((current) => ({ ...current, customizable: !current.customizable }))}
                />
              </div>
            </div>
          </AppCard>

          <AppCard className="p-5 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50">
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">Organization</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="product-category" className="mb-2 block text-sm font-semibold">Category</label>
                <input id="product-category" value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} placeholder="Sofas" className={fieldClass()} />
              </div>
              <div>
                <label htmlFor="product-subcategory" className="mb-2 block text-sm font-semibold">Subcategory</label>
                <input id="product-subcategory" value={form.subcategory} onChange={(event) => setForm((current) => ({ ...current, subcategory: event.target.value }))} placeholder="Modular Sofas" className={fieldClass()} />
              </div>
              <div>
                <span className="mb-2 block text-sm font-semibold">Tags</span>
                <AppTagInput value={tags} onChange={setTags} suggestions={tagSuggestions} />
              </div>
            </div>
          </AppCard>

          <AppCard className="p-5 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50">
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">Details</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="product-seat" className="mb-2 block text-sm font-semibold">Seat range</label>
                <input id="product-seat" value={form.seat_range} onChange={(event) => setForm((current) => ({ ...current, seat_range: event.target.value }))} placeholder="3-4 Seater" className={fieldClass()} />
              </div>
              <div>
                <label htmlFor="product-colors" className="mb-2 block text-sm font-semibold">Color hex codes</label>
                <input id="product-colors" value={form.colors} onChange={(event) => setForm((current) => ({ ...current, colors: event.target.value }))} placeholder="#eee9df, #705d49" className={fieldClass()} />
              </div>
            </div>
          </AppCard>
        </div>
      </div>

      <MediaPicker open={pickerOpen} onOpenChange={setPickerOpen} onSelect={addMedia} folder="products" />
    </div>
  );
}
