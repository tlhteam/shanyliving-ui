export const primaryCategorySlugs = ["sofas", "living-room", "dining-room", "bedroom"];

// Catalog category slugs don't map 1:1 onto the actual routes (e.g. "dining-room" -> /dining),
// so this is the single source of truth for that mapping — reused by the homepage's category
// tiles and the /collections overview page.
export const categoryHrefBySlug: Record<string, string> = {
  sofas: "/sofas",
  "living-room": "/living-room",
  "dining-room": "/dining",
  bedroom: "/bedroom",
};

// Keyed by StorefrontProduct["category"] instead of the catalog slug above (e.g. "dining" not
// "dining-room") — used wherever we route from a product's own `category` field.
export const productCategoryHref: Record<string, string> = {
  sofas: "/sofas",
  "living-room": "/living-room",
  dining: "/dining",
  bedroom: "/bedroom",
};
