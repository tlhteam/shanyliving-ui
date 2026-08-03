"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, CreditCard, Gift, Heart, Home, LogOut, Mail, MapPin, Menu, Package, Settings, Sofa, User, X } from "lucide-react";
import { useState } from "react";
import { AppLogo } from "@/components/layout/AppLogo";
import { cn } from "@/lib/utils";
import { customer } from "@/lib/customer-panel";

const navItems = [
  { label: "Dashboard", href: "/customer", icon: Home },
  { label: "My Orders", href: "/customer/orders", icon: Package },
  { label: "Saved Designs", href: "/customer/saved-designs", icon: Sofa },
  { label: "Wishlist", href: "/customer/wishlist", icon: Heart },
  { label: "Messages", href: "/customer/messages", icon: Mail },
  { label: "Profile", href: "/customer/profile", icon: User },
  { label: "Addresses", href: "/customer/addresses", icon: MapPin },
  { label: "Gift Cards", href: "/customer/gift-cards", icon: Gift },
  { label: "Cards & Bank", href: "/customer/payments", icon: CreditCard },
  { label: "Settings", href: "/customer/settings", icon: Settings }
];

function CustomerSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col bg-neutral-100 px-5 py-8 text-neutral-950">
      <AppLogo imageClassName="w-36" />
      <nav className="mt-10 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} onClick={onNavigate} className={cn("flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold transition hover:bg-white", active && "bg-white shadow-sm")}>
              <item.icon className="size-5 stroke-[1.5]" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <Link href="/login" className="mt-auto flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold transition hover:bg-white">
        <LogOut className="size-5 stroke-[1.5]" />
        Logout
      </Link>
    </aside>
  );
}

export function CustomerTopbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="font-serif text-3xl font-bold text-neutral-950 sm:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-neutral-600">{subtitle}</p> : null}
      </div>
      <div className="flex items-center gap-4">
        <button className="relative grid size-10 place-items-center rounded-full border border-neutral-200 bg-white">
          <Bell className="size-5" />
          <span className="absolute end-1 top-1 size-2 rounded-full bg-red-500" />
        </button>
        <div className="flex items-center gap-3">
          <div className="size-10 overflow-hidden rounded-full bg-neutral-200" />
          <span className="hidden text-sm font-bold sm:block">{customer.name}</span>
        </div>
      </div>
    </div>
  );
}

export function CustomerShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 py-0 text-neutral-950 lg:py-8">
      <div className="mx-auto min-h-screen max-w-7xl bg-white lg:min-h-[calc(100vh-4rem)]">
        <div className="sticky top-0 z-40 flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 lg:hidden">
          <AppLogo imageClassName="w-32" />
          <button onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-md border border-neutral-200">
            <Menu className="size-5" />
          </button>
        </div>
        <div className="grid lg:grid-cols-[230px_1fr]">
          <div className="hidden lg:block">
            <CustomerSidebar />
          </div>
          <main className="min-w-0 px-4 py-8 sm:px-7 lg:px-10">{children}</main>
        </div>
      </div>
      {open ? (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">
          <div className="h-full w-80 max-w-[86vw] bg-neutral-100">
            <div className="flex items-center justify-between px-5 py-4">
              <AppLogo imageClassName="w-32" />
              <button onClick={() => setOpen(false)} className="grid size-9 place-items-center rounded-md bg-white">
                <X className="size-5" />
              </button>
            </div>
            <CustomerSidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
