import { cookies } from "next/headers";
import { AdminShell } from "@/components/admin/AdminShell";
import { sidebarCookies } from "@/lib/sidebar-preference";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  const collapsed = store.get(sidebarCookies.admin)?.value === "collapsed";

  return <AdminShell defaultCollapsed={collapsed}>{children}</AdminShell>;
}
