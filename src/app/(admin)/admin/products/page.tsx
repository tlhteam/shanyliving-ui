import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { products } from "@/lib/admin-data";

export default function Page() {
  return (
    <AdminResourcePage
      eyebrow="Catalog"
      title="Products"
      description="Manage sofa models, fixed-stock products, pricing, available sizes and customization status."
      action="Add Product"
      rows={products}
      columns={[
        { key: "id", label: "SKU" },
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
