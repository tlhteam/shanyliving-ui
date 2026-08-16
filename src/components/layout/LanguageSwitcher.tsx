"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { cn } from "@/lib/utils";
import { AppLocale, localeOption, localeOptions } from "@/i18n/config";
import { setUserLocale } from "@/i18n/actions";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function LanguageSwitcher({ className, variant = "icon" }: { className?: string; variant?: "icon" | "inline" }) {
  const locale = useLocale();
  const t = useTranslations("language");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const active = localeOption(locale);

  const select = (next: AppLocale) => {
    if (next === locale) {
      return;
    }

    startTransition(() => {
      void setUserLocale(next).then(() => router.refresh());
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label={t("trigger")}
            title={t("current", { language: active.label })}
            disabled={pending}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2 py-2 text-xs font-bold uppercase tracking-wide transition hover:bg-neutral-100 disabled:opacity-50",
              "text-neutral-950 dark:text-neutral-50 dark:hover:bg-white/10",
              variant === "inline" && "w-full justify-between border border-neutral-200 px-3 text-sm normal-case tracking-normal",
              className
            )}
          />
        }
      >
        <span className="inline-flex items-center gap-1.5">
          <SiteIcon name="globe" className="size-5" />
          <span className={variant === "icon" ? "hidden sm:inline" : undefined}>
            {variant === "inline" ? active.label : active.short}
          </span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-bold uppercase tracking-wide text-neutral-500">{t("label")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {localeOptions.map((option) => (
            <DropdownMenuItem key={option.locale} onClick={() => select(option.locale)} className="justify-between">
              <span>
                {option.label}
                <span className="ms-2 text-xs text-neutral-500">{option.short}</span>
              </span>
              {option.locale === locale && <SiteIcon name="check" className="size-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
