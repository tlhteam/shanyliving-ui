"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { AppImage } from "@/components/app/AppImage";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { whatsappHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import type { StorefrontProduct } from "@/lib/storefront-pages";

export function ProductCard({ product, className }: { product: StorefrontProduct; className?: string }) {
  const t = useTranslations("storefront.card");
  const badges = useTranslations("storefront.badges");
  const common = useTranslations("common");
  const swatches = (product.colors ?? ["#eee9df", "#6a5845", "#0d5f43"]).slice(0, 3);
  const badgeLabel = product.badge && badges.has(product.badge) ? badges(product.badge) : product.badge;

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white text-neutral-950 shadow-sm transition duration-300 hover:shadow-xl sm:hover:-translate-y-1 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50",
        className
      )}
    >
      <Link href={`/sofas/${product.slug}`} className="relative block overflow-hidden">
        <AppImage
          src={product.image}
          alt={product.name}
          className="aspect-[1.38/1]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          imageClassName="transition duration-700 group-hover:scale-[1.05]"
        />
        {badgeLabel ? (
          <span className="absolute start-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-950">
            {badgeLabel}
          </span>
        ) : null}
        <span
          aria-label={t("wishlist", { name: product.name })}
          className="absolute end-3 top-3 grid size-8 place-items-center rounded-full bg-white/80 text-neutral-900 transition group-hover:bg-white"
        >
          <SiteIcon name="heart" className="size-4" />
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <Link
          href={`/sofas/${product.slug}`}
          className="font-bold text-neutral-950 transition hover:text-neutral-600 dark:text-neutral-50 dark:hover:text-neutral-300"
        >
          {product.name}
        </Link>
        {product.description ? (
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-600 dark:text-neutral-400">{product.description}</p>
        ) : product.subcategory ? (
          <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">{product.subcategory}</p>
        ) : null}
        <p className="mt-2 text-sm font-bold">{t("customMade")}</p>
        <div className="mt-3 flex items-center gap-1.5">
          {swatches.map((color) => (
            <span
              key={`${product.slug}-${color}`}
              className="size-4 rounded-full border border-neutral-200 dark:border-white/30"
              style={{ backgroundColor: color }}
            />
          ))}
          <span className="grid size-4 place-items-center rounded-full border border-neutral-300 text-neutral-500 dark:border-white/30 dark:text-neutral-300">
            <SiteIcon name="plus" className="size-3" />
          </span>
        </div>
        <Link
          href={`/sofas/${product.slug}`}
          className="mt-5 flex h-10 items-center justify-center gap-2 rounded-md bg-neutral-950 px-4 text-sm font-bold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
        >
          <SiteIcon name="sparkle" className="size-4" />
          {t("viewCustomize")}
        </Link>
        <Link
          href={whatsappHref(common("whatsappMessage"))}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-neutral-600 transition hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
        >
          <SiteIcon name="message" className="size-3.5" />
          {t("ask")}
        </Link>
      </div>
    </article>
  );
}
