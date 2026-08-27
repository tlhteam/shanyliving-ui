import { apiUrl } from "@/lib/api";
import { getUserLocale } from "@/i18n/locale";
import type { CatalogCategory } from "@/lib/catalog";

export async function getStorefrontCategories(): Promise<CatalogCategory[]> {
  if (!apiUrl) {
    return [];
  }

  try {
    const locale = await getUserLocale();
    const response = await fetch(`${apiUrl}/storefront/categories?locale=${locale}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      return [];
    }

    const body = await response.json();

    return (body?.data ?? []) as CatalogCategory[];
  } catch {
    return [];
  }
}
