import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { configurations } from "@/lib/admin-data";

export default function Page() {
  return (
    <AdminResourcePage
      resourceKey="configurations"
      groupKey="salesFlow"
      eyebrow="Sales Flow"
      title="Configurations"
      description="Review saved sofa selections with model, structure, size, fabric, color and lead status."
      action="Create Configuration"
      rows={configurations}
      columns={[
        { key: "reference", label: "Reference" },
        { key: "customer", label: "Customer" },
        { key: "product", label: "Product" },
        { key: "structure", label: "Structure" },
        { key: "size", label: "Size" },
        { key: "fabric", label: "Fabric" },
        { key: "color", label: "Color" },
        { key: "status", label: "Status", badge: true }
      ]}
    />
  );
}
