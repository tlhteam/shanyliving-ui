"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { localeDirection } from "@/i18n/config";

export function AppDirectionBridge() {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = localeDirection(locale);
  }, [locale]);

  return null;
}
