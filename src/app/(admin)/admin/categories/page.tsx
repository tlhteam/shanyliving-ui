import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { categories } from "@/lib/admin-data";

export default function Page() {
  return (
    <AdminResourcePage
      eyebrow="Catalog"
      title="Categories"
      description="Organize storefront navigation and keep MVP categories visible only when they have enough products."
      action="Add Category"
      rows={categories}
      columns={[
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "slug", label: "Slug" },
        { key: "products", label: "Products" },
        { key: "visibility", label: "Visibility", badge: true }
      ]}
    />
  );
}
