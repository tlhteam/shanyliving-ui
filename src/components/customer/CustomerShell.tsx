"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { CreditCard, Gift, Heart, Home, Mail, MapPin, Menu, Package, PanelLeftClose, PanelLeftOpen, Settings, ShoppingCart, Sofa, User } from "lucide-react";
import { useState } from "react";
import { AppAccountMenu } from "@/components/app/AppAccountMenu";
import { AppNotificationBell } from "@/components/app/AppNotificationBell";
import { CustomerFirstLoginTour } from "@/components/customer/CustomerFirstLoginTour";
import { AppLogo } from "@/components/layout/AppLogo";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { persistSidebarPreference, sidebarCookies } from "@/lib/sidebar-preference";
import { useNotifications } from "@/hooks/use-notifications";
import { customer } from "@/lib/customer-panel";

const navItems = [
  { label: "Dashboard", href: "/customer", icon: Home },
  { label: "My Orders", href: "/customer/orders", icon: Package },
  { label: "Cart & Checkout", href: "/cart", icon: ShoppingCart },
  { label: "Saved Designs", href: "/customer/saved-designs", icon: Sofa },
  { label: "Wishlist", href: "/customer/wishlist", icon: Heart },
  { label: "Messages", href: "/customer/messages", icon: Mail },
  { label: "Profile", href: "/customer/profile", icon: User },
  { label: "Addresses", href: "/customer/addresses", icon: MapPin },
  { label: "Gift Cards", href: "/customer/gift-cards", icon: Gift },
  { label: "Cards & Bank", href: "/customer/payments", icon: CreditCard },
  { label: "Settings", href: "/customer/settings", icon: Settings }
];

function CustomerNav({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1" data-tour="customer-nav">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition",
              collapsed && "justify-center px-0",
              active ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950" : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-white/10"
            )}
          >
            <Icon className="size-5 shrink-0 stroke-[1.5]" />
            {collapsed ? <span className="sr-only">{label}</span> : label}
          </Link>
        );
      })}
    </nav>
  );
}

export function CustomerTopbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-7">
      <h1 className="font-serif text-2xl font-bold text-neutral-950 dark:text-neutral-50 sm:text-3xl lg:text-4xl">{title}</h1>
      {subtitle ? <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{subtitle}</p> : null}
    </div>
  );
}

export function CustomerShell({ children, defaultCollapsed = false }: { children: React.ReactNode; defaultCollapsed?: boolean }) {
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  const notificationsQuery = useNotifications("customer");
  const name = session?.user?.name ?? customer.name;
  const email = session?.user?.email ?? customer.email;
  const avatar = session?.user?.image ?? customer.avatar;

  const toggleCollapsed = () => {
    setCollapsed((previous) => {
      const next = !previous;
      persistSidebarPreference(sidebarCookies.customer, next);

      return next;
    });
  };

  return (
    <div className="customer-theme flex min-h-screen w-full bg-neutral-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-e border-neutral-200 bg-white p-4 transition-[width] duration-200 dark:border-white/10 dark:bg-neutral-900 lg:flex",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between")}>
          {collapsed ? null : (
            <>
              <AppLogo className="dark:hidden" imageClassName="w-32" />
              <AppLogo variant="light" className="hidden dark:inline-flex" imageClassName="w-32" />
            </>
          )}
          <Button variant="ghost" size="icon" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} onClick={toggleCollapsed}>
            {collapsed ? <PanelLeftOpen className="size-5" /> : <PanelLeftClose className="size-5" />}
          </Button>
        </div>
        <div className="mt-8 min-h-0 flex-1 overflow-y-auto">
          <CustomerNav collapsed={collapsed} />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-neutral-200 bg-white/90 px-4 backdrop-blur dark:border-white/10 dark:bg-neutral-900/90 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger render={<Button variant="outline" size="icon" aria-label="Open menu" className="lg:hidden" />}>
                <Menu className="size-4" />
              </SheetTrigger>
              <SheetContent side="left" className="w-80 max-w-[86vw] bg-white p-0">
                <SheetHeader>
                  <SheetTitle>My account</SheetTitle>
                </SheetHeader>
                <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
                  <CustomerNav onNavigate={() => setMobileOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
            <AppLogo className="dark:hidden lg:hidden" imageClassName="w-28" />
            <AppLogo variant="light" className="hidden dark:inline-flex lg:hidden" imageClassName="w-28" />
            <div className="hidden min-w-0 lg:block">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-neutral-500">My Account</p>
              <p className="truncate text-xs text-neutral-500">Orders, designs, wishlist and messages</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div data-tour="customer-notifications">
              <AppNotificationBell items={notificationsQuery.data ?? []} viewAllHref="/customer/messages" />
            </div>
            <div data-tour="customer-profile">
              <AppAccountMenu
                name={name}
                email={email}
                avatar={avatar}
                profileHref="/customer/profile"
                settingsHref="/customer/settings"
                showName
              />
            </div>
          </div>
        </header>
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</main>
        <CustomerFirstLoginTour />
      </div>
    </div>
  );
}
