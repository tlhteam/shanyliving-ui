import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { leads } from "@/lib/admin-data";

export default function Page() {
  return (
    <AdminResourcePage
      resourceKey="leads"
      groupKey="salesFlow"
      eyebrow="Sales Flow"
      title="Leads"
      description="Review qualified WhatsApp conversations and move each lead toward quote, showroom visit or sale."
      action="Add Lead"
      rows={leads}
      columns={[
        { key: "reference", label: "Reference" },
        { key: "name", label: "Customer" },
        { key: "product", label: "Product" },
        { key: "source", label: "Source" },
        { key: "status", label: "Status", badge: true },
        { key: "value", label: "Value" }
      ]}
    />
  );
}
