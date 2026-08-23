"use client";

import Link from "next/link";
import { AppButton } from "@/components/app/AppButton";
import { AppImage } from "@/components/app/AppImage";
import { AppSection } from "@/components/app/AppSection";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { useCustomerCommerceStore } from "@/stores/customer-commerce-store";

export default function OrderConfirmationPage() {
  const reference = useCustomerCommerceStore((state) => state.lastOrderReference);
  const items = useCustomerCommerceStore((state) => state.lastOrderItems);
  const checkout = useCustomerCommerceStore((state) => state.checkout);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AppSection className="max-w-xl text-center">
      <div className="rounded-lg border border-neutral-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-neutral-900">
        <span className="mx-auto grid size-20 place-items-center rounded-full bg-green-600 text-white">
          <SiteIcon name="check" className="size-10" />
        </span>
        <h1 className="mt-6 font-serif text-4xl font-bold">Thank you!</h1>
        <p className="mt-2 text-sm text-neutral-600">Your order has been confirmed.</p>
        <div className="mt-6 rounded-lg bg-neutral-50 p-5 dark:bg-neutral-950">
          <p className="text-xs text-neutral-500">Order number</p>
          <p className="mt-1 text-xl font-bold">{reference ?? "Pending reference"}</p>
          <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">We sent the details to {checkout.email || "your email"}.</p>
        </div>
        {items.length > 0 ? (
          <div className="mt-6 text-left">
            <h2 className="font-serif text-xl font-bold">Order summary</h2>
            <div className="mt-3 space-y-3">
              {items.map((item) => (
                <div key={item.slug} className="grid grid-cols-[72px_1fr_auto] items-center gap-3 border-b border-neutral-100 pb-3 last:border-0 dark:border-white/10">
                  <AppImage src={item.image} alt={item.name} className="aspect-square rounded-md" sizes="72px" />
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">{item.options?.size ?? "Standard"} / {item.options?.configuration ?? item.subcategory}</p>
                  </div>
                  <p className="font-bold">₪ {new Intl.NumberFormat("en").format(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 flex justify-between border-t border-neutral-200 pt-4 font-bold dark:border-white/10"><span>Total</span><span>₪ {new Intl.NumberFormat("en").format(total)}</span></p>
          </div>
        ) : null}
        <div className="mt-6 grid gap-3">
          <Link href="/customer/orders"><AppButton className="w-full">Track your order</AppButton></Link>
          <Link href="/sofas"><AppButton variant="outline" className="w-full">Continue shopping</AppButton></Link>
        </div>
      </div>
    </AppSection>
  );
}
