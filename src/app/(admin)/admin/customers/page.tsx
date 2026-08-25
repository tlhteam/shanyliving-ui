import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { customers } from "@/lib/admin-data";

export default function Page() {
  return (
    <AdminResourcePage
      resourceKey="customers"
      groupKey="people"
      eyebrow="People"
      title="Customers"
      description="Track customer contact details, saved configurations, appointment activity and sales follow-up."
      action="Add Customer"
      rows={customers}
      columns={[
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "phone", label: "Phone" },
        { key: "saved", label: "Saved" },
        { key: "lastActivity", label: "Last Activity", badge: true }
      ]}
    />
  );
}
