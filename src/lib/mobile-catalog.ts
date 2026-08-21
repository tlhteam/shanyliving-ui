export const mobileFeaturedSlug = "lian-sofa";

export function isMobileFeatured(slug?: string | null) {
  const value = String(slug ?? "").toLowerCase();

  return value === mobileFeaturedSlug || value.startsWith("lian");
}

export function mobileVisibleSlug<T extends { slug: string }>(products: T[]) {
  return (products.find((product) => isMobileFeatured(product.slug)) ?? products[0])?.slug;
}

export function mobileOnlyClass(slug: string, visibleSlug?: string) {
  return slug === visibleSlug ? "" : "hidden sm:block";
}
