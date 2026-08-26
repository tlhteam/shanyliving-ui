export function categoryHref(slug: string) {
  return categoryHrefBySlug[slug] ?? "/collections";
}

export const categoryHrefBySlug: Record<string, string> = {
  sofas: "/sofas",
  "living-room": "/living-room",
  "dining-room": "/dining",
  bedroom: "/bedroom",
};

export const productCategoryHref: Record<string, string> = {
  sofas: "/sofas",
  "living-room": "/living-room",
  dining: "/dining",
  bedroom: "/bedroom",
};

export const categorySlugByPage: Record<string, string> = {
  sofas: "sofas",
  "living-room": "living-room",
  dining: "dining-room",
  "dining-room": "dining-room",
  bedroom: "bedroom",
  chairs: "chairs",
  "coffee-tables": "coffee-tables",
};
