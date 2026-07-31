import { apiBaseUrl } from "@/lib/api";
import type { CatalogCategory, CatalogProduct } from "@/lib/catalog";

export const siteImages = {
  hero: "/images/hero-living-room.png",
  showroom: "/images/showroom-consultation.png",
  showroomInterior: "/images/showroom-interior.png",
  roomUpload: "/images/look-warm-minimalism.png"
};

export const categoryImages: Record<string, string> = {
  sofas: "/images/category-sofas.png",
  "living-room": "/images/category-living-room.png",
  "dining-room": "/images/category-dining-room.png",
  dining: "/images/category-dining-room.png",
  bedroom: "/images/category-bedroom.png",
  chairs: "/images/category-chairs.png",
  "coffee-tables": "/images/category-coffee-tables.png"
};

export const productImages: Record<string, string> = {
  "cloud-modular": "/images/sofa-cloud-modular.png",
  "luna-sofa": "/images/sofa-luna.png",
  "noa-sofa": "/images/sofa-noa.png",
  "ella-sofa": "/images/sofa-ella.png",
  "marble-coffee-table": "/images/product-marble-coffee-table.png",
  "nora-armchair": "/images/product-nora-armchair.png",
  "ribbed-side-table": "/images/product-ribbed-side-table.png",
  "dining-chair": "/images/product-dining-chair.png",
  "luca-dining-table": "/images/product-luca-dining-table.png",
  "linen-cushion": "/images/product-linen-cushion.png"
};

export const sofaGallery = [
  "/images/sofa-cloud-modular.png",
  "/images/sofa-luna.png",
  "/images/sofa-noa.png",
  "/images/sofa-ella.png",
  "/images/look-modern-elegance.png",
  "/images/look-urban-luxury.png"
];

export const looks = [
  { key: "modernElegance", image: "/images/look-modern-elegance.png" },
  { key: "warmMinimalism", image: "/images/look-warm-minimalism.png" },
  { key: "urbanLuxury", image: "/images/look-urban-luxury.png" }
];

export const paymentMethods = [
  { name: "Visa", image: "/images/payment-visa.jpg" },
  { name: "American Express", image: "/images/payment-amex.webp" },
  { name: "Mastercard", image: "/images/payment-mastercard.webp" },
  { name: "Google Pay", image: "/images/payment-google-pay.png" },
  { name: "Apple Pay", image: "/images/payment-apple-pay.png" }
];

export function storageUrl(path?: string | null) {
  if (!path) {
    return undefined;
  }

  if (/^https?:\/\//.test(path) || path.startsWith("/images/")) {
    return path;
  }

  if (!apiBaseUrl) {
    return undefined;
  }

  return `${apiBaseUrl}/storage/${path.replace(/^\/?storage\//, "").replace(/^\//, "")}`;
}

export function categoryImage(category: CatalogCategory, index = 0) {
  const gallery = Object.values(categoryImages);

  return storageUrl(category.image) ?? categoryImages[category.slug] ?? gallery[index % gallery.length];
}

export function productImage(product: CatalogProduct, index = 0) {
  const primary = product.images?.find((image) => image.is_primary) ?? product.images?.[0];

  return (
    storageUrl(primary?.path) ??
    storageUrl(product.image) ??
    productImages[product.slug] ??
    sofaGallery[index % sofaGallery.length]
  );
}
