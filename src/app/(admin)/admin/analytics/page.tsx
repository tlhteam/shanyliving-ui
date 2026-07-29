import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { analyticsEvents } from "@/lib/admin-data";

export default function Page() {
  return (
    <AdminResourcePage
      eyebrow="Content"
      title="Analytics"
      description="Track the customer path from ad visit to configurator completion and WhatsApp click."
      action="Export Analytics"
      rows={analyticsEvents}
      columns={[
        { key: "event", label: "Event" },
        { key: "count", label: "Count" },
        { key: "trend", label: "Trend", badge: true },
        { key: "priority", label: "Priority", badge: true }
      ]}
    />
  );
}
