export type CatalogCategory = {
  id: number | string;
  name: string;
  slug: string;
  description?: string;
  sort_order?: number;
};

export type CatalogProduct = {
  id: number | string;
  name: string;
  slug: string;
  category?: CatalogCategory | string | null;
  description?: string;
  price: number;
  compare_at_price?: number | null;
  is_featured?: boolean;
  is_best_seller?: boolean;
  is_customizable?: boolean;
  seat_range?: string;
  colors?: string[];
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
    { id: 6, name: "Coffee Tables", slug: "coffee-tables" }
  ],
  featuredProducts: [
    { id: 1, name: "Cloud Modular", slug: "cloud-modular", price: 6990, seat_range: "3-4 Seater", is_customizable: true, colors: ["#ede8df", "#705d49", "#0f5f3f"] },
    { id: 2, name: "Luna Sofa", slug: "luna-sofa", price: 5890, seat_range: "2-3 Seater", is_customizable: true, colors: ["#ece7df", "#5d4a39", "#0b6040"] },
    { id: 3, name: "Noa Sofa", slug: "noa-sofa", price: 6280, seat_range: "3-5 Seater", is_customizable: true, colors: ["#eee9df", "#8a755f", "#0f5d43"] },
    { id: 4, name: "Ella Sofa", slug: "ella-sofa", price: 7650, seat_range: "3-5 Seater", is_customizable: true, colors: ["#eee9df", "#5e4b36", "#0a5639"] }
  ],
  bestSellers: [
    { id: 5, name: "Marble Coffee Table", slug: "marble-coffee-table", price: 1690, is_best_seller: true },
    { id: 6, name: "Nora Armchair", slug: "nora-armchair", price: 2990, is_best_seller: true },
    { id: 7, name: "Ribbed Side Table", slug: "ribbed-side-table", price: 890, is_best_seller: true },
    { id: 8, name: "Dining Chair", slug: "dining-chair", price: 1990, is_best_seller: true },
    { id: 9, name: "Luca Dining Table", slug: "luca-dining-table", price: 3990, is_best_seller: true },
    { id: 10, name: "Linen Cushion", slug: "linen-cushion", price: 190, is_best_seller: true }
  ]
};

export async function getHomeCatalog(): Promise<HomeCatalog> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    return fallbackCatalog;
  }

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/storefront/home`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      return fallbackCatalog;
    }

    const responseBody = await response.json();
    const data = responseBody.data ?? responseBody;

    return {
      categories: data.categories?.length ? data.categories : fallbackCatalog.categories,
      featuredProducts: data.featured_products?.length ? data.featured_products : fallbackCatalog.featuredProducts,
      bestSellers: data.best_sellers?.length ? data.best_sellers : fallbackCatalog.bestSellers
    };
  } catch {
    return fallbackCatalog;
  }
}
