import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { mediaItems } from "@/lib/admin-data";

export default function Page() {
  return (
    <AdminResourcePage
      eyebrow="Content"
      title="Media"
      description="Prepare product, showroom, hero and social assets while current image areas remain placeholders."
      action="Upload Media"
      rows={mediaItems}
      columns={[
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "type", label: "Type" },
        { key: "usage", label: "Usage" },
        { key: "status", label: "Status", badge: true }
      ]}
    />
  );
}
