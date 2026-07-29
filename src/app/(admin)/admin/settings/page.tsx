import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { settingsRows } from "@/lib/admin-data";

export default function Page() {
  return (
    <AdminResourcePage
      eyebrow="System"
      title="Settings"
      description="Configure WhatsApp, language, tracking, legal content and launch readiness items."
      action="Update Settings"
      rows={settingsRows}
      columns={[
        { key: "setting", label: "Setting" },
        { key: "value", label: "Value" },
        { key: "status", label: "Status", badge: true }
      ]}
    />
  );
}
