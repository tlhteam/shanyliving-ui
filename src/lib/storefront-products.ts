import { apiUrl } from "@/lib/api";
import { getUserLocale } from "@/i18n/locale";
import { mapCatalogProduct } from "@/lib/storefront-catalog";
import { getStorefrontProduct } from "@/lib/storefront-pages";
import type { CatalogProduct } from "@/lib/catalog";
import type { StorefrontProduct } from "@/lib/storefront-pages";

export async function getCatalogProducts(limit = 48): Promise<StorefrontProduct[]> {
  if (!apiUrl) {
    return [];
  }

  try {
    const locale = await getUserLocale();
    const response = await fetch(`${apiUrl}/storefront/products?per_page=${limit}&locale=${locale}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      return [];
    }

    const body = await response.json();
    const products = (body?.data?.data ?? body?.data ?? []) as CatalogProduct[];

    return products.map((product) => mapCatalogProduct(product, getStorefrontProduct(product.slug)));
  } catch {
    return [];
  }
}
