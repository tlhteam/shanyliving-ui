"use client";

import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppImage } from "@/components/app/AppImage";
import { AppPagination } from "@/components/app/AppPagination";
import { CustomerTopbar } from "@/components/customer/CustomerShell";
import { customerOrders } from "@/lib/customer-panel";

export default function CustomerOrdersPage() {
  const selected = customerOrders[0];

  return (
    <>
      <CustomerTopbar title="My Orders" subtitle="View and track all your orders." />
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-6 text-sm font-bold">
          {["All Orders", "In Progress", "Delivered", "Cancelled"].map((tab, index) => (
            <span key={tab} className={index === 0 ? "border-b-2 border-black pb-2" : "pb-2 text-neutral-500"}>{tab}</span>
          ))}
        </div>
        <div className="flex gap-2">
          <input placeholder="Search order ID or product..." className="h-10 w-full rounded-md border border-neutral-300 px-3 text-sm lg:w-72" />
          <AppButton variant="outline" className="gap-2"><SlidersHorizontal className="size-4" /> Filter</AppButton>
        </div>
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {customerOrders.map((order) => (
            <AppCard key={order.id} className="grid gap-4 p-3 sm:grid-cols-[160px_1fr_auto] sm:items-center">
              <AppImage src={order.image} alt={order.title} className="aspect-[1.5/1] rounded-lg" sizes="160px" />
              <div>
                <p className="text-xs font-bold">Order #{order.id}</p>
                <p className="mt-1 text-xs text-neutral-500">{order.date}</p>
                <h2 className="mt-3 font-bold">{order.title}</h2>
                <p className="text-sm text-neutral-600">{order.color}</p>
              </div>
              <div className="flex items-center justify-between gap-4 sm:block sm:text-end">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${order.status === "Delivered" ? "bg-green-100 text-green-700" : order.status === "Cancelled" ? "bg-red-100 text-red-700" : "bg-neutral-100 text-neutral-700"}`}>{order.status}</span>
                <p className="mt-4 font-bold">₪ {new Intl.NumberFormat("en").format(order.price)}</p>
                <ChevronRight className="ms-auto mt-4 hidden size-5 text-neutral-400 sm:block" />
              </div>
            </AppCard>
          ))}
          <AppPagination page={1} pageSize={5} total={15} onPageChange={() => undefined} />
        </div>
        <AppCard className="h-fit p-5">
          <h2 className="font-serif text-2xl font-bold">Order Details</h2>
          <div className="mt-4 flex gap-3">
            <AppImage src={selected.image} alt={selected.title} className="size-20 rounded-lg" sizes="80px" />
            <div>
              <p className="font-bold">{selected.title}</p>
              <p className="text-xs text-neutral-600">{selected.color}</p>
              <p className="mt-2 text-xs">Order #{selected.id}</p>
            </div>
          </div>
          <div className="mt-5 border-t border-neutral-200 pt-5">
            {["Order Confirmed", "In Production", "Quality Check", "Ready to Ship", "Out for Delivery", "Delivered"].map((step, index) => (
              <div key={step} className="grid grid-cols-[20px_1fr_auto] gap-3 pb-4 text-sm">
                <span className={`mt-1 size-3 rounded-full ${index < 2 ? "bg-black" : "border border-neutral-400 bg-white"}`} />
                <span>
                  <span className="block font-bold">{step}</span>
                  <span className="text-xs text-neutral-600">{index < 2 ? "Your order is moving forward." : "Pending"}</span>
                </span>
                <span className="text-xs text-neutral-500">{index < 2 ? "August 13" : "Pending"}</span>
              </div>
            ))}
          </div>
          <AppButton className="mt-2 w-full">View Order Details</AppButton>
        </AppCard>
      </div>
    </>
  );
}
