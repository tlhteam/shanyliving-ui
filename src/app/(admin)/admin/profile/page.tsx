import { getServerSession } from "next-auth";
import { Mail, ShieldCheck, UserRound } from "lucide-react";
import { authOptions } from "@/auth";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AppCard } from "@/components/app/AppCard";

export default async function AdminProfilePage() {
  const session = await getServerSession(authOptions);

  const rows = [
    { label: "Name", value: session?.user?.name ?? "Shany Admin", icon: UserRound },
    { label: "Email", value: session?.user?.email ?? "Not available", icon: Mail },
    { label: "Role", value: session?.user?.role === "admin" ? "Administrator" : "Staff", icon: ShieldCheck }
  ];

  return (
    <>
      <AdminPageHeader
        eyebrow="Account"
        title="Profile"
        description="Account details for the signed in staff member. Credentials are managed by the Laravel API."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row) => (
          <AppCard key={row.label} className="p-5 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
              <row.icon className="size-4" />
              {row.label}
            </div>
            <p className="mt-3 break-words text-lg font-semibold">{row.value}</p>
          </AppCard>
        ))}
      </div>
    </>
  );
}
