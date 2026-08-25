"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { AppImage } from "@/components/app/AppImage";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { ProductBuyActions } from "@/components/storefront/ProductBuyActions";
import { isCustomOrderCategory } from "@/lib/custom-order";
import { formatMoney } from "@/lib/format";
import { whatsappHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import type { StorefrontProduct } from "@/lib/storefront-pages";

function shortDescription(product: StorefrontProduct) {
  const intro = product.description?.split(/\n{2,}/)[0];
  const sentence = intro?.match(/^[^.]+\./)?.[0]?.trim();

  return sentence || product.subcategory || undefined;
}

export function ProductCard({ product, className }: { product: StorefrontProduct; className?: string }) {
  const t = useTranslations("storefront.card");
  const locale = useLocale();
  const badges = useTranslations("storefront.badges");
  const common = useTranslations("common");
  const priceLabel = isCustomOrderCategory(product.category)
    ? t("customMade")
    : product.price > 0
      ? formatMoney(product.price, locale)
      : t("priceOnRequest");
  const description = shortDescription(product);
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
        {description ? <p className="mt-1 line-clamp-2 text-xs text-neutral-600 dark:text-neutral-400">{description}</p> : null}
        <p className="mt-1 text-sm font-bold">{priceLabel}</p>
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
        <div className="mt-5">
          <ProductBuyActions product={product} compact />
        </div>
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
