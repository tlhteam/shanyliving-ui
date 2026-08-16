"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCustomerCommerceStore } from "@/stores/customer-commerce-store";

export function AppThemeToggle() {
  const theme = useCustomerCommerceStore((state) => state.theme);
  const setCommerceTheme = useCustomerCommerceStore((state) => state.setTheme);
  const nextTheme = theme === "dark" ? "light" : "dark";

  const updateTheme = () => {
    setCommerceTheme(nextTheme);
  };

  return (
    <Button aria-label="Toggle theme" variant="outline" size="icon" onClick={updateTheme}>
      <Sun className="size-4 dark:hidden" />
      <Moon className="hidden size-4 dark:block" />
    </Button>
  );
}
