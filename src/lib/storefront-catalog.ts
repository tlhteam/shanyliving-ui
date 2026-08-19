import { apiUrl } from "@/lib/api";
import { isUsableImagePath } from "@/lib/media";
import { getStorefrontProduct, storefrontPages } from "@/lib/storefront-pages";
import type { CatalogProduct } from "@/lib/catalog";
import type { StorefrontPage, StorefrontProduct } from "@/lib/storefront-pages";

const categoryBySlug: Record<string, StorefrontProduct["category"]> = {
  sofas: "sofas",
  "living-room": "living-room",
  dining: "dining",
  "dining-room": "dining",
  bedroom: "bedroom",
  "new-arrivals": "new-arrivals"
};

export function mapCatalogProduct(product: CatalogProduct, fallback?: StorefrontProduct): StorefrontProduct {
  const categorySlug = typeof product.category === "object" && product.category ? product.category.slug : "sofas";
  const category = categoryBySlug[categorySlug] ?? fallback?.category ?? "sofas";

  const galleryImages = product.images
    ?.slice()
    .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))
    .map((image) => image.url ?? image.path ?? "")
    .filter(isUsableImagePath);

  const primaryImage = isUsableImagePath(product.image_url)
    ? String(product.image_url)
    : galleryImages?.[0] ?? fallback?.image ?? "";

  const optionGroups = (product.options ?? [])
    .filter((option) => (option.values ?? []).length > 0)
    .map((option) => ({
      name: option.name,
      values: (option.values ?? []).map((value) => ({
        label: value.value,
        swatch: value.swatch ?? null,
        image: value.media_url ?? null
      }))
    }));

  const colorGroup = optionGroups.find((group) => group.name.toLowerCase() === "color");
  const fabricGroup = optionGroups.find((group) => group.name.toLowerCase() === "fabric");

  return {
    name: product.name,
    slug: product.slug,
    category,
    subcategory: product.subcategory ?? fallback?.subcategory ?? "Showroom product",
    price: Number(product.price ?? fallback?.price ?? 0),
    image: primaryImage,
    badge: product.is_best_seller ? "Best Seller" : product.is_featured ? "Featured" : fallback?.badge,
    description: product.description ?? fallback?.description,
    seatRange: product.seat_range ?? fallback?.seatRange,
    dimensions: fallback?.dimensions,
    variants: fabricGroup?.values.map((value) => value.label) ?? fallback?.variants,
    colors: colorGroup?.values.map((value) => value.swatch).filter((swatch): swatch is string => Boolean(swatch))
      ?? (product.colors?.length ? product.colors : fallback?.colors),
    colorNames: colorGroup?.values.map((value) => value.label) ?? fallback?.colorNames,
    galleryImages: galleryImages?.length ? galleryImages : fallback?.galleryImages,
    fabricImages: fabricGroup?.values.map((value) => value.image).filter((image): image is string => Boolean(image))
      ?? fallback?.fabricImages,
    optionGroups: optionGroups.length ? optionGroups : undefined
  };
}

async function fetchCollectionProducts(pageSlug: string): Promise<CatalogProduct[]> {
  if (!apiUrl) {
    return [];
  }

  try {
    const response = await fetch(`${apiUrl}/storefront/collections/${encodeURIComponent(pageSlug)}?per_page=48`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      return [];
    }

    const body = await response.json();
    const products = body?.data?.products;

    return (products?.data ?? products ?? []) as CatalogProduct[];
  } catch {
    return [];
  }
}

async function fetchCategoryProducts(categorySlug: string): Promise<CatalogProduct[]> {
  if (!apiUrl) {
    return [];
  }

  try {
    const response = await fetch(`${apiUrl}/storefront/products/category/${encodeURIComponent(categorySlug)}?per_page=48`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      return [];
    }

    const body = await response.json();

    return (body?.data?.data ?? body?.data ?? []) as CatalogProduct[];
  } catch {
    return [];
  }
}

export async function getStorefrontPage(pageSlug: string): Promise<StorefrontPage> {
  const staticPage = storefrontPages[pageSlug];

  if (!staticPage) {
    throw new Error(`Unknown storefront page: ${pageSlug}`);
  }

  const collectionProducts = await fetchCollectionProducts(pageSlug);
  const apiProducts = collectionProducts.length ? collectionProducts : await fetchCategoryProducts(pageSlug);

  if (!apiProducts.length) {
    return staticPage;
  }

  return {
    ...staticPage,
    products: apiProducts.map((product) => mapCatalogProduct(product, getStorefrontProduct(product.slug)))
  };
}
