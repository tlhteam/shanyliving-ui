"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { AppButton } from "@/components/app/AppButton";
import { AppImage } from "@/components/app/AppImage";
import { AppSection } from "@/components/app/AppSection";
import { SignInGate } from "@/components/storefront/SignInGate";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { useApi } from "@/hooks/use-api";
import { formatMoney } from "@/lib/format";
import { useCustomerQuery } from "@/hooks/use-customer";
import { useCustomerCommerceStore } from "@/stores/customer-commerce-store";
import type { CustomerAddress, CustomerProfile } from "@/types/customer";

type OrderResponse = {
  id: number;
  reference: string;
};

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const formatPrice = (price: number) => formatMoney(price, locale);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { request } = useApi();
  const cart = useCustomerCommerceStore((state) => state.cart);
  const checkout = useCustomerCommerceStore((state) => state.checkout);
  const setCheckout = useCustomerCommerceStore((state) => state.setCheckout);
  const clearCart = useCustomerCommerceStore((state) => state.clearCart);
  const setLastOrderReference = useCustomerCommerceStore((state) => state.setLastOrderReference);
  const setLastOrderItems = useCustomerCommerceStore((state) => state.setLastOrderItems);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const profileQuery = useCustomerQuery<CustomerProfile>("profile", "/customer/profile");
  const addressesQuery = useCustomerQuery<CustomerAddress[]>("addresses", "/customer/addresses");
  const defaultAddress = addressesQuery.data?.find((address) => address.is_default) ?? addressesQuery.data?.[0];

  useEffect(() => {
    const profile = profileQuery.data;

    if (!profile) {
      return;
    }

    setCheckout({
      fullName: checkout.fullName || profile.name || "",
      email: checkout.email || profile.email || "",
      phone: checkout.phone || profile.phone || ""
    });
  }, [checkout.email, checkout.fullName, checkout.phone, profileQuery.data, setCheckout]);

  useEffect(() => {
    if (!defaultAddress) {
      return;
    }

    setCheckout({
      address: checkout.address || [defaultAddress.line1, defaultAddress.city].filter(Boolean).join(", "),
      apartment: checkout.apartment || defaultAddress.line2 || "",
      phone: checkout.phone || defaultAddress.phone || ""
    });
  }, [checkout.address, checkout.apartment, checkout.phone, defaultAddress, setCheckout]);

  const createOrder = useMutation({
    mutationFn: () => request<OrderResponse>("/customer-flow/orders", {
      method: "POST",
      body: {
        source: "storefront_checkout",
        customer_name: checkout.fullName || session?.user?.name,
        customer_email: checkout.email || session?.user?.email,
        customer_phone: checkout.phone,
        shipping_address: {
          line1: checkout.address,
          line2: checkout.apartment,
          country: "Israel"
        },
        currency: "ILS",
        locale,
        meta: {
          checkout_saved_details: checkout.saveDetails,
          cart_source: "zustand"
        },
        items: cart.map((item) => ({
          name: item.name,
          sku: item.slug,
          quantity: item.quantity,
          unit_price: item.price,
          options: item.options
        }))
      }
    }),
    onSuccess: (order) => {
      setLastOrderReference(order.reference);
      setLastOrderItems(cart);
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["customer", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["customer", "dashboard"] });
      toast.success(order.reference, { description: t("paymentPending") });
      router.push("/order-confirmation");
    },
    onError: (error: Error) => toast.error(error.message)
  });

  const isAdmin = session?.user?.role === "admin";
  const signedIn = status === "authenticated";

  return (
    <div className="bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
    <AppSection className="max-w-5xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold sm:text-4xl">{t("title")}</h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{t("subtitle")}</p>
      </div>
      <div className="mb-8 flex items-center gap-3 text-sm font-bold">
        <span className="grid size-8 place-items-center rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">1</span>
        <span className="h-px flex-1 bg-neutral-300 dark:bg-white/15" />
        <span className="grid size-8 place-items-center rounded-full border border-neutral-300 dark:border-white/20">2</span>
        <span className="h-px flex-1 bg-neutral-300 dark:bg-white/15" />
        <span className="grid size-8 place-items-center rounded-full border border-neutral-300 dark:border-white/20">3</span>
      </div>

      {status !== "authenticated" ? (
        <div className="mb-6">
          <SignInGate namespace="checkout" callbackUrl="/checkout" />
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="rounded-lg border border-neutral-200 bg-white p-5 text-neutral-950 shadow-sm dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50">
          <h2 className="font-serif text-2xl font-bold">{t("contact")}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <input value={checkout.fullName} onChange={(event) => setCheckout({ fullName: event.target.value })} placeholder={t("fullName")} className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-950 placeholder:text-neutral-400 dark:border-white/15 dark:bg-neutral-950 dark:text-white" />
            <input value={checkout.email} onChange={(event) => setCheckout({ email: event.target.value })} placeholder={t("email")} className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-950 placeholder:text-neutral-400 dark:border-white/15 dark:bg-neutral-950 dark:text-white" />
            <input value={checkout.phone} onChange={(event) => setCheckout({ phone: event.target.value })} placeholder={t("phone")} className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-950 placeholder:text-neutral-400 dark:border-white/15 dark:bg-neutral-950 dark:text-white" />
            <input value={checkout.address} onChange={(event) => setCheckout({ address: event.target.value })} placeholder={t("address")} className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-950 placeholder:text-neutral-400 dark:border-white/15 dark:bg-neutral-950 dark:text-white" />
            <input value={checkout.apartment} onChange={(event) => setCheckout({ apartment: event.target.value })} placeholder={t("apartment")} className="h-11 rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-950 placeholder:text-neutral-400 dark:border-white/15 dark:bg-neutral-950 dark:text-white sm:col-span-2" />
          </div>
          <label className="mt-5 flex items-center gap-3 text-sm font-bold text-neutral-800 dark:text-neutral-100">
            <input type="checkbox" checked={checkout.saveDetails} onChange={(event) => setCheckout({ saveDetails: event.target.checked })} />
            {t("saveDetails")}
          </label>
          {isAdmin ? <p className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-200">{t("adminBlocked")}</p> : null}
          <AppButton className="mt-6 w-full" loading={createOrder.isPending} disabled={isAdmin || !signedIn || cart.length === 0 || !checkout.fullName || !checkout.email || !checkout.phone || !checkout.address} onClick={() => createOrder.mutate()}>
            {t("continue")}
          </AppButton>
        </div>

        <aside className="h-fit rounded-lg border border-neutral-200 bg-white p-5 text-neutral-950 shadow-sm dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50">
          <h2 className="font-serif text-2xl font-bold">{t("summary")}</h2>
          <div className="mt-5 space-y-4">
            {cart.map((item) => (
              <div key={item.slug} className="grid grid-cols-[72px_1fr] gap-3">
                <AppImage src={item.image} alt={item.name} className="aspect-square rounded-md" sizes="72px" />
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">{t("each", { quantity: item.quantity, price: formatPrice(item.price) })}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 flex justify-between border-t border-neutral-200 pt-4 font-bold dark:border-white/10"><span>{t("total")}</span><span>{formatPrice(subtotal)}</span></p>
          <div className="mt-5 flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
            <SiteIcon name="lock" className="size-4" />
            {t("secureNote")}
          </div>
          {cart.length > 0 ? (
            <Link href={`/customize-your-sofa?product=${cart[0].slug}&step=room`} className="block">
              <AppButton variant="outline" className="mt-5 w-full gap-2">
                <SiteIcon name="sparkle" className="size-4" />
                {t("preview")}
              </AppButton>
            </Link>
          ) : null}
        </aside>
      </div>
    </AppSection>
    </div>
  );
}
