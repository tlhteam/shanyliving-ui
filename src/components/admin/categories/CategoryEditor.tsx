"use client";

import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ArrowDown, ArrowLeft, ArrowUp, ImagePlus, Trash2, X } from "lucide-react";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppSwitch } from "@/components/app/AppSwitch";
import { useApi } from "@/hooks/use-api";
import { localeOptions } from "@/i18n/config";
import { cn } from "@/lib/utils";
import type { AdminCategory, CatalogCategoryProduct, CatalogProduct } from "@/lib/catalog";
import type { Paginated } from "@/lib/api-client";

type TranslationDraft = {
  name: string;
  description: string;
  hero_eyebrow: string;
  hero_title: string;
  hero_description: string;
  content: string;
};

const emptyTranslation: TranslationDraft = {
  name: "",
  description: "",
  hero_eyebrow: "",
  hero_title: "",
  hero_description: "",
  content: ""
};

const fieldClass =
  "w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-white";

type DraftSource = Partial<Record<keyof TranslationDraft, string | null | undefined>>;

function toDraft(value?: DraftSource | null): TranslationDraft {
  return {
    name: value?.name ?? "",
    description: value?.description ?? "",
    hero_eyebrow: value?.hero_eyebrow ?? "",
    hero_title: value?.hero_title ?? "",
    hero_description: value?.hero_description ?? "",
    content: value?.content ?? ""
  };
}

