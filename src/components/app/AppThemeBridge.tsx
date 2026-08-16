"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useCustomerCommerceStore } from "@/stores/customer-commerce-store";

export function AppThemeBridge() {
  const { setTheme } = useTheme();
  const theme = useCustomerCommerceStore((state) => state.theme);

  useEffect(() => {
    setTheme(theme);
  }, [setTheme, theme]);

  return null;
}
