"use client";

import Link from "next/link";
import debounce from "lodash.debounce";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "motion/react";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Heart, MapPin, MessageSquare, Search, User, X } from "lucide-react";
import { AppLogo } from "@/components/layout/AppLogo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { categoryHref, productCategoryHref } from "@/lib/categories";
import { localizedProductName } from "@/lib/storefront-pages";
import { useCatalogCategories } from "@/hooks/use-catalog-categories";
import { useCatalogProducts } from "@/hooks/use-catalog-products";

const navItems = [
  { key: "collections", href: "/collections" },
  { key: "howItWorks", href: "/#journey" },
  { key: "about", href: "/#about" }
];

const quickSearchCategories = ["sofas", "living-room", "dining", "bedroom"];

const announcementIcons = [Check, MessageSquare, MapPin, Check, MessageSquare] as const;

export function AppHeader() {
  const t = useTranslations("header");
  const tDetail = useTranslations("storefront.detail");
  const tCategories = useTranslations("categories");
  const locale = useLocale();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { status } = useSession();
  const accountHref = status === "authenticated" ? "/customer" : "/login";
  const debouncedQuery = useMemo(() => debounce(setQuery, 220), []);
  const { products: catalogProducts } = useCatalogProducts();
  const { categories } = useCatalogCategories();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const categoryLinks = categories.map((category) => ({
    key: category.slug,
    label: category.name || (tCategories.has(category.slug) ? tCategories(category.slug) : category.slug),
    href: categoryHref(category.slug)
  }));
  const announcements = (t.raw("announcements") as string[]).map((text, index) => ({
    text,
    icon: announcementIcons[index % announcementIcons.length]
  }));
  const menuItems = navItems.map((item) => ({ label: t(`nav.${item.key}`), href: item.href }));
  const normalizedQuery = query.trim().toLowerCase();
  const results = normalizedQuery
    ? catalogProducts
        .filter((product) => `${localizedProductName(product, locale)} ${product.name} ${product.subcategory}`.toLowerCase().includes(normalizedQuery))
        .slice(0, 8)
        .map((product) => ({
          title: localizedProductName(product, locale),
          type: tDetail.has(`collectionLabels.${product.category}`) ? tDetail(`collectionLabels.${product.category}`) : product.category,
          detail: product.subcategory,
          href: `/sofas/${product.slug}`
        }))
    : [];
  const quickLinks = quickSearchCategories.map((category) => ({
    label: tDetail.has(`collectionLabels.${category}`) ? tDetail(`collectionLabels.${category}`) : category,
    href: productCategoryHref[category] ?? "/collections"
  }));

  useEffect(() => () => debouncedQuery.cancel(), [debouncedQuery]);

  useEffect(() => {
    if (!categoriesOpen) {
      return;
    }

    const close = (event: MouseEvent) => {
      if (!categoriesRef.current?.contains(event.target as Node)) {
        setCategoriesOpen(false);
      }
    };

    document.addEventListener("pointerdown", close);

    return () => document.removeEventListener("pointerdown", close);
  }, [categoriesOpen]);

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
              <div key={copy} aria-hidden={copy === 1} className="flex min-w-max animate-shany-marquee items-center gap-8 pe-8 sm:gap-12 sm:pe-12">
                {announcements.map(({ text, icon: Icon }) => (
                  <span key={`${copy}-${text}`} className="inline-flex items-center gap-2">
                    <Icon className="size-3.5 shrink-0" />
                    {text}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-2 px-4 sm:min-h-20 sm:gap-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 sm:gap-6 xl:gap-7">
          <AppLogo className="shrink-0" />
          <nav className="hidden items-center gap-6 lg:flex xl:gap-7">
            {categoryLinks.length ? (
              <div ref={categoriesRef} className="relative">
                <button
                  type="button"
                  aria-expanded={categoriesOpen}
                  aria-haspopup="true"
                  onClick={() => setCategoriesOpen((open) => !open)}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-neutral-800 transition hover:text-neutral-950 dark:text-neutral-200 dark:hover:text-white"
                >
                  {t("nav.categories")}
                  <ChevronDown className={`size-3.5 transition ${categoriesOpen ? "rotate-180" : ""}`} />
                </button>
                {categoriesOpen ? (
                  <div className="absolute top-full start-0 z-50 mt-3 w-56 overflow-hidden rounded-lg border border-neutral-200 bg-white py-1.5 shadow-[var(--shadow-elevation-2)] dark:border-white/15 dark:bg-neutral-950">
                    {categoryLinks.map((category) => (
                      <Link
                        key={category.key}
                        href={category.href}
                        onClick={() => setCategoriesOpen(false)}
                        className="block px-4 py-2.5 text-sm font-semibold transition hover:bg-neutral-100 dark:hover:bg-white/10"
                      >
                        {category.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-bold text-neutral-800 transition hover:text-neutral-950 dark:text-neutral-200 dark:hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-0.5 sm:gap-2">
          <div className="relative hidden items-center sm:flex">
            <Search className="pointer-events-none absolute start-3 size-4 text-neutral-500 dark:text-neutral-300" />
            <input
              value={searchValue}
              onChange={handleSearch}
              onFocus={() => setSearchOpen(true)}
              placeholder={t("explorePlaceholder")}
              aria-label={t("search")}
              className="h-9 w-32 rounded-full border border-neutral-300 bg-neutral-50 ps-9 pe-3 text-sm text-neutral-950 outline-none placeholder:text-neutral-400 focus:border-neutral-900 dark:border-white/15 dark:bg-neutral-900 dark:text-neutral-50 dark:placeholder:text-neutral-500 dark:focus:border-white lg:w-44"
            />
          </div>
          <button
            type="button"
            aria-label={t("search")}
            title={t("search")}
            className="rounded-md p-2 text-neutral-950 transition hover:bg-neutral-100 dark:text-neutral-50 dark:hover:bg-white/10 sm:hidden"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="size-5" />
          </button>
          {status === "authenticated" ? (
            <Link
              href="/customer/wishlist"
              aria-label={t("wishlist")}
              title={t("wishlist")}
              className="rounded-md p-2 text-neutral-950 transition hover:bg-neutral-100 dark:text-neutral-50 dark:hover:bg-white/10"
            >
              <Heart className="size-5" />
            </Link>
          ) : null}
          <Link
            href={accountHref}
            aria-label={t("account")}
            title={t("account")}
            className="rounded-md p-2 text-neutral-950 transition hover:bg-neutral-100 dark:text-neutral-50 dark:hover:bg-white/10"
          >
            <User className="size-5" />
          </Link>
          <LanguageSwitcher />
        </div>
      </div>

      {categoryLinks.length ? (
        <div className="border-t border-neutral-200 lg:hidden dark:border-white/10">
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden">
            {[...categoryLinks, ...menuItems.map((item) => ({ key: item.href, label: item.label, href: item.href }))].map(
              (item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="shrink-0 rounded-full border border-neutral-300 px-3.5 py-1.5 text-xs font-bold text-neutral-800 transition hover:border-neutral-950 hover:bg-neutral-950 hover:text-white dark:border-white/15 dark:text-neutral-200 dark:hover:border-white dark:hover:bg-white dark:hover:text-neutral-950"
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        </div>
      ) : null}

      <AnimatePresence>
        {searchOpen ? (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.18 }} className="fixed inset-x-0 top-24 z-[70] border-t border-neutral-200 bg-white text-neutral-950 shadow-xl dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-50 sm:top-28">
            <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 rounded-md border border-neutral-300 bg-neutral-50 px-4 py-3 dark:border-white/15 dark:bg-neutral-900">
                <Search className="size-5 text-neutral-500 dark:text-neutral-300" />
                <input ref={searchInputRef} value={searchValue} onChange={handleSearch} placeholder={t("searchPlaceholder")} className="h-8 min-w-0 flex-1 bg-transparent text-sm font-medium text-neutral-950 outline-none placeholder:text-neutral-400 dark:text-neutral-50 dark:placeholder:text-neutral-500" />
                <button aria-label={t("closeSearch")} className="rounded-md p-1 transition hover:bg-neutral-200 dark:hover:bg-white/10" onClick={closeSearch}>
                  <X className="size-5" />
                </button>
              </div>

              {!normalizedQuery ? (
                <div className="mt-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">{t("quickCategories")}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {quickLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={closeSearch}
                        className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-bold transition hover:border-neutral-950 hover:bg-neutral-950 hover:text-white dark:border-white/15 dark:hover:border-white dark:hover:bg-white dark:hover:text-neutral-950"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : results.length ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {results.map((item) => (
                    <Link key={item.href} href={item.href} onClick={closeSearch} className="rounded-lg border border-neutral-200 p-4 transition hover:-translate-y-0.5 hover:border-neutral-900 hover:shadow-md dark:border-white/10 dark:hover:border-white">
                      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">{item.type}</span>
                      <p className="mt-2 font-bold">{item.title}</p>
                      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{item.detail}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">{t("noResults")}</p>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
