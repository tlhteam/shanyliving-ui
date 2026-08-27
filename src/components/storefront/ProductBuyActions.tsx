"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { AppButton } from "@/components/app/AppButton";
import { WhatsappIcon } from "@/components/icons/WhatsappIcon";
import { ArrowRight, Sparkles } from "lucide-react";
import { isCustomOrderCategory } from "@/lib/custom-order";
import { localizedProductName } from "@/lib/storefront-pages";
import { buildProductQuoteMessage, whatsappHref } from "@/lib/whatsapp";
import type { StorefrontProduct } from "@/lib/storefront-pages";

export function ProductBuyActions({ product, compact = false }: { product: StorefrontProduct; compact?: boolean }) {
  const t = useTranslations("storefront.card");
  const locale = useLocale();

  if (isCustomOrderCategory(product.category)) {
    return (
      <Link href={`/sofas/${product.slug}`} className="block">
        <AppButton size={compact ? "sm" : "md"} className="w-full gap-2">
          <Sparkles className="size-4" />
          {t("viewCustomize")}
        </AppButton>
      </Link>
    );
  }

  const quoteLink = whatsappHref(
    buildProductQuoteMessage({
      productName: localizedProductName(product, locale),
      productId: product.slug,
      category: product.category,
      colorNames: product.colorNames
    })
  );

  if (compact) {
    return (
      <div className="grid grid-cols-[1fr_48px] gap-3">
        <Link href={quoteLink} target="_blank" rel="noreferrer noopener" className="block">
          <AppButton size="sm" className="w-full gap-2">
            <WhatsappIcon className="size-4" />
            {t("quote")}
          </AppButton>
        </Link>
        <Link
          href={`/sofas/${product.slug}`}
          aria-label={t("viewDetails")}
          title={t("viewDetails")}
          className="grid h-9 place-items-center rounded-md border border-neutral-300 transition hover:bg-neutral-100 dark:border-white/15 dark:hover:bg-white/10"
        >
          <ArrowRight className="size-4 rtl:rotate-180" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Link href={quoteLink} target="_blank" rel="noreferrer noopener" className="block">
        <AppButton className="w-full gap-2">
          <WhatsappIcon className="size-4" />
          {t("requestQuote")}
        </AppButton>
      </Link>
      <Link href={`/sofas/${product.slug}`} className="block">
        <AppButton variant="outline" className="w-full gap-2">
          <ArrowRight className="size-4 rtl:rotate-180" />
          {t("viewDetails")}
        </AppButton>
      </Link>
    </div>
  );
}
