"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type CustomerCommerceState = {
  theme: "light" | "dark" | "system";
  setTheme: (theme: CustomerCommerceState["theme"]) => void;
};

export const useCustomerCommerceStore = create<CustomerCommerceState>()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme) => set({ theme })
    }),
    {
      name: "shany-customer-commerce",
      partialize: (state) => ({ theme: state.theme })
    }
  )
);
