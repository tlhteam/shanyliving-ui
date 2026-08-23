"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ArrowLeft, ImagePlus, Lock, Star, Trash2 } from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppRichTextEditor } from "@/components/app/AppRichTextEditor";
import { AppSwitch } from "@/components/app/AppSwitch";
import { AppTagInput } from "@/components/app/AppTagInput";
import { MediaPicker } from "@/components/admin/MediaPicker";
import {
  VariantEditor,
  buildCombinations,
  variantKey,
} from "@/components/admin/products/VariantEditor";
import { useApi } from "@/hooks/use-api";
import { localeOptions } from "@/i18n/config";
import { cn } from "@/lib/utils";
import type {
  AdminProduct,
  ProductOptionDraft,
  ProductTranslationDraft,
  ProductVariantDraft,
} from "@/types/product";
import type { MediaItem } from "@/types/media";

type GalleryEntry = {
  media_id: number | null;
  url: string | null;
  path: string | null;
  is_primary: boolean;
};
function SortableGalleryItem({
  entry,
  index,
  onSetPrimary,
  onRemove,
}: {
  entry: GalleryEntry;
  index: number;
  onSetPrimary: (index: number) => void;
  onRemove: (mediaId: number | null, index: number) => void;
}) {
  const t = useTranslations("adminPanel.productEditor");
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: entry.media_id ?? `gallery-${index}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        "group relative overflow-hidden rounded-md border border-neutral-200 dark:border-white/10",
        isDragging && "z-10 opacity-70 shadow-lg",
      )}
    >
      <div
        {...listeners}
        className="relative aspect-square cursor-grab bg-neutral-100 active:cursor-grabbing dark:bg-neutral-800"
      >
        {entry.url ? (
          <Image
            src={entry.url}
            alt={t("imageAlt")}
            fill
            sizes="200px"
            className="object-cover"
          />
        ) : null}
      </div>

      <div className="absolute inset-x-1 top-1 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label={t("setPrimary")}
            onClick={() => onSetPrimary(index)}
            className={cn(
              "grid size-7 place-items-center rounded-full bg-white/90 transition",
              entry.is_primary
                ? "text-amber-500"
                : "text-neutral-400 hover:text-neutral-900",
            )}
          >
            <Star
              className={cn("size-3.5", entry.is_primary && "fill-current")}
            />
          </button>

          {entry.is_primary ? (
            <span className="rounded-full bg-neutral-950/85 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-white">
              {t("primary")}
            </span>
          ) : null}
        </div>

        <button
          type="button"
          aria-label={t("removeImage")}
          onClick={() => onRemove(entry.media_id, index)}
          className="grid size-7 place-items-center rounded-full bg-white/90 text-neutral-500 transition hover:text-red-600"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
type ProductForm = {
  name: string;
  category: string;
  subcategory: string;
  description: string;
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
  price: "",
  compare_at_price: "",
  seat_range: "",
  colors: "",
  status: "active",
  customizable: true,
};

const emptyTranslation: ProductTranslationDraft = {
  name: "",
  description: "",
  subcategory: "",
  seat_range: "",
};

const tagSuggestions = [
  "sofa",
  "customizable",
  "new arrival",
  "best seller",
  "showroom pick",
  "living room",
  "dining",
  "bedroom",
];

const defaultOptions: ProductOptionDraft[] = [
  {
    name: "Size",
    values: [
      { value: "2.4m", swatch: null, media_id: null, media_url: null },
      { value: "2.8m", swatch: null, media_id: null, media_url: null },
    ],
  },
  {
    name: "Configuration",
    values: [
      { value: "Left chaise", swatch: null, media_id: null, media_url: null },
      { value: "Right chaise", swatch: null, media_id: null, media_url: null },
    ],
  },
  {
    name: "Fabric",
    values: [
      { value: "Boucle", swatch: null, media_id: null, media_url: null },
      {
        value: "Performance Linen",
        swatch: null,
        media_id: null,
        media_url: null,
      },
    ],
  },
  {
    name: "Color",
    values: [
      {
        value: "Warm Beige",
        swatch: "#e2d6c3",
        media_id: null,
        media_url: null,
      },
      { value: "Charcoal", swatch: "#3a3a3a", media_id: null, media_url: null },
    ],
  },
];

function defaultVariants(): ProductVariantDraft[] {
  return buildCombinations(defaultOptions).map((combination, index) => ({
    options: combination,
    sku: "",
    price: "",
    stock: "0",
    media_id: null,
    media_url: null,
    is_default: index === 0,
    is_active: true,
  }));
}

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
    invalid ? "border-red-400" : "border-neutral-300 dark:border-white/15",
  );
}

export function ProductEditor({ slug }: { slug?: string }) {
  const t = useTranslations("adminPanel.productEditor");
  const router = useRouter();
  const { request, token } = useApi();
  const queryClient = useQueryClient();
  const editing = Boolean(slug);

  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [savedSlug, setSavedSlug] = useState(slug ?? "");
  const [tags, setTags] = useState<string[]>([]);
  const [gallery, setGallery] = useState<GalleryEntry[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );
  const [options, setOptions] = useState<ProductOptionDraft[]>(() =>
    slug ? [] : defaultOptions,
  );

  const [variants, setVariants] = useState<ProductVariantDraft[]>(() =>
    slug ? [] : defaultVariants(),
  );
  const [translations, setTranslations] = useState<
    Record<string, ProductTranslationDraft>
  >({});
  const [activeLocale, setActiveLocale] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [hydratedId, setHydratedId] = useState<number | null>(null);

  const productQuery = useQuery({
    queryKey: ["admin-product", slug],
    enabled: editing && Boolean(token),
    queryFn: () => request<AdminProduct>(`/admin/catalog/products/${slug}`),
  });

  const hydrate = (product: AdminProduct) => {
    setForm({
      name: product.name ?? "",
      category: product.category?.name ?? "",
      subcategory: product.subcategory ?? "",
      description: product.description ?? "",
      price: product.price ? String(product.price) : "",
      compare_at_price: product.compare_at_price
        ? String(product.compare_at_price)
        : "",
      seat_range: product.seat_range ?? "",
      colors: (product.colors ?? []).join(", "),
      status: product.is_active ? "active" : "draft",
      customizable: Boolean(product.is_customizable),
    });

    setSavedSlug(product.slug ?? "");
    setTags((product.tags ?? []).map((tag) => tag.name));

    setGallery(
      (product.images ?? []).map((image) => ({
        media_id: image.media_id,
        url: image.url,
        path: image.path,
        is_primary: image.is_primary,
      })),
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
          media_url: value.media_url,
        })),
      })),
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
        is_active: variant.is_active,
      })),
    );

    setTranslations(
      Object.fromEntries(
        Object.entries(product.translations ?? {}).map(
          ([locale, translation]) => [
            locale,
            {
              name: translation.name ?? "",
              description: translation.description ?? "",
              subcategory: translation.subcategory ?? "",
              seat_range: translation.seat_range ?? "",
            },
          ],
        ),
      ),
    );
  };

  const hydratedProduct = productQuery.data;

  if (hydratedProduct && hydratedProduct.id !== hydratedId) {
    setHydratedId(hydratedProduct.id);
    hydrate(hydratedProduct);
  }

  const derivedSlug = useMemo(
    () => (editing ? savedSlug : slugify(form.name)),
    [editing, form.name, savedSlug],
  );

  const translation = translations[activeLocale] ?? emptyTranslation;

  const updateTranslation = (patch: Partial<ProductTranslationDraft>) => {
    setTranslations((current) => ({
      ...current,
      [activeLocale]: {
        ...(current[activeLocale] ?? emptyTranslation),
        ...patch,
      },
    }));
  };

  const translatedLocales = localeOptions.filter((option) => {
    const entry = translations[option.locale];

    return entry ? Object.values(entry).some(Boolean) : false;
  });

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = {
        name: form.name,
        category: form.category || undefined,
        subcategory: form.subcategory || undefined,
        description: form.description || null,
        price: form.price === "" ? undefined : Number(form.price),
        compare_at_price:
          form.compare_at_price === ""
            ? undefined
            : Number(form.compare_at_price),
        seat_range: form.seat_range || undefined,
        colors: form.colors
          .split(",")
          .map((color) => color.trim())
          .filter(Boolean),
        status: form.status,
        customizable: form.customizable,
        tags,
        media_ids: gallery
          .map((entry) => entry.media_id)
          .filter((id): id is number => typeof id === "number"),

        primary_media_id:
          gallery.find((entry) => entry.is_primary)?.media_id ?? undefined,

        translations: localeOptions.map((option) => ({
          locale: option.locale,
          ...(translations[option.locale] ?? emptyTranslation),
        })),
        options: options
          .filter(
            (option) =>
              option.name.trim() &&
              option.values.some((value) => value.value.trim()),
          )
          .map((option, index) => ({
            name: option.name.trim(),
            position: index + 1,
            values: option.values
              .filter((value) => value.value.trim())
              .map((value, valueIndex) => ({
                value: value.value.trim(),
                swatch: value.swatch || null,
                media_id: value.media_id ?? null,
                position: valueIndex + 1,
              })),
          })),
        variants: variants.map((variant, index) => ({
          sku: variant.sku || undefined,
          price: variant.price === "" ? undefined : Number(variant.price),
          stock: variant.stock === "" ? 0 : Number(variant.stock),
          media_id: variant.media_id ?? null,
          options: variant.options,
          is_default: variant.is_default,
          is_active: variant.is_active,
          position: index + 1,
        })),
      };

      return request<AdminProduct>(
        editing
          ? `/admin/catalog/products/${savedSlug}`
          : "/admin/catalog/products",
        {
          method: editing ? "PATCH" : "POST",
          body: payload,
        },
      );
    },
    onSuccess: (product) => {
      setErrors({});
      toast.success(editing ? t("updated") : t("created"), {
        description: `${product.name} / ${product.variants?.length ?? 0} variants saved.`,
        action: {
          label: t("viewOnStorefront"),
          onClick: () => window.open(`/sofas/${product.slug}`, "_blank"),
        },
      });
      queryClient.invalidateQueries({ queryKey: ["admin-product"] });
      queryClient.invalidateQueries({ queryKey: ["admin-resource"] });

      if (!editing || product.slug !== savedSlug) {
        router.replace(`/admin/products/${product.slug}/edit`);
        return;
      }

      productQuery.refetch();
    },
    onError: (error: Error & { errors?: Record<string, string[]> }) => {
      setErrors(error.errors ?? {});
      toast.error(error.message, {
        action: { label: t("tryAgain"), onClick: () => saveMutation.mutate() },
      });
    },
  });

  const addMedia = (items: MediaItem[]) => {
    setGallery((current) => {
      const existing = new Set(current.map((entry) => entry.media_id));
      const additions = items
        .filter((item) => !existing.has(item.id))
        .map((item) => ({
          media_id: item.id,
          url: item.url,
          path: item.path,
          color: null,
          is_primary: false,
        }));
      const next = [...current, ...additions];

      if (next.length && !next.some((entry) => entry.is_primary)) {
        next[0] = { ...next[0], is_primary: true };
      }

      return next;
    });
  };

  const removeMedia = (mediaId: number | null, index: number) => {
    setGallery((current) => {
      const next = current.filter((entry, currentIndex) =>
        mediaId ? entry.media_id !== mediaId : currentIndex !== index,
      );

      if (next.length && !next.some((entry) => entry.is_primary)) {
        next[0] = { ...next[0], is_primary: true };
      }

      return next;
    });
  };

  const setPrimary = (index: number) => {
    setGallery((current) =>
      current.map((entry, currentIndex) => ({
        ...entry,
        is_primary: currentIndex === index,
      })),
    );
  };

  const handleGalleryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setGallery((current) => {
      const oldIndex = current.findIndex(
        (entry, index) => (entry.media_id ?? `gallery-${index}`) === active.id,
      );

      const newIndex = current.findIndex(
        (entry, index) => (entry.media_id ?? `gallery-${index}`) === over.id,
      );

      if (oldIndex === -1 || newIndex === -1) {
        return current;
      }

      return arrayMove(current, oldIndex, newIndex);
    });
  };
  const applyDefaultVariants = () => {
    const existing = new Map(
      variants.map((variant) => [variantKey(variant.options), variant]),
    );
    setOptions(defaultOptions);
    setVariants(
      defaultVariants().map(
        (variant) => existing.get(variantKey(variant.options)) ?? variant,
      ),
    );
    toast.success(t("defaultsApplied"));
  };

  const fieldError = (key: string) => errors[key]?.[0];

  if (editing && productQuery.isLoading) {
    return (
      <div className="h-96 animate-pulse rounded-lg bg-neutral-200 dark:bg-white/10" />
    );
  }

  if (editing && productQuery.isError) {
    return (
      <AppCard className="p-6 dark:border-white/10 dark:bg-neutral-900">
        <p className="text-sm text-red-600">
          {(productQuery.error as Error).message}
        </p>
        <Link href="/admin/products">
          <AppButton variant="outline" className="mt-4">
            {t("back")}
          </AppButton>
        </Link>
      </AppCard>
    );
  }

  return (
    <div className="pb-24">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 sm:mb-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Link
            href="/admin/products"
            aria-label={t("back")}
            className="grid size-9 shrink-0 place-items-center rounded-md border border-neutral-300 transition hover:bg-neutral-100 dark:border-white/15 dark:hover:bg-white/10"
          >
            <ArrowLeft className="size-4 rtl:rotate-180" />
          </Link>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              {t("eyebrow")}
            </p>
            <h1 className="truncate font-serif text-xl font-bold sm:text-3xl">
              {editing ? form.name || t("editTitle") : t("addTitle")}
            </h1>
          </div>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Link href="/admin/products" className="flex-1 sm:flex-none">
            <AppButton
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
            >
              {t("discard")}
            </AppButton>
          </Link>
          <AppButton
            type="button"
            loading={saveMutation.isPending}
            disabled={!form.name.trim()}
            onClick={() => saveMutation.mutate()}
            className="flex-1 sm:flex-none"
          >
            {t("save")}
          </AppButton>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="min-w-0 space-y-5">
          <AppCard className="p-4 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50 sm:p-6">
            <div className="-mx-1 mb-4 flex gap-1.5 overflow-x-auto px-1 pb-1">
              <button
                type="button"
                onClick={() => setActiveLocale("")}
                className={cn(
                  "h-9 shrink-0 rounded-full border px-4 text-xs font-bold transition",
                  activeLocale === ""
                    ? "border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950"
                    : "border-neutral-300 hover:border-neutral-950 dark:border-white/15",
                )}
              >
                {t("defaultTab")}
              </button>
              {localeOptions.map((option) => (
                <button
                  key={option.locale}
                  type="button"
                  onClick={() => setActiveLocale(option.locale)}
                  className={cn(
                    "h-9 shrink-0 rounded-full border px-4 text-xs font-bold transition",
                    activeLocale === option.locale
                      ? "border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950"
                      : "border-neutral-300 hover:border-neutral-950 dark:border-white/15",
                  )}
                >
                  {option.short}
                  {translatedLocales.some(
                    (locale) => locale.locale === option.locale,
                  ) ? (
                    <span className="ms-1.5 inline-block size-1.5 rounded-full bg-emerald-500 align-middle" />
                  ) : null}
                </button>
              ))}
            </div>

            {activeLocale ? (
              <p className="mb-4 rounded-md bg-neutral-100 p-3 text-xs leading-5 text-neutral-700 dark:bg-white/10 dark:text-neutral-300">
                {t("localeNotice", {
                  locale:
                    localeOptions.find(
                      (option) => option.locale === activeLocale,
                    )?.label ?? activeLocale,
                })}
              </p>
            ) : null}

            <label
              htmlFor="product-name"
              className="mb-2 block text-sm font-semibold"
            >
              {t("title")}
            </label>
            <input
              id="product-name"
              dir={activeLocale === "he" ? "rtl" : undefined}
              value={activeLocale ? translation.name : form.name}
              onChange={(event) =>
                activeLocale
                  ? updateTranslation({ name: event.target.value })
                  : setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
              }
              placeholder={
                activeLocale
                  ? form.name || t("translatedTitlePlaceholder")
                  : "Lian"
              }
              className={fieldClass(Boolean(fieldError("name")))}
            />
            {fieldError("name") ? (
              <p className="mt-1.5 text-sm text-red-600">
                {fieldError("name")}
              </p>
            ) : null}

            <div className="mt-3 flex items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-white/10 dark:bg-white/5">
              <Lock className="size-3.5 shrink-0 text-neutral-500" />
              <span className="min-w-0 flex-1 truncate font-mono text-xs text-neutral-600 dark:text-neutral-300">
                /{derivedSlug || t("slugPlaceholder")}
              </span>
              <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                {t("auto")}
              </span>
            </div>

            <div className="mt-5">
              <span className="mb-2 block text-sm font-semibold">
                {t("description")}
              </span>
              <AppRichTextEditor
                value={
                  activeLocale ? translation.description : form.description
                }
                onChange={(value) =>
                  activeLocale
                    ? updateTranslation({ description: value })
                    : setForm((current) => ({ ...current, description: value }))
                }
                placeholder={t("descriptionPlaceholder")}
              />
            </div>
          </AppCard>

          <AppCard className="p-4 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-serif text-lg font-bold sm:text-xl">
                {t("media")}
              </h2>
              <AppButton
                type="button"
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={() => setPickerOpen(true)}
              >
                <ImagePlus className="size-4" />
                {t("selectMedia")}
              </AppButton>
            </div>

            {gallery.length === 0 ? (
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="mt-4 grid w-full place-items-center gap-2 rounded-lg border border-dashed border-neutral-300 p-8 text-center transition hover:border-neutral-950 dark:border-white/15 sm:p-10"
              >
                <ImagePlus className="size-6 text-neutral-400" />
                <span className="text-sm text-neutral-600 dark:text-neutral-300">
                  {t("mediaEmpty")}
                </span>
              </button>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleGalleryDragEnd}
              >
                <SortableContext
                  items={gallery.map(
                    (entry, index) => entry.media_id ?? `gallery-${index}`,
                  )}
                  strategy={rectSortingStrategy}
                >
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {gallery.map((entry, index) => (
                      <SortableGalleryItem
                        key={`${entry.media_id ?? entry.path}-${index}`}
                        entry={entry}
                        index={index}
                        onSetPrimary={setPrimary}
                        onRemove={removeMedia}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </AppCard>

          <AppCard className="p-4 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50 sm:p-6">
            <h2 className="font-serif text-lg font-bold sm:text-xl">
              {t("pricing")}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="product-price"
                  className="mb-2 block text-sm font-semibold"
                >
                  {t("price")}
                </label>
                <input
                  id="product-price"
                  value={form.price}
                  inputMode="decimal"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      price: event.target.value,
                    }))
                  }
                  placeholder="0.00"
                  className={fieldClass(Boolean(fieldError("price")))}
                />
              </div>
              <div>
                <label
                  htmlFor="product-compare"
                  className="mb-2 block text-sm font-semibold"
                >
                  {t("compareAt")}
                </label>
                <input
                  id="product-compare"
                  value={form.compare_at_price}
                  inputMode="decimal"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      compare_at_price: event.target.value,
                    }))
                  }
                  placeholder="0.00"
                  className={fieldClass()}
                />
              </div>
            </div>
          </AppCard>

          <VariantEditor
            options={options}
            variants={variants}
            onOptionsChange={setOptions}
            onVariantsChange={setVariants}
          />
        </div>

        <div className="space-y-5">
          <AppCard className="p-4 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50 sm:p-5">
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
              {t("status")}
            </h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">
                    {form.status === "active" ? t("active") : t("draft")}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                    {form.status === "active"
                      ? t("activeHint")
                      : t("draftHint")}
                  </p>
                </div>
                <AppSwitch
                  checked={form.status === "active"}
                  aria-label={t("toggleStatus")}
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      status: current.status === "active" ? "draft" : "active",
                    }))
                  }
                />
              </div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">
                    {form.customizable ? t("customizable") : t("fixed")}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                    {form.customizable ? t("customizableHint") : t("fixedHint")}
                  </p>
                </div>
                <AppSwitch
                  checked={form.customizable}
                  aria-label={t("toggleCustomizable")}
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      customizable: !current.customizable,
                    }))
                  }
                />
              </div>
            </div>
          </AppCard>

          <AppCard className="p-4 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50 sm:p-5">
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
              {t("variantDefaults")}
            </h2>
            <p className="mt-2 text-xs leading-5 text-neutral-600 dark:text-neutral-300">
              {t("variantDefaultsHint")}
            </p>
            <AppButton
              type="button"
              size="sm"
              variant="outline"
              className="mt-3 w-full"
              onClick={applyDefaultVariants}
            >
              {t("applyDefaults")}
            </AppButton>
          </AppCard>

          <AppCard className="p-4 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50 sm:p-5">
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
              {t("organization")}
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="product-category"
                  className="mb-2 block text-sm font-semibold"
                >
                  {t("category")}
                </label>
                <input
                  id="product-category"
                  value={form.category}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      category: event.target.value,
                    }))
                  }
                  placeholder={t("categoryPlaceholder")}
                  className={fieldClass()}
                />
              </div>
              <div>
                <label
                  htmlFor="product-subcategory"
                  className="mb-2 block text-sm font-semibold"
                >
                  {t("subcategory")}
                  {activeLocale ? ` (${activeLocale.toUpperCase()})` : ""}
                </label>
                <input
                  id="product-subcategory"
                  dir={activeLocale === "he" ? "rtl" : undefined}
                  value={
                    activeLocale ? translation.subcategory : form.subcategory
                  }
                  onChange={(event) =>
                    activeLocale
                      ? updateTranslation({ subcategory: event.target.value })
                      : setForm((current) => ({
                          ...current,
                          subcategory: event.target.value,
                        }))
                  }
                  placeholder={t("subcategoryPlaceholder")}
                  className={fieldClass()}
                />
              </div>
              <div>
                <span className="mb-2 block text-sm font-semibold">
                  {t("tags")}
                </span>
                <AppTagInput
                  value={tags}
                  onChange={setTags}
                  suggestions={tagSuggestions}
                />
              </div>
            </div>
          </AppCard>

          <AppCard className="p-4 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50 sm:p-5">
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
              {t("details")}
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="product-seat"
                  className="mb-2 block text-sm font-semibold"
                >
                  {t("seatRange")}
                  {activeLocale ? ` (${activeLocale.toUpperCase()})` : ""}
                </label>
                <input
                  id="product-seat"
                  dir={activeLocale === "he" ? "rtl" : undefined}
                  value={
                    activeLocale ? translation.seat_range : form.seat_range
                  }
                  onChange={(event) =>
                    activeLocale
                      ? updateTranslation({ seat_range: event.target.value })
                      : setForm((current) => ({
                          ...current,
                          seat_range: event.target.value,
                        }))
                  }
                  placeholder={t("seatRangePlaceholder")}
                  className={fieldClass()}
                />
              </div>
              <div>
                <label
                  htmlFor="product-colors"
                  className="mb-2 block text-sm font-semibold"
                >
                  {t("colors")}
                </label>
                <input
                  id="product-colors"
                  value={form.colors}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      colors: event.target.value,
                    }))
                  }
                  placeholder="#eee9df, #705d49"
                  className={fieldClass()}
                />
              </div>
            </div>
          </AppCard>
        </div>
      </div>

      <MediaPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={addMedia}
        folder="products"
      />
    </div>
  );
}
