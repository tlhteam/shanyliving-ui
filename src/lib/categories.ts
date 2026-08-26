// Categories the admin adds have no dedicated route yet, so anything without an entry in
// categoryHrefBySlug lands on the collections overview instead of a dead link.
export function categoryHref(slug: string) {
  return categoryHrefBySlug[slug] ?? "/collections";
}

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

// Collection page slugs are not always the category slug in the API (the /dining page is
// backed by the "dining-room" category), so this maps a page to the category that owns its
// banner and hero copy.
export const categorySlugByPage: Record<string, string> = {
  sofas: "sofas",
  "living-room": "living-room",
  dining: "dining-room",
  "dining-room": "dining-room",
  bedroom: "bedroom",
  chairs: "chairs",
  "coffee-tables": "coffee-tables",
};
