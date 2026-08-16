"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppButton } from "@/components/app/AppButton";
import { AppImage } from "@/components/app/AppImage";
import { AppSection } from "@/components/app/AppSection";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { useApi } from "@/hooks/use-api";
import { useCustomerCommerceStore } from "@/stores/customer-commerce-store";

type OrderResponse = {
  id: number;
  reference: string;
};

const formatPrice = (price: number) => `NIS ${new Intl.NumberFormat("en").format(price)}`;

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { request } = useApi();
  const cart = useCustomerCommerceStore((state) => state.cart);
  const checkout = useCustomerCommerceStore((state) => state.checkout);
  const setCheckout = useCustomerCommerceStore((state) => state.setCheckout);
  const clearCart = useCustomerCommerceStore((state) => state.clearCart);
  const setLastOrderReference = useCustomerCommerceStore((state) => state.setLastOrderReference);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
      clearCart();
      toast.success(`Order ${order.reference} created.`);
      router.push("/order-confirmation");
    },
    onError: (error: Error) => toast.error(error.message)
  });

  return (
    <AppSection className="max-w-5xl">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold">Checkout</h1>
        <p className="mt-2 text-sm text-neutral-600">Add contact and delivery details to create the order.</p>
      </div>
      <div className="mb-8 flex items-center gap-3 text-sm font-bold">
        <span className="grid size-8 place-items-center rounded-full bg-neutral-950 text-white">1</span>
        <span className="h-px flex-1 bg-neutral-300" />
        <span className="grid size-8 place-items-center rounded-full border border-neutral-300">2</span>
        <span className="h-px flex-1 bg-neutral-300" />
        <span className="grid size-8 place-items-center rounded-full border border-neutral-300">3</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <h2 className="font-serif text-2xl font-bold">Contact Information</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <input value={checkout.fullName} onChange={(event) => setCheckout({ fullName: event.target.value })} placeholder="Full name" className="h-11 rounded-md border border-neutral-300 px-3 text-sm" />
            <input value={checkout.email} onChange={(event) => setCheckout({ email: event.target.value })} placeholder="Email" className="h-11 rounded-md border border-neutral-300 px-3 text-sm" />
            <input value={checkout.phone} onChange={(event) => setCheckout({ phone: event.target.value })} placeholder="Phone" className="h-11 rounded-md border border-neutral-300 px-3 text-sm" />
            <input value={checkout.address} onChange={(event) => setCheckout({ address: event.target.value })} placeholder="Delivery address" className="h-11 rounded-md border border-neutral-300 px-3 text-sm" />
            <input value={checkout.apartment} onChange={(event) => setCheckout({ apartment: event.target.value })} placeholder="Apartment, floor, etc." className="h-11 rounded-md border border-neutral-300 px-3 text-sm sm:col-span-2" />
          </div>
          <label className="mt-5 flex items-center gap-3 text-sm font-bold">
            <input type="checkbox" checked={checkout.saveDetails} onChange={(event) => setCheckout({ saveDetails: event.target.checked })} />
            Save my details for next time
          </label>
          <AppButton className="mt-6 w-full" loading={createOrder.isPending} disabled={cart.length === 0 || !checkout.fullName || !checkout.email || !checkout.phone || !checkout.address} onClick={() => createOrder.mutate()}>
            Continue
          </AppButton>
        </div>

        <aside className="h-fit rounded-lg border border-neutral-200 bg-white p-5">
          <h2 className="font-serif text-2xl font-bold">Order Summary</h2>
          <div className="mt-5 space-y-4">
            {cart.map((item) => (
              <div key={item.slug} className="grid grid-cols-[72px_1fr] gap-3">
                <AppImage src={item.image} alt={item.name} className="aspect-square rounded-md" sizes="72px" />
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-xs text-neutral-600">{item.quantity} x {formatPrice(item.price)}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 flex justify-between border-t border-neutral-200 pt-4 font-bold"><span>Total</span><span>{formatPrice(subtotal)}</span></p>
          <div className="mt-5 flex items-center gap-2 text-xs text-neutral-600">
            <SiteIcon name="lock" className="size-4" />
            Secure order creation. Payment gateway can be connected from backend settings.
          </div>
        </aside>
      </div>
    </AppSection>
  );
}
