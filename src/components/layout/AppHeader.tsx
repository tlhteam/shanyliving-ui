"use client";

import Link from "next/link";
import { CheckCircle2, MapPin, Menu, MessageCircle, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { AppMenu } from "@/components/app/AppMenu";
import { AppLogo } from "@/components/layout/AppLogo";

const items = [
  { label: "Sofas", href: "/sofas" },
  { label: "Living Room", href: "/sofas" },
  { label: "Dining", href: "/sofas" },
  { label: "Bedroom", href: "/sofas" },
  { label: "New Arrivals", href: "/sofas" },
  { label: "Inspiration", href: "/about" },
  { label: "Customize Your Sofa", href: "/sofas" },
  { label: "Showroom", href: "/contact" }
];

export function AppHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="bg-black text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2 text-[11px] sm:px-6 lg:flex-row lg:items-center lg:justify-center lg:gap-12 lg:px-8">
          <span className="inline-flex items-center gap-2"><CheckCircle2 className="size-3.5" /> Custom sizes, fabrics, and colors available</span>
          <span className="inline-flex items-center gap-2"><MessageCircle className="size-3.5" /> Personal consultation through WhatsApp</span>
          <span className="inline-flex items-center gap-2"><MapPin className="size-3.5" /> Visit our showroom at Herzl Street 34, Tel Aviv, Israel</span>
        </div>
      </div>
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-4">
          <button aria-label="Open menu" className="rounded-md p-2 transition hover:bg-neutral-100 lg:hidden" onClick={() => setOpen(true)}>
            <Menu className="size-5" />
          </button>
          <button aria-label="Shopping cart" className="rounded-md p-2 transition hover:bg-neutral-100">
            <ShoppingBag className="size-5" />
          </button>
          <button aria-label="WhatsApp" className="rounded-md p-2 transition hover:bg-neutral-100">
            <MessageCircle className="size-5" />
          </button>
          <button aria-label="Search" className="rounded-md p-2 transition hover:bg-neutral-100">
            <Search className="size-5" />
          </button>
        </div>
        <AppMenu items={items} className="hidden flex-1 justify-center gap-7 lg:flex" />
        <AppLogo className="shrink-0" />
      </div>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden" onClick={() => setOpen(false)}>
          <div className="ml-auto flex h-full w-80 max-w-[86vw] flex-col bg-white p-5 shadow-xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between">
              <AppLogo imageClassName="w-32" />
              <button aria-label="Close menu" className="rounded-md p-2 hover:bg-neutral-100" onClick={() => setOpen(false)}>
                <X className="size-5" />
              </button>
            </div>
            <div className="mt-8 flex flex-col gap-4">
              {items.map((item) => (
                <Link key={`${item.label}-${item.href}`} href={item.href} className="text-base font-semibold" onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
