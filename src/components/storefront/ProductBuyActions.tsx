"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { AppButton } from "@/components/app/AppButton";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { isCustomOrderCategory } from "@/lib/custom-order";
import type { StorefrontProduct } from "@/lib/storefront-pages";
import { useCustomerCommerceStore } from "@/stores/customer-commerce-store";

export function ProductBuyActions({ product, compact = false }: { product: StorefrontProduct; compact?: boolean }) {
  const t = useTranslations("storefront.card");
  const { data: session } = useSession();
  const addToCart = useCustomerCommerceStore((state) => state.addToCart);
  const openCart = useCustomerCommerceStore((state) => state.openCart);
  const isQuoteOnly = product.price <= 0;

  if (isCustomOrderCategory(product.category)) {
    return (
      <Link href={`/sofas/${product.slug}`} className="block">
        <AppButton size={compact ? "sm" : "md"} className="w-full gap-2">
          <SiteIcon name="sparkle" className="size-4" />
          {t("viewCustomize")}
        </AppButton>
      </Link>
    );
  }

  const handleAdd = () => {
    if (isQuoteOnly) {
      toast.info(t("quoteOnly"));
      return;
    }

    if (session?.user?.role === "admin") {
      toast.error(t("adminBlocked"));
      return;
    }

    addToCart(product, {
      size: product.seatRange ?? "Standard",
      configuration: product.category === "sofas" ? "Standard sofa" : product.subcategory,
      fabric: product.category === "sofas" ? "Boucle" : undefined,
      color: product.colors?.[0]
    });
    toast.success(t("added", { name: product.name }));
    openCart();
  };

  if (compact) {
    return (
      <div className="grid grid-cols-[1fr_48px] gap-3">
        <AppButton size="sm" className="w-full gap-2" onClick={handleAdd}>
          <SiteIcon name="cart" className="size-4" />
          {isQuoteOnly ? t("quote") : t("add")}
        </AppButton>
        <button type="button" onClick={openCart} aria-label={t("viewCart")} className="grid h-9 place-items-center rounded-md border border-neutral-300 transition hover:bg-neutral-100 dark:border-white/15 dark:hover:bg-white/10">
          <SiteIcon name="bag" className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <AppButton className="w-full gap-2" onClick={handleAdd}>
        <SiteIcon name="cart" className="size-4" />
        {isQuoteOnly ? t("requestQuote") : t("addToCart")}
      </AppButton>
      <AppButton variant="outline" className="w-full gap-2" onClick={openCart}>
        <SiteIcon name="bag" className="size-4" />
        {t("viewCart")}
      </AppButton>
    </div>
  );
}
