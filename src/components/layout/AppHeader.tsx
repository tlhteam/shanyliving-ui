"use client";

import Link from "next/link";
import debounce from "lodash.debounce";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "motion/react";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { AppMenu } from "@/components/app/AppMenu";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { WhatsappIcon } from "@/components/icons/WhatsappIcon";
import { AppLogo } from "@/components/layout/AppLogo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useCustomerCommerceStore } from "@/stores/customer-commerce-store";

const navItems = [
  { key: "sofas", href: "/sofas" },
  { key: "livingRoom", href: "/living-room" },
  { key: "dining", href: "/dining" },
  { key: "bedroom", href: "/bedroom" },
  { key: "newArrivals", href: "/new-arrivals" },
  { key: "inspiration", href: "/inspiration" },
  { key: "showroom", href: "/showroom" }
];

const announcementIcons = ["check", "message", "map-pin", "check", "message"] as const;

const searchableItems = [
  { title: "Cloud Modular", typeKey: "sofa", detailKey: "cloudModular", href: "/sofas/cloud-modular-sofa" },
  { title: "Luna Sofa", typeKey: "sofa", detailKey: "lunaSofa", href: "/sofas/luna-sofa" },
  { title: "Performance Linen", typeKey: "fabric", detailKey: "performanceLinen", href: "/customize-your-sofa" },
  { title: "Showroom Visit", typeKey: "service", detailKey: "showroomVisit", href: "/showroom" },
  { title: "Room Photo Advice", typeKey: "feature", detailKey: "roomPhoto", href: "/customize-your-sofa" }
];

