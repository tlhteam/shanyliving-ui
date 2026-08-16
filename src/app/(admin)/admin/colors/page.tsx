import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { colors } from "@/lib/admin-data";

export default function Page() {
  return (
    <AdminResourcePage
      eyebrow="Catalog"
      title="Colors"
      description="Maintain the color families and recommended shades customers choose before WhatsApp confirmation."
      action="Add Color"
      rows={colors}
      columns={[
        { key: "id", label: "ID" },
        { key: "name", label: "Shade" },
        { key: "family", label: "Family" },
        { key: "hex", label: "Swatch", swatch: true, input: "color" },
        { key: "status", label: "Status", badge: true }
      ]}
    />
  );
}