export function CategoryEditor({ slug }: { slug: string }) {
  const t = useTranslations("adminPanel.categoryEditor");
  const tt = useTranslations("adminPanel.table");
  const { request, token } = useApi();
  const queryClient = useQueryClient();
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [hydratedSlug, setHydratedSlug] = useState<string | null>(null);
  const [activeLocale, setActiveLocale] = useState("");
  const [form, setForm] = useState({ name: "", slug: "", sort_order: "0", is_active: true });
  const [base, setBase] = useState<TranslationDraft>(emptyTranslation);
  const [translations, setTranslations] = useState<Record<string, TranslationDraft>>({});
  const [products, setProducts] = useState<CatalogCategoryProduct[]>([]);
  const [productToAdd, setProductToAdd] = useState("");

  const categoryQuery = useQuery({
    queryKey: ["admin-category", slug, token],
    queryFn: () => request<AdminCategory>(`/admin/catalog/categories/${slug}`),
    enabled: Boolean(token)
  });

  const productsQuery = useQuery({
    queryKey: ["admin-products-picker", token],
    queryFn: () => request<Paginated<CatalogProduct>>("/admin/catalog/products", { query: { per_page: 48 } }),
    enabled: Boolean(token)
  });

  const category = categoryQuery.data;

  if (category && hydratedSlug !== category.slug) {
    setHydratedSlug(category.slug);
    setForm({
      name: category.name ?? "",
      slug: category.slug ?? "",
      sort_order: String(category.sort_order ?? 0),
      is_active: category.is_active !== false
    });
    setBase(
      toDraft({
        name: category.name ?? "",
        description: category.description ?? "",
        hero_eyebrow: category.hero_eyebrow ?? "",
        hero_title: category.hero_title ?? "",
        hero_description: category.hero_description ?? "",
        content: category.content ?? ""
      })
    );
    setTranslations(
      Object.fromEntries((category.translations ?? []).map((entry) => [entry.locale, toDraft(entry)]))
    );
    setProducts(category.products ?? []);
  }

  const draft = activeLocale ? (translations[activeLocale] ?? emptyTranslation) : base;

  const setField = (field: keyof TranslationDraft, value: string) => {
    if (!activeLocale) {
      setBase((current) => ({ ...current, [field]: value }));

      if (field === "name") {
        setForm((current) => ({ ...current, name: value }));
      }

      return;
    }

    setTranslations((current) => ({
      ...current,
      [activeLocale]: { ...(current[activeLocale] ?? emptyTranslation), [field]: value }
    }));
  };

  const translatedLocales = localeOptions.filter((option) =>
    Object.values(translations[option.locale] ?? {}).some(Boolean)
  );

  const assignable = useMemo(() => {
    const taken = new Set(products.map((product) => product.id));

    return (productsQuery.data?.data ?? []).filter((product) => !taken.has(Number(product.id)));
  }, [products, productsQuery.data]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      await request<AdminCategory>(`/admin/catalog/categories/${slug}`, {
        method: "PATCH",
        body: {
          name: form.name,
          slug: form.slug || undefined,
          description: base.description || null,
          hero_eyebrow: base.hero_eyebrow || null,
          hero_title: base.hero_title || null,
          hero_description: base.hero_description || null,
          content: base.content || null,
          sort_order: Number(form.sort_order) || 0,
          is_active: form.is_active
        }
      });

      await request<AdminCategory>(`/admin/catalog/categories/${slug}/translations`, {
        method: "PUT",
        body: {
          translations: localeOptions.map((option) => ({
            locale: option.locale,
            ...(translations[option.locale] ?? emptyTranslation)
          }))
        }
      });

      return request<AdminCategory>(`/admin/catalog/categories/${slug}/products`, {
        method: "PUT",
        body: { products: products.map((product) => product.id) }
      });
    },
    onSuccess: (saved) => {
      setHydratedSlug(null);
      queryClient.setQueryData(["admin-category", slug, token], saved);
      queryClient.invalidateQueries({ queryKey: ["admin-category", slug] });
      toast.success(t("saved"));
    },
    onError: (error: Error) => toast.error(error.message)
  });

  const bannerMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      return request<AdminCategory>(`/admin/catalog/categories/${slug}/banner`, { method: "POST", formData });
    },
    onSuccess: (saved) => {
      setHydratedSlug(null);
      queryClient.setQueryData(["admin-category", slug, token], saved);
      toast.success(t("bannerSaved"));
    },
    onError: (error: Error) => toast.error(error.message)
  });

  const removeBannerMutation = useMutation({
    mutationFn: () => request<AdminCategory>(`/admin/catalog/categories/${slug}/banner`, { method: "DELETE" }),
    onSuccess: (saved) => {
      setHydratedSlug(null);
      queryClient.setQueryData(["admin-category", slug, token], saved);
      toast.success(t("bannerRemoved"));
    },
    onError: (error: Error) => toast.error(error.message)
  });

  const moveProduct = (index: number, offset: number) => {
    const target = index + offset;

    if (target < 0 || target >= products.length) {
      return;
    }

    setProducts((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];

      return next;
    });
  };

  const addProduct = () => {
    const found = (productsQuery.data?.data ?? []).find((product) => String(product.id) === productToAdd);

    if (!found) {
      return;
    }

    setProducts((current) => [
      ...current,
      {
        id: Number(found.id),
        name: found.name,
        slug: found.slug,
        sku: found.sku ?? null,
        price: found.price ?? null,
        sort_order: current.length + 1,
        is_active: true,
        image_url: found.image_url ?? null
      }
    ]);
    setProductToAdd("");
  };

  if (categoryQuery.isLoading) {
    return <p className="p-4 text-sm text-neutral-600 dark:text-neutral-400">{tt("loading")}</p>;
  }

  if (categoryQuery.isError) {
    return (
      <div className="p-4">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">{tt("loadFailed")}</p>
        <AppButton type="button" variant="outline" className="mt-3" onClick={() => categoryQuery.refetch()}>
          {tt("retry")}
        </AppButton>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 sm:mb-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Link
            href="/admin/categories"
            aria-label={t("back")}
            className="grid size-9 shrink-0 place-items-center rounded-md border border-neutral-300 transition hover:bg-neutral-100 dark:border-white/15 dark:hover:bg-white/10"
          >
            <ArrowLeft className="size-4 rtl:rotate-180" />
          </Link>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              {t("eyebrow")}
            </p>
            <h1 className="truncate font-serif text-xl font-bold sm:text-3xl">{form.name || t("title")}</h1>
          </div>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Link href="/admin/categories" className="flex-1 sm:flex-none">
            <AppButton type="button" variant="outline" className="w-full sm:w-auto">
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
                    : "border-neutral-300 hover:border-neutral-950 dark:border-white/15"
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
                      : "border-neutral-300 hover:border-neutral-950 dark:border-white/15"
                  )}
                >
                  {option.short}
                  {translatedLocales.some((locale) => locale.locale === option.locale) ? (
                    <span className="ms-1.5 inline-block size-1.5 rounded-full bg-emerald-500 align-middle" />
                  ) : null}
                </button>
              ))}
            </div>

            {activeLocale ? (
              <p className="mb-4 rounded-md bg-neutral-100 p-3 text-xs leading-5 text-neutral-700 dark:bg-white/10 dark:text-neutral-300">
                {t("localeNotice", {
                  locale: localeOptions.find((option) => option.locale === activeLocale)?.label ?? activeLocale
                })}
              </p>
            ) : null}

            <div className="space-y-4" dir={activeLocale === "he" ? "rtl" : undefined}>
              <div>
                <label htmlFor="category-name" className="mb-2 block text-sm font-semibold">
                  {t("fields.name")}
                </label>
                <input
                  id="category-name"
                  value={draft.name}
                  onChange={(event) => setField("name", event.target.value)}
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="category-eyebrow" className="mb-2 block text-sm font-semibold">
                  {t("fields.heroEyebrow")}
                </label>
                <input
                  id="category-eyebrow"
                  value={draft.hero_eyebrow}
                  onChange={(event) => setField("hero_eyebrow", event.target.value)}
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="category-hero-title" className="mb-2 block text-sm font-semibold">
                  {t("fields.heroTitle")}
                </label>
                <input
                  id="category-hero-title"
                  value={draft.hero_title}
                  onChange={(event) => setField("hero_title", event.target.value)}
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="category-hero-description" className="mb-2 block text-sm font-semibold">
                  {t("fields.heroDescription")}
                </label>
                <textarea
                  id="category-hero-description"
                  rows={3}
                  value={draft.hero_description}
                  onChange={(event) => setField("hero_description", event.target.value)}
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="category-description" className="mb-2 block text-sm font-semibold">
                  {t("fields.description")}
                </label>
                <textarea
                  id="category-description"
                  rows={3}
                  value={draft.description}
                  onChange={(event) => setField("description", event.target.value)}
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="category-content" className="mb-2 block text-sm font-semibold">
                  {t("fields.content")}
                </label>
                <textarea
                  id="category-content"
                  rows={8}
                  value={draft.content}
                  onChange={(event) => setField("content", event.target.value)}
                  className={fieldClass}
                />
                <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">{t("contentHint")}</p>
              </div>
            </div>
          </AppCard>

          <AppCard className="p-4 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold">{t("products.title")}</h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{t("products.hint")}</p>
              </div>
              <div className="flex w-full items-center gap-2 sm:w-auto">
                <select
                  aria-label={t("products.add")}
                  value={productToAdd}
                  onChange={(event) => setProductToAdd(event.target.value)}
                  className={cn(fieldClass, "h-9 flex-1 py-0 sm:w-56 sm:flex-none")}
                >
                  <option value="">{t("products.choose")}</option>
                  {assignable.map((product) => (
                    <option key={product.id} value={String(product.id)}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <AppButton type="button" variant="outline" disabled={!productToAdd} onClick={addProduct}>
                  {t("products.add")}
                </AppButton>
              </div>
            </div>

            {products.length ? (
              <ul className="space-y-2">
                {products.map((product, index) => (
                  <li
                    key={product.id}
                    className="flex items-center gap-3 rounded-md border border-neutral-200 p-2 dark:border-white/10"
                  >
                    <span className="w-6 shrink-0 text-center text-xs font-bold text-neutral-500 dark:text-neutral-400">
                      {index + 1}
                    </span>
                    <div className="relative size-11 shrink-0 overflow-hidden rounded bg-neutral-100 dark:bg-white/10">
                      {product.image_url ? (
                        <Image src={product.image_url} alt={product.name} fill sizes="44px" className="object-cover" />
                      ) : (
                        <span className="grid size-full place-items-center text-neutral-400">
                          <ImagePlus className="size-4" />
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{product.name}</p>
                      <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                        {product.sku || product.slug}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        aria-label={t("products.moveUp")}
                        title={t("products.moveUp")}
                        disabled={index === 0}
                        onClick={() => moveProduct(index, -1)}
                        className="grid size-8 place-items-center rounded border border-neutral-300 transition hover:bg-neutral-100 disabled:opacity-40 dark:border-white/15 dark:hover:bg-white/10"
                      >
                        <ArrowUp className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label={t("products.moveDown")}
                        title={t("products.moveDown")}
                        disabled={index === products.length - 1}
                        onClick={() => moveProduct(index, 1)}
                        className="grid size-8 place-items-center rounded border border-neutral-300 transition hover:bg-neutral-100 disabled:opacity-40 dark:border-white/15 dark:hover:bg-white/10"
                      >
                        <ArrowDown className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label={t("products.remove")}
                        title={t("products.remove")}
                        onClick={() => setProducts((current) => current.filter((entry) => entry.id !== product.id))}
                        className="grid size-8 place-items-center rounded border border-neutral-300 text-red-600 transition hover:bg-red-50 dark:border-white/15 dark:hover:bg-red-500/10"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-md bg-neutral-100 p-3 text-xs text-neutral-600 dark:bg-white/10 dark:text-neutral-300">
                {t("products.empty")}
              </p>
            )}
          </AppCard>
        </div>

        <div className="space-y-5">
          <AppCard className="p-4 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50 sm:p-6">
            <h2 className="mb-3 text-sm font-bold">{t("banner.title")}</h2>
            <div className="relative aspect-video overflow-hidden rounded-md bg-neutral-100 dark:bg-white/10">
              {category?.banner_url ? (
                <Image
                  src={category.banner_url}
                  alt={t("banner.alt", { category: form.name })}
                  fill
                  sizes="340px"
                  className="object-cover"
                />
              ) : (
                <span className="grid size-full place-items-center text-neutral-400">
                  <ImagePlus className="size-6" />
                </span>
              )}
            </div>
            <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">{t("banner.hint")}</p>
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";

                if (file) {
                  bannerMutation.mutate(file);
                }
              }}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <AppButton
                type="button"
                variant="outline"
                loading={bannerMutation.isPending}
                onClick={() => bannerInputRef.current?.click()}
              >
                {category?.banner_url ? t("banner.replace") : t("banner.upload")}
              </AppButton>
              {category?.banner_url ? (
                <AppButton
                  type="button"
                  variant="outline"
                  loading={removeBannerMutation.isPending}
                  onClick={() => removeBannerMutation.mutate()}
                >
                  <Trash2 className="size-3.5" />
                  {t("banner.remove")}
                </AppButton>
              ) : null}
            </div>
          </AppCard>

          <AppCard className="p-4 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50 sm:p-6">
            <h2 className="mb-3 text-sm font-bold">{t("settings.title")}</h2>
            <label htmlFor="category-slug" className="mb-2 block text-sm font-semibold">
              {t("fields.slug")}
            </label>
            <input
              id="category-slug"
              value={form.slug}
              onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
              className={fieldClass}
            />
            <label htmlFor="category-sort" className="mb-2 mt-4 block text-sm font-semibold">
              {t("fields.sortOrder")}
            </label>
            <input
              id="category-sort"
              type="number"
              min={0}
              value={form.sort_order}
              onChange={(event) => setForm((current) => ({ ...current, sort_order: event.target.value }))}
              className={fieldClass}
            />
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold">{t("fields.visibility")}</p>
                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                  {form.is_active ? t("fields.visibleHint") : t("fields.hiddenHint")}
                </p>
              </div>
              <AppSwitch
                checked={form.is_active}
                aria-label={t("fields.visibility")}
                onClick={() => setForm((current) => ({ ...current, is_active: !current.is_active }))}
              />
            </div>
          </AppCard>
        </div>
      </div>
    </div>
  );
}
