"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AppButton } from "@/components/app/AppButton";
import { AppImage } from "@/components/app/AppImage";
import { AppSection } from "@/components/app/AppSection";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { ProductCard } from "@/components/storefront/ProductCard";
import type { StorefrontPage } from "@/lib/storefront-pages";

export function ProductGridPage({ page }: { page: StorefrontPage }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortMode, setSortMode] = useState<"featured" | "price-low" | "price-high">("featured");
  const filters = useMemo(() => ["All", ...page.filters], [page.filters]);
  const filteredProducts = useMemo(() => {
    const filtered = activeFilter === "All" || activeFilter === "Sort by" || activeFilter === "Clear Filters"
      ? page.products
      : page.products.filter((product) => {
        const text = `${product.name} ${product.subcategory} ${product.seatRange ?? ""} ${product.badge ?? ""}`.toLowerCase();
        const filter = activeFilter.toLowerCase();

        if (filter === "price") {
          return true;
        }

        if (filter === "sofa type") {
          return product.category === "sofas" || product.name.toLowerCase().includes("sofa");
        }

        if (filter === "size") {
          return Boolean(product.seatRange) || product.subcategory.toLowerCase().includes("bed") || product.subcategory.toLowerCase().includes("table");
        }

        if (filter === "seats") {
          return Boolean(product.seatRange) || product.subcategory.toLowerCase().includes("chair") || product.subcategory.toLowerCase().includes("bench");
        }

        return text.includes(filter);
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
  }, [activeFilter, page.products, sortMode]);

  const handleFilter = (filter: string) => {
    if (filter === "Clear Filters") {
      setActiveFilter("All");
      setSortMode("featured");
      return;
    }

    if (filter === "Sort by") {
      setSortMode((current) => current === "featured" ? "price-low" : current === "price-low" ? "price-high" : "featured");
      setActiveFilter("All");
      return;
    }

    setActiveFilter(filter);
  };

  return (
    <>
      <section className="relative isolate overflow-hidden text-white">
        <AppImage src={page.heroImage} alt={page.title} className="absolute inset-0" sizes="100vw" preload loading="eager" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative mx-auto flex min-h-72 max-w-7xl flex-col justify-end px-4 py-12 sm:min-h-88 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/80">{page.eyebrow}</p>
          <h1 className="mt-3 font-serif text-4xl sm:text-6xl">{page.title}</h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/90 sm:text-base">{page.description}</p>
        </div>
      </section>
      <div className="bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <AppSection>
        <div className="-mx-4 mb-8 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex min-w-max gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => handleFilter(filter)}
                className={`inline-flex h-10 min-w-28 items-center justify-center gap-2 rounded-md border px-4 text-xs font-bold transition ${activeFilter === filter || (filter === "Sort by" && sortMode !== "featured") ? "border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950" : "border-neutral-300 bg-white text-neutral-950 hover:border-neutral-950 hover:bg-neutral-950 hover:text-white dark:border-white/15 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:border-white dark:hover:bg-white dark:hover:text-neutral-950"}`}
              >
                {filter === "Sort by" && sortMode === "price-low" ? "Price: Low to High" : filter === "Sort by" && sortMode === "price-high" ? "Price: High to Low" : filter}
                {["Sort by", "Sofa Type", "Size", "Seats", "Price", "Clear Filters"].includes(filter) ? <SiteIcon name="chevron-down" className="size-3.5" /> : null}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm text-neutral-600 dark:text-neutral-400">
          <p>{filteredProducts.length} product{filteredProducts.length === 1 ? "" : "s"} shown</p>
          <p>{activeFilter === "All" ? "All categories" : activeFilter} / {sortMode === "featured" ? "Featured order" : sortMode === "price-low" ? "Lowest price first" : "Highest price first"}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <AppButton variant="outline" className="min-w-48 gap-2">
            Load more
            <SiteIcon name="chevron-down" className="size-4" />
          </AppButton>
        </div>
        <div className="mt-14 grid items-center gap-6 rounded-lg bg-neutral-100 p-6 sm:p-8 dark:bg-neutral-900 lg:grid-cols-[1fr_auto]">
          <div>
            <h2 className="font-serif text-2xl font-bold">Need help choosing?</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-700 dark:text-neutral-300">Send a room photo, measurements, or a favorite style and the team will guide you to the right product and configuration.</p>
          </div>
          <Link href="/showroom">
            <AppButton className="w-full sm:w-auto">Talk to the showroom</AppButton>
          </Link>
        </div>
      </AppSection>
      </div>
    </>
  );
}
