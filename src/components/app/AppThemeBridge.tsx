"use client";

import { useEffect, useRef } from "react";
import { useCustomerCommerceStore } from "@/stores/customer-commerce-store";

type AppTheme = "light" | "dark" | "system";

const storageKey = "shany-theme";
const commerceStorageKey = "shany-customer-commerce";

function systemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(theme: AppTheme) {
  return theme === "system" ? systemTheme() : theme;
}

function applyTheme(theme: AppTheme) {
  const resolved = resolveTheme(theme);
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.style.colorScheme = resolved;
  window.localStorage.setItem(storageKey, theme);
}

function savedTheme(): AppTheme | null {
  const direct = window.localStorage.getItem(storageKey);

  if (direct === "light" || direct === "dark" || direct === "system") {
    return direct;
  }

  try {
    const raw = window.localStorage.getItem(commerceStorageKey);
    const parsed = raw ? JSON.parse(raw) as { state?: { theme?: unknown } } : null;
    const theme = parsed?.state?.theme;

    return theme === "light" || theme === "dark" || theme === "system" ? theme : null;
  } catch {
    return null;
  }
}

export function AppThemeBridge() {
  const theme = useCustomerCommerceStore((state) => state.theme);
  const setCommerceTheme = useCustomerCommerceStore((state) => state.setTheme);
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) {
      return;
    }

    hydrated.current = true;
    const stored = savedTheme();

    if (stored && stored !== theme) {
      setCommerceTheme(stored);
    }
  }, [setCommerceTheme, theme]);

  useEffect(() => {
    if (!hydrated.current) {
      return;
    }

    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => applyTheme("system");
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, [theme]);

  return null;
}
