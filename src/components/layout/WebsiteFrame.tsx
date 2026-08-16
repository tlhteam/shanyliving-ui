"use client";

import { usePathname } from "next/navigation";
import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";

export function WebsiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome = pathname.startsWith("/customize-your-sofa");

  return (
    <div className="bg-white text-neutral-950 transition-colors dark:bg-neutral-950 dark:text-neutral-50">
      {hideChrome ? null : <AppHeader />}
      <main>{children}</main>
      {hideChrome ? null : <AppFooter />}
    </div>
  );
}
