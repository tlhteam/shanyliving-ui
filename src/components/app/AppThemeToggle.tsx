"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useCustomerCommerceStore } from "@/stores/customer-commerce-store";

export function AppThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const setCommerceTheme = useCustomerCommerceStore((state) => state.setTheme);
  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

  const updateTheme = () => {
    setCommerceTheme(nextTheme);
    setTheme(nextTheme);
  };

  return (
    <Button aria-label="Toggle theme" variant="outline" size="icon" onClick={updateTheme}>
      <Sun className="size-4 dark:hidden" />
      <Moon className="hidden size-4 dark:block" />
    </Button>
  );
}
