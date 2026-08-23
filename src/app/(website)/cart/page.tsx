"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { AppButton } from "@/components/app/AppButton";
import { AppImage } from "@/components/app/AppImage";
import { AppSection } from "@/components/app/AppSection";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { SignInGate } from "@/components/storefront/SignInGate";
import { formatMoney } from "@/lib/format";
import { storefrontProducts } from "@/lib/storefront-pages";
import { useCustomerCommerceStore } from "@/stores/customer-commerce-store";

export default function CartPage() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const { status } = useSession();
  const formatPrice = (price: number) => formatMoney(price, locale);
  const cart = useCustomerCommerceStore((state) => state.cart);
  const updateQuantity = useCustomerCommerceStore((state) => state.updateQuantity);
  const removeFromCart = useCustomerCommerceStore((state) => state.removeFromCart);
  const addToCart = useCustomerCommerceStore((state) => state.addToCart);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const suggestions = storefrontProducts.filter((product) => product.price > 0 && !cart.some((item) => item.slug === product.slug)).slice(0, 2);

  return (
    <AppSection className="max-w-4xl">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold sm:text-4xl">{t("title", { count: cart.length })}</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{t("subtitle")}</p>
        </div>
        <Link href="/sofas" className="shrink-0"><AppButton variant="outline">{t("continueShopping")}</AppButton></Link>
      </div>

      {cart.length === 0 ? (
        <div className="grid place-items-center rounded-lg border border-neutral-200 bg-white p-12 text-center dark:border-white/10 dark:bg-neutral-900">
          <SiteIcon name="bag" className="size-10 text-neutral-400" />
          <p className="mt-3 font-bold">{t("empty")}</p>
          <Link href="/sofas"><AppButton className="mt-5">{t("browse")}</AppButton></Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-4">
            {cart.map((item) => (
              <article key={item.slug} className="grid gap-4 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900 sm:grid-cols-[120px_1fr_auto]">
                <AppImage src={item.image} alt={item.name} className="aspect-square rounded-md" sizes="120px" />
                <div>
                  <h2 className="font-serif text-2xl font-bold">{item.name}</h2>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{item.options?.size ?? "Standard"} / {item.options?.configuration ?? item.subcategory}</p>
                  <p className="mt-3 font-bold">{formatPrice(item.price)}</p>
                  <button type="button" className="mt-3 text-xs font-bold text-neutral-500 underline dark:text-neutral-400" onClick={() => removeFromCart(item.slug)}>{t("remove")}</button>
                </div>
                <div className="flex items-center gap-2 self-start">
                  <button type="button" className="grid size-9 place-items-center rounded-md border border-neutral-300 dark:border-white/15" onClick={() => updateQuantity(item.slug, item.quantity - 1)}>-</button>
                  <span className="grid size-9 place-items-center text-sm font-bold">{item.quantity}</span>
                  <button type="button" className="grid size-9 place-items-center rounded-md border border-neutral-300 dark:border-white/15" onClick={() => updateQuantity(item.slug, item.quantity + 1)}>+</button>
                </div>
              </article>
            ))}
          </div>
          <aside className="h-fit rounded-lg border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral-900">
            <h2 className="font-serif text-2xl font-bold">{t("subtotal")}</h2>
            <div className="mt-5 space-y-3 text-sm">
              <p className="flex justify-between"><span>{t("subtotal")}</span><span>{formatPrice(subtotal)}</span></p>
              <p className="flex justify-between"><span>Shipping</span><span>Calculated after review</span></p>
              <p className="flex justify-between border-t border-neutral-200 pt-3 text-base font-bold dark:border-white/10"><span>Total</span><span>{formatPrice(subtotal)}</span></p>
            </div>
            {status === "authenticated" ? (
              <Link href="/checkout" className="block"><AppButton className="mt-5 w-full">{t("checkout")}</AppButton></Link>
            ) : (
              <p className="mt-5 text-xs leading-5 text-neutral-600 dark:text-neutral-400">{t("signInText")}</p>
            )}
          </aside>
        </div>
      )}

      {cart.length > 0 && status !== "authenticated" ? (
        <div className="mt-6">
          <SignInGate namespace="cart" callbackUrl="/checkout" />
        </div>
      ) : null}

      {suggestions.length > 0 ? (
        <div className="mt-10">
          <h2 className="font-serif text-2xl font-bold">{t("alsoLike")}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {suggestions.map((product) => (
              <div key={product.slug} className="grid grid-cols-[96px_1fr_auto] items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3 dark:border-white/10 dark:bg-neutral-900">
                <Link href={`/sofas/${product.slug}`} className="contents">
                <AppImage src={product.image} alt={product.name} className="aspect-square rounded-md" sizes="110px" />
                <div>
                  <p className="font-bold">{product.name}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{formatPrice(product.price)}</p>
                </div>
                </Link>
                <button
                  type="button"
                  aria-label={t("alsoLike")}
                  onClick={() => {
                    addToCart(product, { size: product.seatRange ?? "Standard", configuration: product.subcategory, color: product.colors?.[0] });
                    toast.success(product.name);
                  }}
                  className="grid size-9 place-items-center rounded-full bg-neutral-950 text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950"
                >
                  <SiteIcon name="plus" className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </AppSection>
  );
}
