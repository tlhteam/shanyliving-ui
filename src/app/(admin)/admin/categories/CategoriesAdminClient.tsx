"use client";

import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { categories } from "@/lib/admin-data";
import type { AdminRow } from "@/lib/admin-data";

function cleanText(value: unknown) {
  if (value === undefined || value === null) {
    return "";
  }

  const text = String(value).trim();

  return ["", "undefined", "null", "nan", "[object object]"].includes(text.toLowerCase()) ? "" : text;
}

function toBoolean(value: unknown) {
  return value === true || value === 1 || ["1", "true", "yes", "active", "visible"].includes(cleanText(value).toLowerCase());
}

function mapCategoryRow(row: Record<string, unknown>): AdminRow {
  return {
    categoryId: row.id,
    name: cleanText(row.name),
    slug: cleanText(row.slug),
    description: cleanText(row.description),
    products: row.products_count ?? 0,
    sort_order: row.sort_order ?? 0,
    is_active: toBoolean(row.is_active) ? "Visible" : "Hidden"
  };
}

export function CategoriesAdminClient() {
  return (
    <AdminResourcePage
      eyebrow="Catalog"
      title="Categories"
      description="Organize storefront navigation and keep MVP categories visible only when they have enough products."
      action="Add Category"
      rows={categories}
      apiPath="/admin/catalog/categories"
      mapApiRow={mapCategoryRow}
      getResourceKey={(row) => String(row.slug ?? row.categoryId)}
      columns={[
        { key: "categoryId", label: "ID" },
        { key: "name", label: "Name" },
        { key: "slug", label: "Slug" },
        { key: "description", label: "Description", input: "textarea" },
        { key: "products", label: "Products" },
        { key: "sort_order", label: "Sort Order" },
        { key: "is_active", label: "Visibility", badge: true, formInput: "switch", switchLabels: { on: "Visible", off: "Hidden", onHint: "Visible on storefront", offHint: "Hidden from storefront" } }
      ]}
    />
  );
}
