"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AppButton } from "@/components/app/AppButton";
import { AppImage } from "@/components/app/AppImage";
import { AppSection } from "@/components/app/AppSection";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { ProductCard } from "@/components/storefront/ProductCard";
import { mobileOnlyClass, mobileVisibleSlug } from "@/lib/mobile-catalog";
import { cn } from "@/lib/utils";
import type { StorefrontPage, StorefrontProduct } from "@/lib/storefront-pages";

type SortMode = "featured" | "price-low" | "price-high";

type Facet = {
  value: string;
  label: string;
  count: number;
  image?: string;
  swatch?: string;
};

const sortOptions: Array<{ value: SortMode; label: string }> = [
  { value: "featured", label: "Featured order" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" }
];

function buildSubcategoryFacets(products: StorefrontProduct[]): Facet[] {
  const map = new Map<string, Facet>();

  products.forEach((product) => {
    const value = product.subcategory?.trim();

    if (!value) {
      return;
    }

    const existing = map.get(value);

    if (existing) {
      existing.count += 1;
      return;
    }

    map.set(value, { value, label: value, count: 1, image: product.image });
  });

  return [...map.values()].sort((a, b) => b.count - a.count);
}

function buildColorFacets(products: StorefrontProduct[]): Facet[] {
  const map = new Map<string, Facet>();

  products.forEach((product) => {
    (product.colors ?? []).forEach((color, index) => {
      const value = color?.trim();

      if (!value) {
        return;
      }

      const existing = map.get(value);

      if (existing) {
        existing.count += 1;
        return;
      }

      map.set(value, { value, label: product.colorNames?.[index] ?? value, count: 1, swatch: value });
    });
  });

  return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 10);
}

function FilterTile({
  label,
  count,
  image,
  active,
  onClick
}: {
  label: string;
  count: number;
  image?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex w-36 shrink-0 snap-start items-center gap-2.5 rounded-lg border p-2 text-start transition sm:w-auto sm:max-w-56",
        active
          ? "border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950"
          : "border-neutral-300 bg-white text-neutral-950 hover:border-neutral-950 dark:border-white/15 dark:bg-neutral-900 dark:text-neutral-50"
      )}
    >
      <AppImage src={image} alt={label} className="size-11 shrink-0 rounded-md" sizes="44px" />
      <span className="min-w-0">
        <span className="block truncate text-xs font-bold leading-tight">{label}</span>
        <span className={cn("text-[11px]", active ? "text-white/70 dark:text-neutral-950/70" : "text-neutral-500 dark:text-neutral-400")}>{count}</span>
      </span>
    </button>
  );
}

