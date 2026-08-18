"use client";

import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { products } from "@/lib/admin-data";
import type { AdminRow } from "@/lib/admin-data";
import { isUsableImagePath } from "@/lib/media";

function imagePath(image: unknown) {
  if (typeof image === "string") {
    return isUsableImagePath(image) ? image : "";
  }

  if (!image || typeof image !== "object") {
    return "";
  }

  const path = String((image as { path?: unknown }).path ?? "");

  return isUsableImagePath(path) ? path : "";
}

function mapProductRow(row: Record<string, unknown>): AdminRow {
  const images = Array.isArray(row.images) ? row.images : [];
  const gallery = images
    .filter((image) => !(image as { is_primary?: unknown }).is_primary)
    .map(imagePath)
    .filter(Boolean);
  const category = typeof row.category === "object" && row.category
    ? String((row.category as { name?: unknown }).name ?? "")
    : String(row.category ?? "");
  const coverImage = String(row.image ?? "");
  const colors = Array.isArray(row.colors) ? row.colors.filter(Boolean).join(", ") : String(row.colors ?? "");

  return {
    productId: row.id,
    slug: row.slug ?? "",
    sku: row.sku ?? "",
    image: isUsableImagePath(coverImage) ? coverImage : "",
    gallery,
    name: row.name ?? "",
    category,
    price: row.price ? `₪ ${new Intl.NumberFormat("en").format(Number(row.price))}` : "₪ 0",
    description: row.description ?? "",
    features: "",
    colors,
    production: row.is_customizable ? "Made to Order" : "Available Now",
    status: row.is_active ? "Active" : "Draft",
    customizable: row.is_customizable ? "Yes" : "No"
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
        { key: "status", label: "Status", badge: true },
        { key: "customizable", label: "Customizable", badge: true }
      ]}
    />
  );
}
