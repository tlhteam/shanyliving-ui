import { cookies } from "next/headers";
import { CustomerShell } from "@/components/customer/CustomerShell";
import { sidebarCookies } from "@/lib/sidebar-preference";

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  const collapsed = store.get(sidebarCookies.customer)?.value === "collapsed";

  return <CustomerShell defaultCollapsed={collapsed}>{children}</CustomerShell>;
}
