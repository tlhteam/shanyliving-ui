import Link from "next/link";
import { BarChart3, Boxes, ContactRound, Settings, Users } from "lucide-react";

const menu = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/leads", label: "Leads", icon: ContactRound },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-neutral-100 lg:grid lg:grid-cols-[260px_1fr]"><aside className="border-r bg-neutral-950 p-5 text-white"><Link href="/" className="text-lg font-semibold tracking-[0.16em]">SHANY ADMIN</Link><nav className="mt-8 space-y-1">{menu.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-neutral-300 hover:bg-white/10 hover:text-white"><Icon className="size-4" />{label}</Link>)}</nav></aside><main className="p-5 sm:p-8">{children}</main></div>;
}