export function ProductGridPage({ page }: { page: StorefrontPage }) {
  const [subcategory, setSubcategory] = useState("");
  const [color, setColor] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("featured");

  const subcategoryFacets = useMemo(() => buildSubcategoryFacets(page.products), [page.products]);
  const colorFacets = useMemo(() => buildColorFacets(page.products), [page.products]);

  const products = useMemo(() => {
    const filtered = page.products.filter((product) => {
      if (subcategory && product.subcategory?.trim() !== subcategory) {
        return false;
      }

      if (color && !(product.colors ?? []).includes(color)) {
        return false;
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortMode === "price-low") {
        return a.price - b.price;
      }

      if (sortMode === "price-high") {
        return b.price - a.price;
      }

      return 0;
    });
  }, [color, page.products, sortMode, subcategory]);

  const mobileSlug = mobileVisibleSlug(products);
  const hasFilters = Boolean(subcategory || color || sortMode !== "featured");

  const clearFilters = () => {
    setSubcategory("");
    setColor("");
    setSortMode("featured");
  };

  return (
    <>
      <section className="relative isolate overflow-hidden text-white">
        <AppImage src={page.heroImage} alt={page.title} className="absolute inset-0" sizes="100vw" preload loading="eager" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative mx-auto flex min-h-56 max-w-7xl flex-col justify-end px-4 py-10 sm:min-h-80 sm:px-6 sm:py-12 lg:px-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/80 sm:text-xs">{page.eyebrow}</p>
          <h1 className="mt-2 font-serif text-3xl leading-tight sm:mt-3 sm:text-5xl lg:text-6xl">{page.title}</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/90 sm:text-base">{page.description}</p>
        </div>
      </section>

      <div className="bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
        <AppSection className="py-8 sm:py-10 lg:py-14">
          {subcategoryFacets.length > 1 ? (
            <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0">
                <FilterTile
                  label="All"
                  count={page.products.length}
                  active={!subcategory}
                  onClick={() => setSubcategory("")}
                  image={page.products[0]?.image}
                />
                {subcategoryFacets.map((facet) => (
                  <FilterTile
                    key={facet.value}
                    label={facet.label}
                    count={facet.count}
                    image={facet.image}
                    active={subcategory === facet.value}
                    onClick={() => setSubcategory(subcategory === facet.value ? "" : facet.value)}
                  />
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {colorFacets.length ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">Color</span>
                {colorFacets.map((facet) => (
                  <button
                    key={facet.value}
                    type="button"
                    title={facet.label}
                    aria-label={facet.label}
                    aria-pressed={color === facet.value}
                    onClick={() => setColor(color === facet.value ? "" : facet.value)}
                    className={cn(
                      "size-8 rounded-full border-2 transition",
                      color === facet.value
                        ? "border-neutral-950 ring-2 ring-neutral-950/20 dark:border-white"
                        : "border-neutral-200 hover:border-neutral-500 dark:border-white/20"
                    )}
                    style={{ backgroundColor: facet.swatch }}
                  />
                ))}
              </div>
            ) : null}

            <div className="flex items-center gap-2">
              <label htmlFor="product-sort" className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">Sort</label>
              <div className="relative">
                <select
                  id="product-sort"
                  value={sortMode}
                  onChange={(event) => setSortMode(event.target.value as SortMode)}
                  className="h-10 appearance-none rounded-md border border-neutral-300 bg-white pe-9 ps-3 text-sm font-semibold outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-900"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <SiteIcon name="chevron-down" className="pointer-events-none absolute end-2.5 top-2.5 size-4 text-neutral-500" />
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-4 text-sm text-neutral-600 dark:border-white/10 dark:text-neutral-400">
            <p>
              <span className="sm:hidden">{mobileSlug ? "1 product shown" : "No products shown"}</span>
              <span className="hidden sm:inline">{products.length} product{products.length === 1 ? "" : "s"} shown</span>
            </p>
            {hasFilters ? (
              <button type="button" onClick={clearFilters} className="inline-flex items-center gap-1.5 font-bold text-neutral-950 underline dark:text-white">
                <SiteIcon name="x" className="size-3.5" /> Clear filters
              </button>
            ) : null}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} className={mobileOnlyClass(product.slug, mobileSlug)} />
            ))}
          </div>

          {products.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-neutral-300 p-8 text-center dark:border-white/15">
              <p className="text-sm text-neutral-600 dark:text-neutral-300">Nothing matches this combination yet.</p>
              <AppButton variant="outline" className="mt-4" onClick={clearFilters}>Clear filters</AppButton>
            </div>
          ) : null}

          <div className="mt-12 grid items-center gap-5 rounded-lg bg-neutral-100 p-5 sm:p-8 dark:bg-neutral-900 lg:grid-cols-[1fr_auto]">
            <div>
              <h2 className="font-serif text-xl font-bold sm:text-2xl">Need help choosing?</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-700 dark:text-neutral-300">Send a room photo, measurements, or a favorite style and the team will guide you to the right product and configuration.</p>
            </div>
            <Link href="/showroom" className="block">
              <AppButton className="w-full lg:w-auto">Talk to the showroom</AppButton>
            </Link>
          </div>
        </AppSection>
      </div>
    </>
  );
}
