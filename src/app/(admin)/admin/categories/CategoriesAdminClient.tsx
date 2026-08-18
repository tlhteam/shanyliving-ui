"use client";

import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { categories } from "@/lib/admin-data";
import type { AdminRow } from "@/lib/admin-data";

function mapCategoryRow(row: Record<string, unknown>): AdminRow {
  return {
    categoryId: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    products: row.products_count ?? 0,
    sort_order: row.sort_order ?? 0,
    is_active: Boolean(row.is_active)
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
        { key: "is_active", label: "Visibility", input: "switch" }
      ]}
    />
  );
}
