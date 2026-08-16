"use client";

import Link from "next/link";
import { AppButton } from "@/components/app/AppButton";
import { AppSection } from "@/components/app/AppSection";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { useCustomerCommerceStore } from "@/stores/customer-commerce-store";

export default function OrderConfirmationPage() {
  const reference = useCustomerCommerceStore((state) => state.lastOrderReference);
  const checkout = useCustomerCommerceStore((state) => state.checkout);

  return (
    <AppSection className="max-w-xl text-center">
      <div className="rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
        <span className="mx-auto grid size-20 place-items-center rounded-full bg-green-600 text-white">
          <SiteIcon name="check" className="size-10" />
        </span>
        <h1 className="mt-6 font-serif text-4xl font-bold">Thank you!</h1>
        <p className="mt-2 text-sm text-neutral-600">Your order has been confirmed.</p>
        <div className="mt-6 rounded-lg bg-neutral-50 p-5">
          <p className="text-xs text-neutral-500">Order number</p>
          <p className="mt-1 text-xl font-bold">{reference ?? "Pending reference"}</p>
          <p className="mt-4 text-sm text-neutral-600">We sent the details to {checkout.email || "your email"}.</p>
        </div>
        <div className="mt-6 grid gap-3">
          <Link href="/customer/orders"><AppButton className="w-full">Track your order</AppButton></Link>
          <Link href="/sofas"><AppButton variant="outline" className="w-full">Continue shopping</AppButton></Link>
        </div>
      </div>
    </AppSection>
  );
}
