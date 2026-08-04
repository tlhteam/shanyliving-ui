"use client";

import Link from "next/link";
import debounce from "lodash.debounce";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, MapPin, Menu, MessageCircle, Search, UserRound, X } from "lucide-react";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { AppButton } from "@/components/app/AppButton";
import { AppDialog } from "@/components/app/AppDialog";
import { AppMenu } from "@/components/app/AppMenu";
import { WhatsappIcon } from "@/components/icons/WhatsappIcon";
import { AppLogo } from "@/components/layout/AppLogo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

const navItems = [
  { key: "sofas", href: "/sofas" },
  { key: "livingRoom", href: "/living-room" },
  { key: "dining", href: "/dining" },
  { key: "bedroom", href: "/bedroom" },
  { key: "newArrivals", href: "/new-arrivals" },
  { key: "inspiration", href: "/inspiration" },
  { key: "customize", href: "/customize-your-sofa" },
  { key: "showroom", href: "/showroom" }
];

const announcementIcons = [CheckCircle2, MessageCircle, MapPin, CheckCircle2, MessageCircle];

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
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [query, setQuery] = useState("");
  const { status } = useSession();
  const accountHref = status === "authenticated" ? "/customer" : "/customer-login";
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
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="bg-black text-white">
        <div className="mx-auto max-w-7xl overflow-hidden px-4 sm:px-6 lg:px-8">
          <div className="flex whitespace-nowrap py-2 text-[11px] font-semibold">
            {[0, 1].map((copy) => (
              <div key={copy} aria-hidden={copy === 1} className="flex min-w-max animate-shany-marquee items-center gap-12 pe-12">
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
        <div className="flex items-center gap-0.5 sm:gap-2">
          <button aria-label={t("openMenu")} className="rounded-md p-2 transition hover:bg-neutral-100 lg:hidden" onClick={() => setOpen(true)}>
            <Menu className="size-5" />
          </button>
          <Link
            href={accountHref}
            aria-label={t("account")}
            title={t("account")}
            className="rounded-md p-2 transition hover:bg-neutral-100"
          >
            <UserRound className="size-5" />
          </Link>
          <button aria-label={t("whatsapp")} className="rounded-md p-2 text-[#128c4a] transition hover:bg-neutral-100" onClick={() => setWhatsappOpen(true)}>
            <WhatsappIcon className="size-5" />
          </button>
          <button aria-label={t("search")} className="rounded-md p-2 transition hover:bg-neutral-100" onClick={() => setSearchOpen(true)}>
            <Search className="size-5" />
          </button>
          <LanguageSwitcher className="hidden sm:inline-flex" />
        </div>
        <AppMenu items={menuItems} className="hidden flex-1 justify-center gap-6 lg:flex xl:gap-7" />
        <AppLogo className="shrink-0" />
      </div>
      <AnimatePresence>
        {searchOpen ? (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.18 }} className="absolute inset-x-0 top-full z-40 border-t border-neutral-200 bg-white shadow-xl">
            <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 rounded-md border border-neutral-300 bg-neutral-50 px-4 py-3">
                <Search className="size-5 shrink-0 text-neutral-500" />
                <input value={searchValue} onChange={handleSearch} autoFocus placeholder={t("searchPlaceholder")} className="h-8 min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-neutral-400" />
                <button aria-label={t("closeSearch")} className="rounded-md p-1 transition hover:bg-neutral-200" onClick={closeSearch}>
                  <X className="size-5" />
                </button>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {results.map((item) => (
                  <Link key={item.title} href={item.href} onClick={closeSearch} className="rounded-lg border border-neutral-200 p-4 transition hover:-translate-y-0.5 hover:border-neutral-900 hover:shadow-md">
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">{item.type}</span>
                    <p className="mt-2 font-bold">{item.title}</p>
                    <p className="mt-1 text-sm text-neutral-600">{item.detail}</p>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <AppDialog
        open={whatsappOpen}
        onOpenChange={setWhatsappOpen}
        title={t("whatsappDialog.title")}
        description={t("whatsappDialog.description")}
        className="sm:max-w-md"
        footer={
          <>
            <AppButton type="button" variant="outline" onClick={() => setWhatsappOpen(false)}>{t("whatsappDialog.close")}</AppButton>
            <Link href={whatsappHref} target={whatsappNumber ? "_blank" : undefined}>
              <AppButton type="button" className="w-full gap-2 sm:w-auto"><WhatsappIcon className="size-4" /> {t("whatsappDialog.startChat")}</AppButton>
            </Link>
          </>
        }
      >
        <div className="space-y-3 text-sm text-neutral-700">
          <div className="rounded-lg border border-neutral-200 p-4">
            <p className="font-bold text-neutral-950">{t("whatsappDialog.adviceTitle")}</p>
            <p className="mt-1">{t("whatsappDialog.adviceText")}</p>
          </div>
          <div className="rounded-lg border border-neutral-200 p-4">
            <p className="font-bold text-neutral-950">{t("whatsappDialog.followUpTitle")}</p>
            <p className="mt-1">{t("whatsappDialog.followUpText")}</p>
          </div>
        </div>
      </AppDialog>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden" onClick={() => setOpen(false)}>
          <div className="ms-auto flex h-full w-80 max-w-[86vw] flex-col overflow-y-auto bg-white p-5 shadow-xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between gap-3">
              <AppLogo imageClassName="w-28" />
              <button aria-label={t("closeMenu")} className="rounded-md p-2 hover:bg-neutral-100" onClick={() => setOpen(false)}>
                <X className="size-5" />
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
