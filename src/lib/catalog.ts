import { apiUrl } from "@/lib/api";
import { getUserLocale } from "@/i18n/locale";

async function localeQuery(separator: "?" | "&" = "?") {
  return `${separator}locale=${await getUserLocale()}`;
}

export type CatalogImage = {
  id?: number | string;
  path?: string | null;
  url?: string | null;
  alt?: string | null;
  color?: string | null;
  is_primary?: boolean;
  sort_order?: number;
};

export type CatalogCategory = {
  id: number | string;
  name: string;
  slug: string;
  description?: string | null;
  sort_order?: number;
  image?: string | null;
  banner_path?: string | null;
  banner_url?: string | null;
  hero_eyebrow?: string | null;
  hero_title?: string | null;
  hero_description?: string | null;
  content?: string | null;
  is_active?: boolean;
  products_count?: number;
};

export type CatalogCategoryTranslation = {
  locale: string;
  name?: string | null;
  description?: string | null;
  hero_eyebrow?: string | null;
  hero_title?: string | null;
  hero_description?: string | null;
  content?: string | null;
};

export type CatalogCategoryProduct = {
  id: number;
  name: string;
  slug: string;
  sku?: string | null;
  price?: number | null;
  sort_order?: number | null;
  is_active?: boolean;
  image_url?: string | null;
};

export type AdminCategory = CatalogCategory & {
  translations?: CatalogCategoryTranslation[];
  products?: CatalogCategoryProduct[];
};

export type CatalogCollection = {
  id: number | string;
  name: string;
  slug: string;
  page_slug?: string | null;
  description?: string | null;
  image?: string | null;
  is_active?: boolean;
  sort_order?: number;
  products_count?: number;
};

export type CatalogOptionValue = {
  id: number | string;
  value: string;
  swatch?: string | null;
  media_id?: number | null;
  media_url?: string | null;
  position?: number;
};

export type CatalogOption = {
  id: number | string;
  name: string;
  position?: number;
  values?: CatalogOptionValue[];
};

export type CatalogVariant = {
  id: number | string;
  sku?: string | null;
  title?: string | null;
  price?: number | null;
  stock?: number;
  media_url?: string | null;
  options?: Record<string, string>;
  is_default?: boolean;
  is_active?: boolean;
};

export type CatalogProduct = {
  id: number | string;
  uuid?: string;
  name: string;
  slug: string;
  sku?: string | null;
  barcode?: string | null;
  subcategory?: string | null;
  category?: CatalogCategory | string | null;
  description?: string;
  price: number;
  compare_at_price?: number | null;
  is_featured?: boolean;
  is_best_seller?: boolean;
  is_customizable?: boolean;
  seat_range?: string;
  short_description?: string | null;
  highlights?: string[];
  style?: string | null;
  upholstery?: string | null;
  legs?: string | null;
  dimensions?: string | null;
  configuration_note?: string | null;
  is_made_to_measure?: boolean;
  colors?: string[];
  image?: string | null;
  image_url?: string | null;
  images?: CatalogImage[];
  collections?: CatalogCollection[];
  options?: CatalogOption[];
  variants?: CatalogVariant[];
  tags?: Array<{ id: number | string; name: string; slug: string }>;
};

export type HomeCatalog = {
  categories: CatalogCategory[];
  featuredProducts: CatalogProduct[];
  bestSellers: CatalogProduct[];
};

export const fallbackCatalog: HomeCatalog = {
  categories: [
    { id: 1, name: "Sofas", slug: "sofas" },
    { id: 2, name: "Living Room", slug: "living-room" },
    { id: 3, name: "Dining Room", slug: "dining-room" },
    { id: 4, name: "Bedroom", slug: "bedroom" },
    { id: 5, name: "Chairs", slug: "chairs" },
    { id: 6, name: "Coffee Tables", slug: "coffee-tables" },
  ],
  featuredProducts: [
    {
      id: 1,
      name: "Lian Sofa",
      slug: "lian-sofa",
      price: 0,
      seat_range: "Three-seat sofa",
      is_customizable: true,
      is_featured: true,
      is_best_seller: true,
      colors: ["#ffffff", "#d9dde3", "#315f97"],
      image: "/images/products/lian/lian-1.png",
    },
    {
      id: 2,
      name: "Cloud Modular",
      slug: "cloud-modular",
      price: 6990,
      seat_range: "3-4 Seater",
      is_customizable: true,
      colors: ["#ede8df", "#705d49", "#0f5f3f"],
    },
    {
      id: 3,
      name: "Luna Sofa",
      slug: "luna-sofa",
      price: 5890,
      seat_range: "2-3 Seater",
      is_customizable: true,
      colors: ["#ece7df", "#5d4a39", "#0b6040"],
    },
    {
      id: 4,
      name: "Noa Sofa",
      slug: "noa-sofa",
      price: 6280,
      seat_range: "3-5 Seater",
      is_customizable: true,
      colors: ["#eee9df", "#8a755f", "#0f5d43"],
    },
  ],
  bestSellers: [
    {
      id: 5,
      name: "Lian Sofa",
      slug: "lian-sofa",
      price: 0,
      seat_range: "200 x 100 x 85 cm",
      is_best_seller: true,
      is_customizable: true,
      image: "/images/products/lian/lian-1.png",
    },
    {
      id: 6,
      name: "Marble Coffee Table",
      slug: "marble-coffee-table",
      price: 1690,
      is_best_seller: true,
    },
    {
      id: 7,
      name: "Ribbed Side Table",
      slug: "ribbed-side-table",
      price: 890,
      is_best_seller: true,
    },
    {
      id: 8,
      name: "Dining Chair",
      slug: "dining-chair",
      price: 1990,
      is_best_seller: true,
    },
    {
      id: 9,
      name: "Luca Dining Table",
      slug: "luca-dining-table",
      price: 3990,
      is_best_seller: true,
    },
    {
      id: 10,
      name: "Linen Cushion",
      slug: "linen-cushion",
      price: 190,
      is_best_seller: true,
    },
  ],
};

export async function getHomeCatalog(): Promise<HomeCatalog> {
  if (!apiUrl) {
    return fallbackCatalog;
  }

  try {
    const response = await fetch(
      `${apiUrl}/storefront/home${await localeQuery()}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) {
      return fallbackCatalog;
    }

    const responseBody = await response.json();
    const data = responseBody.data ?? responseBody;

    return {
      categories: data.categories?.length
        ? data.categories
        : fallbackCatalog.categories,
      featuredProducts: data.featured_products?.length
        ? data.featured_products
        : fallbackCatalog.featuredProducts,
      bestSellers: data.best_sellers?.length
        ? data.best_sellers
        : fallbackCatalog.bestSellers,
    };
  } catch {
    return fallbackCatalog;
  }
}

export async function getCollections(
  pageSlug?: string,
): Promise<CatalogCollection[]> {
  if (!apiUrl) {
    return [];
  }

  try {
    const query = pageSlug ? `?page_slug=${encodeURIComponent(pageSlug)}` : "";
    const response = await fetch(
      `${apiUrl}/storefront/collections${query}${await localeQuery(query ? "&" : "?")}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) {
      return [];
    }

    const body = await response.json();

    return body.data ?? [];
  } catch {
    return [];
  }
}

export async function getCatalogProduct(
  slug: string,
): Promise<CatalogProduct | null> {
  if (!apiUrl) {
    return null;
  }

  try {
    const response = await fetch(
      `${apiUrl}/storefront/products/${encodeURIComponent(slug)}${await localeQuery()}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) {
      return null;
    }

    const body = await response.json();

    return body.data ?? null;
  } catch {
    return null;
  }
}
