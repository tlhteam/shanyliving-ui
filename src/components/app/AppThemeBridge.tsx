"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useCustomerCommerceStore } from "@/stores/customer-commerce-store";

export function AppThemeBridge() {
  const { setTheme } = useTheme();
  const theme = useCustomerCommerceStore((state) => state.theme);
  const [hydrated, setHydrated] = useState(() => useCustomerCommerceStore.persist.hasHydrated());

  useEffect(() => {
    if (hydrated) {
      return;
    }

    const unsubscribe = useCustomerCommerceStore.persist.onFinishHydration(() => setHydrated(true));
    setHydrated(useCustomerCommerceStore.persist.hasHydrated());

    return unsubscribe;
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    setTheme(theme);
  }, [hydrated, setTheme, theme]);

  return null;
}
