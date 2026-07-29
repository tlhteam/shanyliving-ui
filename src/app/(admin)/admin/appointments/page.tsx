import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { appointments } from "@/lib/admin-data";

export default function Page() {
  return (
    <AdminResourcePage
      eyebrow="People"
      title="Appointments"
      description="Coordinate showroom consultations, fabric reviews and quote follow-up visits."
      action="Book Appointment"
      rows={appointments}
      columns={[
        { key: "id", label: "ID" },
        { key: "customer", label: "Customer" },
        { key: "date", label: "Date" },
        { key: "time", label: "Time" },
        { key: "purpose", label: "Purpose" },
        { key: "status", label: "Status", badge: true }
      ]}
    />
  );
}
