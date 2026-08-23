"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { AppButton } from "@/components/app/AppButton";
import { AppImage } from "@/components/app/AppImage";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { formatMoney } from "@/lib/format";
import { storefrontProducts } from "@/lib/storefront-pages";
import { useCustomerCommerceStore } from "@/stores/customer-commerce-store";

export function CartDrawer() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const formatPrice = (price: number) => formatMoney(price, locale);
  const cart = useCustomerCommerceStore((state) => state.cart);
  const open = useCustomerCommerceStore((state) => state.cartOpen);
  const closeCart = useCustomerCommerceStore((state) => state.closeCart);
  const updateQuantity = useCustomerCommerceStore((state) => state.updateQuantity);
  const removeFromCart = useCustomerCommerceStore((state) => state.removeFromCart);
  const addToCart = useCustomerCommerceStore((state) => state.addToCart);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const suggestions = storefrontProducts.filter((product) => product.price > 0 && !cart.some((item) => item.slug === product.slug)).slice(0, 2);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90]">
      <button type="button" aria-label={t("close")} className="absolute inset-0 bg-black/25 backdrop-blur-[1px]" onClick={closeCart} />
      <aside className="absolute inset-y-0 end-0 flex w-full max-w-md flex-col border-s border-neutral-200 bg-white text-neutral-950 shadow-2xl dark:border-white/10 dark:bg-neutral-950 dark:text-white">
        <header className="flex items-center justify-between gap-3 border-b border-neutral-200 px-5 py-5 dark:border-white/10">
          <h2 className="font-serif text-2xl font-bold text-neutral-950 dark:text-white">{t("title", { count: cart.length })}</h2>
          <button type="button" aria-label={t("close")} onClick={closeCart} className="grid size-9 place-items-center rounded-md border border-neutral-200 transition hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-white/10">
            <SiteIcon name="x" className="size-4" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {cart.length === 0 ? (
            <div className="grid min-h-72 place-items-center rounded-lg border border-dashed border-neutral-300 text-center dark:border-white/15">
              <div>
                <SiteIcon name="bag" className="mx-auto size-10 text-neutral-400" />
                <p className="mt-3 font-bold">{t("empty")}</p>
                <Link href="/sofas" onClick={closeCart}><AppButton className="mt-5">{t("browse")}</AppButton></Link>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {cart.map((item) => (
                <article key={item.slug} className="grid grid-cols-[88px_1fr] gap-3">
                  <AppImage src={item.image} alt={item.name} className="aspect-square rounded-md" sizes="88px" />
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">{item.options?.size ?? t("standard")} / {item.options?.configuration ?? item.subcategory}</p>
                        <p className="mt-2 text-sm font-bold">{formatPrice(item.price)}</p>
                      </div>
                      <button type="button" aria-label={t("remove") + " " + item.name} onClick={() => removeFromCart(item.slug)} className="grid size-8 place-items-center rounded-md border border-neutral-200 dark:border-white/10">
                        <SiteIcon name="x" className="size-4" />
                      </button>
                    </div>
                    <div className="mt-3 inline-flex items-center rounded-md border border-neutral-300 dark:border-white/15">
                      <button type="button" aria-label={t("decrease")} className="grid size-9 place-items-center" onClick={() => updateQuantity(item.slug, item.quantity - 1)}>-</button>
                      <span className="grid size-9 place-items-center text-sm font-bold">{item.quantity}</span>
                      <button type="button" aria-label={t("increase")} className="grid size-9 place-items-center" onClick={() => updateQuantity(item.slug, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {suggestions.length > 0 ? (
            <div className="mt-8">
              <h3 className="font-serif text-xl font-bold">{t("alsoLike")}</h3>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {suggestions.map((product) => (
                  <button key={product.slug} type="button" onClick={() => addToCart(product)} className="rounded-lg border border-neutral-200 bg-white p-2 text-start dark:border-white/10 dark:bg-neutral-900">
                    <AppImage src={product.image} alt={product.name} className="aspect-square rounded-md" sizes="160px" />
                    <p className="mt-2 text-sm font-bold">{product.name}</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">{formatPrice(product.price)}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        <footer className="border-t border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950">
          <div className="space-y-3 text-sm">
            <p className="flex justify-between"><span>{t("subtotal")}</span><span>{formatPrice(subtotal)}</span></p>
            <p className="flex justify-between"><span>{t("shipping")}</span><span>{t("shippingNote")}</span></p>
            <p className="flex justify-between border-t border-neutral-200 pt-3 text-base font-bold dark:border-white/10"><span>{t("total")}</span><span>{formatPrice(subtotal)}</span></p>
          </div>
          <div className="mt-4 grid gap-2">
            <Link href="/checkout" onClick={closeCart}><AppButton className="w-full" disabled={cart.length === 0}>{t("checkout")}</AppButton></Link>
            <Link href="/cart" onClick={closeCart}><AppButton variant="outline" className="w-full">{t("editCart")}</AppButton></Link>
          </div>
        </footer>
      </aside>
    </div>
  );
}
