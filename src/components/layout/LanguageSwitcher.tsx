"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { Check, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppLocale, localeOption, localeOptions } from "@/i18n/config";
import { setUserLocale } from "@/i18n/actions";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function LanguageSwitcher({ className, variant = "icon" }: { className?: string; variant?: "icon" | "inline" }) {
  const locale = useLocale();
  const t = useTranslations("language");
  const [pending, startTransition] = useTransition();
  const active = localeOption(locale);

  const select = (next: AppLocale) => {
    if (next === locale) {
      return;
    }

    startTransition(() => {
      void setUserLocale(next);
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
              variant === "inline" && "w-full justify-between border border-neutral-200 px-3 text-sm normal-case tracking-normal",
              className
            )}
          />
        }
      >
        <span className="inline-flex items-center gap-1.5">
          <Globe className="size-5 shrink-0" />
          <span className={variant === "icon" ? "hidden sm:inline" : undefined}>
            {variant === "inline" ? active.label : active.short}
          </span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44">
        <DropdownMenuLabel className="text-xs font-bold uppercase tracking-wide text-neutral-500">{t("label")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {localeOptions.map((option) => (
          <DropdownMenuItem key={option.locale} onClick={() => select(option.locale)} className="justify-between">
            <span>
              {option.label}
              <span className="ms-2 text-xs text-neutral-500">{option.short}</span>
            </span>
            {option.locale === locale && <Check className="size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
