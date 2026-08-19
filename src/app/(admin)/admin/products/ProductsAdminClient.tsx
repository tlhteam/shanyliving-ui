"use client";

import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { products } from "@/lib/admin-data";
import type { AdminRow } from "@/lib/admin-data";
import { isUsableImagePath } from "@/lib/media";

const EMPTY_VALUES = new Set(["", "undefined", "null", "nan", "[object object]"]);

function cleanText(value: unknown) {
  if (value === undefined || value === null) {
    return "";
  }

  const text = String(value).trim();

  return EMPTY_VALUES.has(text.toLowerCase()) ? "" : text;
}

function toBoolean(value: unknown) {
  return value === true || value === 1 || ["1", "true", "yes", "active", "visible"].includes(cleanText(value).toLowerCase());
}

function formatPrice(value: unknown) {
  const price = Number(cleanText(value).replace(/[^\d.-]/g, ""));

  return Number.isFinite(price) && price > 0 ? `₪ ${new Intl.NumberFormat("en").format(price)}` : "Price on request";
}

function textList(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(cleanText).filter(Boolean).join(", ");
  }

  return cleanText(value);
}

function imagePath(image: unknown) {
  if (typeof image === "string") {
    const path = cleanText(image);

    return isUsableImagePath(path) ? path : "";
  }

  if (!image || typeof image !== "object") {
    return "";
  }

  const path = cleanText((image as { path?: unknown; url?: unknown; image?: unknown }).path ?? (image as { url?: unknown }).url ?? (image as { image?: unknown }).image);

  return isUsableImagePath(path) ? path : "";
}

function mapProductRow(row: Record<string, unknown>): AdminRow {
  const images = Array.isArray(row.images) ? row.images : [];
  const primaryImage = images.find((image) => toBoolean((image as { is_primary?: unknown }).is_primary));
  const coverImage = imagePath(row.image ?? row.image_url ?? row.cover_image) || imagePath(primaryImage) || imagePath(images[0]);
  const gallery = images
    .map(imagePath)
    .filter((image) => image !== coverImage)
    .filter(Boolean);
  const category = typeof row.category === "object" && row.category
    ? cleanText((row.category as { name?: unknown }).name)
    : cleanText(row.category);

  return {
    productId: row.id ?? row.productId ?? row.uuid ?? cleanText(row.slug),
    slug: cleanText(row.slug),
    sku: cleanText(row.sku),
    image: coverImage,
    gallery,
    name: cleanText(row.name),
    category,
    price: formatPrice(row.price),
    description: cleanText(row.description),
    features: textList(row.features),
    colors: textList(row.colors),
    production: toBoolean(row.is_customizable) ? "Made to Order" : "Available Now",
    status: toBoolean(row.is_active) ? "Active" : "Draft",
    customizable: toBoolean(row.is_customizable) ? "Yes" : "No"
  };
}

export function ProductsAdminClient() {
  return (
    <AdminResourcePage
      eyebrow="Catalog"
      title="Products"
      description="Manage sofa models, fixed-stock products, pricing, available sizes and customization status."
      action="Add Product"
      rows={products}
      apiPath="/admin/catalog/products"
      mapApiRow={mapProductRow}
      getResourceKey={(row) => String(row.slug ?? row.productId ?? row.sku)}
      createHref="/admin/products/new"
      editHref={(row) => `/admin/products/${row.slug}/edit`}
      columns={[
        { key: "sku", label: "SKU" },
        { key: "image", label: "Cover Image", input: "image" },
        { key: "gallery", label: "Gallery", input: "images" },
        { key: "name", label: "Product" },
        { key: "category", label: "Category" },
        { key: "price", label: "Starting Price" },
        { key: "description", label: "Description", input: "textarea" },
        { key: "features", label: "Features", input: "textarea" },
        { key: "colors", label: "Color Hex Codes", input: "textarea" },
        { key: "production", label: "Production", badge: true },
        { key: "status", label: "Status", badge: true, formInput: "switch", switchLabels: { on: "Active", off: "Draft", onHint: "Active on storefront", offHint: "Saved as draft" } },
        { key: "customizable", label: "Customizable", badge: true, formInput: "switch", switchLabels: { on: "Yes", off: "No", onHint: "Customizable product", offHint: "Fixed product" } }
      ]}
    />
  );
}
