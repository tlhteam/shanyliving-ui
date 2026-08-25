"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { cn } from "@/lib/utils";
import { AppLocale, localeOption, localeOptions } from "@/i18n/config";
import { setUserLocale } from "@/i18n/actions";

export function LanguageSwitcher({ className, variant = "icon" }: { className?: string; variant?: "icon" | "inline" }) {
  const locale = useLocale();
  const t = useTranslations("language");
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const [alignRight, setAlignRight] = useState(false);
  const [pending, startTransition] = useTransition();
  const active = localeOption(locale);
  const menuHeight = 210;
  const menuWidth = 176;

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const select = (next: AppLocale) => {
    if (next === locale) {
      setOpen(false);
      return;
    }

    startTransition(() => {
      void setUserLocale(next).then(() => {
        setOpen(false);
        router.refresh();
      });
    });
  };

  return (
    <div ref={menuRef} className={cn("relative inline-flex", className)}>
      <button
        type="button"
        aria-label={t("trigger")}
        title={t("current", { language: active.label })}
        aria-expanded={open}
        disabled={pending}
        onClick={() => {
          const rect = menuRef.current?.getBoundingClientRect();

          if (rect) {
            setDropUp(window.innerHeight - rect.bottom < menuHeight && rect.top > menuHeight);
            setAlignRight(rect.left + menuWidth > window.innerWidth);
          }

          setOpen((current) => !current);
        }}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-2 py-2 text-xs font-bold uppercase tracking-wide text-neutral-950 transition hover:bg-neutral-100 disabled:opacity-50 dark:text-neutral-50 dark:hover:bg-white/10",
          variant === "inline" && "w-full justify-between border border-neutral-200 px-3 text-sm normal-case tracking-normal dark:border-white/15"
        )}
      >
        <span className="inline-flex items-center gap-1.5">
          <SiteIcon name="globe" className="size-5" />
          <span className={variant === "icon" ? "hidden sm:inline" : undefined}>
            {variant === "inline" ? active.label : active.short}
          </span>
        </span>
      </button>
      {open ? (
        <div
          className={cn(
            "absolute z-80 w-44 rounded-lg border border-neutral-200 bg-white p-1 text-neutral-950 shadow-xl dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-50",
            alignRight ? "right-0" : "left-0",
            dropUp ? "bottom-full mb-2" : "top-full mt-2"
          )}
        >
          <p className="px-2 py-1 text-xs font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{t("label")}</p>
          <div className="-mx-1 my-1 h-px bg-neutral-200 dark:bg-white/10" />
          {localeOptions.map((option) => (
            <button
              key={option.locale}
              type="button"
              onClick={() => select(option.locale)}
              className="flex w-full items-center justify-between rounded-md px-2 py-2 text-start text-sm transition hover:bg-neutral-100 dark:hover:bg-white/10"
            >
              <span>
                {option.label}
                <span className="ms-2 text-xs text-neutral-500">{option.short}</span>
              </span>
              {option.locale === locale && <SiteIcon name="check" className="size-4" />}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
