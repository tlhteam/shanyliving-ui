"use client";

import Link from "next/link";
import { ChevronRight, Heart, Mail, Package, Sofa } from "lucide-react";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppImage } from "@/components/app/AppImage";
import { useCustomerQuery } from "@/hooks/use-customer";
import type { CustomerDashboard, CustomerOrder, CustomerOrderItem, CustomerProfile } from "@/types/customer";

function itemTitle(item?: CustomerOrderItem, order?: CustomerOrder | null) {
  return item?.product_name ?? item?.title ?? item?.name ?? (order ? `Order ${order.reference}` : "No active order");
}

export default function CustomerDashboardPage() {
  const dashboardQuery = useCustomerQuery<CustomerDashboard>("dashboard", "/customer/dashboard");
  const profileQuery = useCustomerQuery<CustomerProfile>("profile", "/customer/profile");
  const dashboard = dashboardQuery.data;
  const activeOrder = dashboard?.active_order;
  const activeItem = activeOrder?.items?.[0];
  const stats = [
    { label: "Active Orders", value: dashboard?.summary.active_orders ?? 0, text: "View your ongoing order", icon: Package, href: "/customer/orders" },
    { label: "Saved Designs", value: dashboard?.summary.saved_designs ?? 0, text: "Continue customizing", icon: Sofa, href: "/customer/saved-designs" },
    { label: "Wishlist", value: dashboard?.summary.wishlist ?? 0, text: "View your favorites", icon: Heart, href: "/customer/wishlist" },
    { label: "Messages", value: dashboard?.summary.messages ?? 0, text: "Unread messages", icon: Mail, href: "/customer/messages" }
  ];

  return (
    <>
      <div className="mb-7">
        <p className="text-sm font-semibold text-neutral-600">Welcome back,</p>
        <h1 className="font-serif text-4xl font-bold">{profileQuery.data?.name ?? "Customer"}</h1>
        <p className="mt-2 text-sm text-neutral-600">Here is what is happening with your account.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <AppCard className="p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-neutral-600">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold">{dashboardQuery.isLoading ? "-" : stat.value}</p>
                </div>
                <span className="grid size-10 place-items-center rounded-full bg-neutral-100"><stat.icon className="size-5" /></span>
              </div>
              <p className="mt-4 flex items-center justify-between text-xs text-neutral-700">{stat.text}<ChevronRight className="size-4" /></p>
            </AppCard>
          </Link>
        ))}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <AppCard className="p-5">
          <h2 className="font-bold">Active Order</h2>
          {activeOrder ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-[180px_1fr]">
              <AppImage src={activeItem?.image ?? null} alt={itemTitle(activeItem, activeOrder)} className="aspect-[1.45/1] rounded-lg" sizes="180px" />
              <div>
                <h3 className="font-serif text-2xl font-bold">{itemTitle(activeItem, activeOrder)}</h3>
                <p className="mt-1 text-xs text-neutral-600">Order #{activeOrder.reference} · {activeOrder.status}</p>
                <div className="mt-5 grid grid-cols-4 gap-2 text-center text-[11px]">
                  {["Confirmed", "Production", "Quality", "Ship"].map((step, index) => (
                    <div key={step} className="relative">
                      <span className={`mx-auto grid size-7 place-items-center rounded-full ${index < 2 ? "bg-black text-white" : "border border-neutral-300 bg-white"}`}>{index < 2 ? "OK" : ""}</span>
                      <p className="mt-2 font-semibold">{step}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-xs font-bold">Placed<br /><span className="text-neutral-600">{activeOrder.placed_at ? new Date(activeOrder.placed_at).toLocaleDateString() : "Pending"}</span></p>
                  <Link href="/customer/orders"><AppButton size="sm">View Order Details</AppButton></Link>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-neutral-600">No active orders yet.</p>
          )}
        </AppCard>
        <AppCard className="p-5">
          <h2 className="font-bold">Recent Messages</h2>
          <div className="mt-4 space-y-4">
            {(dashboard?.recent_messages ?? []).slice(0, 2).map((message) => (
              <div key={message.id} className="flex items-center gap-3">
                <div className="size-11 rounded-full bg-neutral-200" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{message.name ?? message.title ?? "Shany Living Team"}</p>
                  <p className="truncate text-sm text-neutral-600">{message.message}</p>
                </div>
                <span className="text-xs text-neutral-500">{message.time}</span>
              </div>
            ))}
            {!dashboardQuery.isLoading && (dashboard?.recent_messages ?? []).length === 0 ? <p className="text-sm text-neutral-600">No recent messages.</p> : null}
          </div>
          <Link href="/customer/messages"><AppButton className="mt-5 w-full" size="sm">Go to Messages</AppButton></Link>
        </AppCard>
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <AppCard className="p-5">
          <h2 className="font-bold">My Saved Designs</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {(dashboard?.saved_designs ?? []).slice(0, 3).map((design) => (
              <Link key={design.id} href="/customer/saved-designs" className="group">
                <AppImage src={design.image ?? null} alt={design.title} className="aspect-[1.5/1] rounded-lg" sizes="220px" imageClassName="transition duration-500 group-hover:scale-[1.04]" />
                <p className="mt-2 text-sm font-bold">{design.title}</p>
                <p className="text-xs text-neutral-600">{design.fabric}</p>
              </Link>
            ))}
            {!dashboardQuery.isLoading && (dashboard?.saved_designs ?? []).length === 0 ? <p className="text-sm text-neutral-600">No saved designs yet.</p> : null}
          </div>
          <Link href="/customize-your-sofa"><AppButton className="mt-5">Continue Customizing</AppButton></Link>
        </AppCard>
        <AppCard className="p-5">
          <h2 className="font-bold">Quick Links</h2>
          <div className="mt-4 grid gap-3">
            <Link href="/customer/wishlist" className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 text-sm font-bold">Wishlist <ChevronRight className="size-4" /></Link>
            <Link href="/customer/gift-cards" className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 text-sm font-bold">Gift Cards <ChevronRight className="size-4" /></Link>
            <Link href="/customer/payments" className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 text-sm font-bold">Cards & Bank <ChevronRight className="size-4" /></Link>
          </div>
        </AppCard>
      </div>
      <div className="mt-6 flex flex-col gap-3 text-sm font-semibold text-neutral-700 sm:flex-row sm:items-center sm:justify-between">
        <span>Need help? Our team is here</span>
        <span>WhatsApp Us</span>
        <span>Call Us</span>
      </div>
    </>
  );
}
