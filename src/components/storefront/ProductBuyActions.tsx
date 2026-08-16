"use client";

import Link from "next/link";
import { toast } from "sonner";
import { AppButton } from "@/components/app/AppButton";
import { SiteIcon } from "@/components/icons/SiteIcon";
import type { StorefrontProduct } from "@/lib/storefront-pages";
import { useCustomerCommerceStore } from "@/stores/customer-commerce-store";

export function ProductBuyActions({ product, compact = false }: { product: StorefrontProduct; compact?: boolean }) {
  const addToCart = useCustomerCommerceStore((state) => state.addToCart);

  const handleAdd = () => {
    addToCart(product, {
      size: product.seatRange ?? "Standard",
      configuration: product.category === "sofas" ? "Standard sofa" : product.subcategory,
      fabric: product.category === "sofas" ? "Boucle" : undefined,
      color: product.colors?.[0]
    });
    toast.success(`${product.name} added to cart.`);
  };

  if (compact) {
    return (
      <div className="grid grid-cols-[1fr_48px] gap-3">
        <AppButton size="sm" className="w-full gap-2" onClick={handleAdd}>
          <SiteIcon name="cart" className="size-4" />
          Add
        </AppButton>
        <Link href="/cart" aria-label="View cart" className="grid h-9 place-items-center rounded-md border border-neutral-300 transition hover:bg-neutral-100 dark:border-white/15 dark:hover:bg-white/10">
          <SiteIcon name="bag" className="size-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <AppButton className="w-full gap-2" onClick={handleAdd}>
        <SiteIcon name="cart" className="size-4" />
        Add to Cart
      </AppButton>
      <Link href="/cart">
        <AppButton variant="outline" className="w-full gap-2">
          <SiteIcon name="bag" className="size-4" />
          View Cart
        </AppButton>
      </Link>
    </div>
  );
}
