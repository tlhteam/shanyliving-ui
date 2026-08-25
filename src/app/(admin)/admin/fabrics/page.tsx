import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { fabrics } from "@/lib/admin-data";

export default function Page() {
  return (
    <AdminResourcePage
      resourceKey="fabrics"
      groupKey="catalog"
      eyebrow="Catalog"
      title="Fabrics"
      description="Manage fabric families shown in the simple configurator before detailed showroom guidance."
      action="Add Fabric"
      rows={fabrics}
      columns={[
        { key: "id", label: "ID" },
        { key: "image", label: "Texture Image", input: "image" },
        { key: "name", label: "Fabric" },
        { key: "family", label: "Family" },
        { key: "description", label: "Description", input: "textarea" },
        { key: "priceTier", label: "Price Tier", badge: true },
        { key: "status", label: "Status", badge: true }
      ]}
    />
  );
}
