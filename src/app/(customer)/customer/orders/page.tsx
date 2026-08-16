"use client";

import { ChevronRight, Package, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppImage } from "@/components/app/AppImage";
import { AppPagination } from "@/components/app/AppPagination";
import { CustomerTopbar } from "@/components/customer/CustomerShell";
import { useCustomerQuery } from "@/hooks/use-customer";
import type { CustomerOrder } from "@/types/customer";

const statusClasses: Record<string, string> = {
  confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-600 dark:text-white",
  processing: "bg-blue-100 text-blue-700 dark:bg-blue-600 dark:text-white",
  production: "bg-neutral-100 text-neutral-700 dark:bg-white/15 dark:text-white",
  completed: "bg-green-100 text-green-700 dark:bg-emerald-600 dark:text-white",
  delivered: "bg-green-100 text-green-700 dark:bg-emerald-600 dark:text-white",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-600 dark:text-white"
};

const orderTabs = [
  { label: "All Orders", value: "all" },
  { label: "In Progress", value: "progress" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" }
] as const;

function firstItem(order: CustomerOrder) {
  return order.items?.[0];
}

function itemTitle(order: CustomerOrder) {
  const item = firstItem(order);

  return item?.product_name ?? item?.title ?? item?.name ?? `Order ${order.reference}`;
}

export default function CustomerOrdersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<(typeof orderTabs)[number]["value"]>("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const ordersQuery = useCustomerQuery<CustomerOrder[]>("orders", "/customer/orders");
  const filteredOrders = useMemo(
    () => (ordersQuery.data ?? [])
      .filter((order) => {
        if (activeTab === "delivered") return ["delivered", "completed"].includes(order.status);
        if (activeTab === "cancelled") return order.status === "cancelled";
        if (activeTab === "progress") return !["delivered", "completed", "cancelled"].includes(order.status);
        return true;
      })
      .filter((order) => `${order.reference} ${itemTitle(order)} ${order.status}`.toLowerCase().includes(search.trim().toLowerCase())),
    [activeTab, ordersQuery.data, search]
  );
  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const paginatedOrders = filteredOrders.slice((safePage - 1) * pageSize, safePage * pageSize);
  const selected = filteredOrders.find((order) => order.id === selectedId) ?? filteredOrders[0];

  return (
    <>
      <CustomerTopbar title="My Orders" subtitle="View and track all your orders." />
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-6 text-sm font-bold">
          {orderTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setActiveTab(tab.value);
                setPage(1);
              }}
              className={activeTab === tab.value ? "border-b-2 border-black pb-2 text-black dark:border-white dark:text-white" : "pb-2 text-neutral-500 transition hover:text-neutral-950 dark:hover:text-white"}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={search} onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }} placeholder="Search order ID or product..." className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:focus:border-white lg:w-72" />
          <AppButton variant="outline" className="gap-2"><SlidersHorizontal className="size-4" /> Filter</AppButton>
        </div>
      </div>

      {ordersQuery.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-32 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />)}
        </div>
      ) : null}

      {!ordersQuery.isLoading && filteredOrders.length === 0 ? (
          <AppCard className="grid place-items-center gap-3 p-12 text-center">
            <Package className="size-8 text-neutral-400" />
          <p className="text-sm text-neutral-600 dark:text-neutral-400">No orders found.</p>
        </AppCard>
      ) : null}

      {filteredOrders.length > 0 ? (
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            {paginatedOrders.map((order) => {
              const item = firstItem(order);

              return (
                <button key={order.id} type="button" onClick={() => setSelectedId(order.id)} className="block w-full text-start">
                  <AppCard className="grid gap-4 p-3 sm:grid-cols-[160px_1fr_auto] sm:items-center">
                    <AppImage src={item?.image ?? null} alt={itemTitle(order)} className="aspect-[1.5/1] rounded-lg" sizes="160px" />
                    <div>
                      <p className="text-xs font-bold">Order #{order.reference}</p>
                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{order.placed_at ? new Date(order.placed_at).toLocaleDateString() : "Date pending"}</p>
                      <h2 className="mt-3 font-bold">{itemTitle(order)}</h2>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{order.fulfillment_status}</p>
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:block sm:text-end">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClasses[order.status] ?? "bg-neutral-100 text-neutral-700 dark:bg-white/15 dark:text-white"}`}>{order.status}</span>
                      <p className="mt-4 font-bold">{order.currency} {new Intl.NumberFormat("en").format(Number(order.grand_total))}</p>
                      <ChevronRight className="ms-auto mt-4 hidden size-5 text-neutral-400 sm:block" />
                    </div>
                  </AppCard>
                </button>
              );
            })}
            <AppPagination page={safePage} pageSize={pageSize} total={filteredOrders.length} onPageChange={setPage} />
          </div>
          <AppCard className="h-fit p-5">
            <h2 className="font-serif text-2xl font-bold">Order Details</h2>
            <div className="mt-4 flex gap-3">
              <AppImage src={firstItem(selected)?.image ?? null} alt={itemTitle(selected)} className="size-20 rounded-lg" sizes="80px" />
              <div>
                <p className="font-bold">{itemTitle(selected)}</p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">{selected.payment_status}</p>
                <p className="mt-2 text-xs">Order #{selected.reference}</p>
              </div>
            </div>
            <div className="mt-5 border-t border-neutral-200 pt-5">
              {["Order Confirmed", "In Production", "Quality Check", "Ready to Ship", "Delivered"].map((step, index) => (
                <div key={step} className="grid grid-cols-[20px_1fr_auto] gap-3 pb-4 text-sm">
                  <span className={`mt-1 size-3 rounded-full ${index < 2 ? "bg-black dark:bg-white" : "border border-neutral-400 bg-white dark:bg-neutral-950"}`} />
                  <span>
                    <span className="block font-bold">{step}</span>
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">{index < 2 ? "Your order is moving forward." : "Pending"}</span>
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">{index < 2 && selected.placed_at ? new Date(selected.placed_at).toLocaleDateString() : "Pending"}</span>
                </div>
              ))}
            </div>
            <AppButton className="mt-2 w-full">View Order Details</AppButton>
          </AppCard>
        </div>
      ) : null}
    </>
  );
}