export function AppHeader() {
  const t = useTranslations("header");
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { status } = useSession();
  const cartCount = useCustomerCommerceStore((state) => state.cart.reduce((sum, item) => sum + item.quantity, 0));
  const accountHref = status === "authenticated" ? "/customer" : "/login";
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "/contact";
  const debouncedQuery = useMemo(() => debounce(setQuery, 220), []);
  const announcements = (t.raw("announcements") as string[]).map((text, index) => ({
    text,
    icon: announcementIcons[index % announcementIcons.length]
  }));
  const menuItems = navItems.map((item) => ({ label: t(`nav.${item.key}`), href: item.href }));
  const results = searchableItems
    .map((item) => ({ ...item, type: t(`searchTypes.${item.typeKey}`), detail: t(`searchResults.${item.detailKey}`) }))
    .filter((item) => {
      const normalizedQuery = query.trim().toLowerCase();

      if (!normalizedQuery) {
        return true;
      }

      return [item.title, item.type, item.detail].some((value) => value.toLowerCase().includes(normalizedQuery));
    });

  useEffect(() => () => debouncedQuery.cancel(), [debouncedQuery]);

  useEffect(() => {
    if (searchOpen) {
      requestAnimationFrame(() => searchInputRef.current?.focus());
    }
  }, [searchOpen]);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setSearchValue(nextValue);
    debouncedQuery(nextValue);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchValue("");
    debouncedQuery.cancel();
    setQuery("");
  };

  return (
    <header className="sticky top-0 z-50 bg-white text-neutral-950 shadow-sm transition-colors dark:bg-neutral-950 dark:text-neutral-50">
      <div className="bg-black text-white">
        <div className="mx-auto max-w-7xl overflow-hidden px-4 sm:px-6 lg:px-8">
          <div className="flex whitespace-nowrap py-2 text-[11px] font-semibold">
            {[0, 1].map((copy) => (
              <div key={copy} aria-hidden={copy === 1} className="flex min-w-max animate-shany-marquee items-center gap-12 pe-12">
                {announcements.map(({ text, icon }) => (
                  <span key={`${copy}-${text}`} className="inline-flex items-center gap-2">
                    <SiteIcon name={icon} className="size-3.5" />
                    {text}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-2 px-4 sm:min-h-20 sm:gap-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-0.5 sm:gap-2">
          <button aria-label={t("openMenu")} className="rounded-md p-2 text-neutral-950 transition hover:bg-neutral-100 dark:text-neutral-50 dark:hover:bg-white/10 lg:hidden" onClick={() => setOpen(true)}>
            <SiteIcon name="menu" className="size-5" />
          </button>
          <Link
            href={accountHref}
            aria-label={t("account")}
            title={t("account")}
            className="rounded-md p-2 text-neutral-950 transition hover:bg-neutral-100 dark:text-neutral-50 dark:hover:bg-white/10"
          >
            <SiteIcon name="user" className="size-5" />
          </Link>
          <Link href={whatsappHref} target={whatsappNumber ? "_blank" : undefined} aria-label={t("whatsapp")} title={t("whatsapp")} className="rounded-md p-2 text-[#128c4a] transition hover:bg-neutral-100 dark:hover:bg-white/10">
            <WhatsappIcon className="size-5" />
          </Link>
          <Link
            href="/sofas"
            aria-label={t("search")}
            title={t("search")}
            className="rounded-md p-2 text-neutral-950 transition hover:bg-neutral-100 dark:text-neutral-50 dark:hover:bg-white/10"
            onClick={(event) => {
              event.preventDefault();
              setSearchOpen(true);
            }}
          >
            <SiteIcon name="search" className="size-5" />
          </Link>
          <Link href="/cart" aria-label="Cart" title="Cart" className="relative rounded-md p-2 text-neutral-950 transition hover:bg-neutral-100 dark:text-neutral-50 dark:hover:bg-white/10">
            <SiteIcon name="bag" className="size-5" />
            {cartCount > 0 ? <span className="absolute end-0 top-0 grid size-4 place-items-center rounded-full bg-neutral-950 text-[10px] font-bold text-white dark:bg-white dark:text-neutral-950">{cartCount}</span> : null}
          </Link>
          <LanguageSwitcher className="hidden sm:inline-flex" />
        </div>
        <AppMenu items={menuItems} className="hidden flex-1 justify-center gap-6 lg:flex xl:gap-7" />
        <AppLogo className="shrink-0" />
      </div>
      <AnimatePresence>
        {searchOpen ? (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.18 }} className="fixed inset-x-0 top-24 z-[70] border-t border-neutral-200 bg-white text-neutral-950 shadow-xl dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-50 sm:top-28">
            <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 rounded-md border border-neutral-300 bg-neutral-50 px-4 py-3 dark:border-white/15 dark:bg-neutral-900">
                <SiteIcon name="search" className="size-5 text-neutral-500 dark:text-neutral-300" />
                <input ref={searchInputRef} value={searchValue} onChange={handleSearch} placeholder={t("searchPlaceholder")} className="h-8 min-w-0 flex-1 bg-transparent text-sm font-medium text-neutral-950 outline-none placeholder:text-neutral-400 dark:text-neutral-50 dark:placeholder:text-neutral-500" />
                <button aria-label={t("closeSearch")} className="rounded-md p-1 transition hover:bg-neutral-200 dark:hover:bg-white/10" onClick={closeSearch}>
                  <SiteIcon name="x" className="size-5" />
                </button>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {results.map((item) => (
                  <Link key={item.title} href={item.href} onClick={closeSearch} className="rounded-lg border border-neutral-200 p-4 transition hover:-translate-y-0.5 hover:border-neutral-900 hover:shadow-md dark:border-white/10 dark:hover:border-white">
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">{item.type}</span>
                    <p className="mt-2 font-bold">{item.title}</p>
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{item.detail}</p>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden" onClick={() => setOpen(false)}>
          <div className="ms-auto flex h-full w-80 max-w-[86vw] flex-col overflow-y-auto bg-white p-5 text-neutral-950 shadow-xl dark:bg-neutral-950 dark:text-neutral-50" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between gap-3">
              <AppLogo imageClassName="w-28" />
              <button aria-label={t("closeMenu")} className="rounded-md p-2 hover:bg-neutral-100 dark:hover:bg-white/10" onClick={() => setOpen(false)}>
                <SiteIcon name="x" className="size-5" />
              </button>
            </div>
            <div className="mt-7 flex flex-col gap-4">
              {menuItems.map((item) => (
                <Link key={`${item.label}-${item.href}`} href={item.href} className="text-base font-semibold" onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-auto pt-8">
              <LanguageSwitcher variant="inline" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
