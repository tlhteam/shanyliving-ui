"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StorefrontProduct } from "@/lib/storefront-pages";

export type CartItem = {
  slug: string;
  name: string;
  category: StorefrontProduct["category"];
  subcategory: string;
  image: string;
  price: number;
  quantity: number;
  options?: {
    size?: string;
    configuration?: string;
    fabric?: string;
    color?: string;
  };
};

export type CheckoutDetails = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  saveDetails: boolean;
};

type CustomerCommerceState = {
  cart: CartItem[];
  checkout: CheckoutDetails;
  theme: "light" | "dark" | "system";
  lastOrderReference: string | null;
  addToCart: (product: StorefrontProduct, options?: CartItem["options"]) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  removeFromCart: (slug: string) => void;
  clearCart: () => void;
  setCheckout: (details: Partial<CheckoutDetails>) => void;
  setTheme: (theme: CustomerCommerceState["theme"]) => void;
  setLastOrderReference: (reference: string | null) => void;
};

const emptyCheckout: CheckoutDetails = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  apartment: "",
  saveDetails: true
};

export const useCustomerCommerceStore = create<CustomerCommerceState>()(
  persist(
    (set) => ({
      cart: [],
      checkout: emptyCheckout,
      theme: "system",
      lastOrderReference: null,
      addToCart: (product, options) => set((state) => {
        const existing = state.cart.find((item) => item.slug === product.slug);

        if (existing) {
          return {
            cart: state.cart.map((item) => item.slug === product.slug ? { ...item, quantity: item.quantity + 1, options: options ?? item.options } : item)
          };
        }

        return {
          cart: [
            ...state.cart,
            {
              slug: product.slug,
              name: product.name,
              category: product.category,
              subcategory: product.subcategory,
              image: product.image,
              price: product.price,
              quantity: 1,
              options
            }
          ]
        };
      }),
      updateQuantity: (slug, quantity) => set((state) => ({
        cart: quantity <= 0 ? state.cart.filter((item) => item.slug !== slug) : state.cart.map((item) => item.slug === slug ? { ...item, quantity } : item)
      })),
      removeFromCart: (slug) => set((state) => ({ cart: state.cart.filter((item) => item.slug !== slug) })),
      clearCart: () => set({ cart: [] }),
      setCheckout: (details) => set((state) => ({ checkout: { ...state.checkout, ...details } })),
      setTheme: (theme) => set({ theme }),
      setLastOrderReference: (reference) => set({ lastOrderReference: reference })
    }),
    { name: "shany-customer-commerce" }
  )
);
