"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";

export function useOptionLabel() {
  const options = useTranslations("storefront.options");

  return useCallback(
    (value?: string | null) => {
      if (!value) {
        return "";
      }

      return options.has(value) ? options(value) : value;
    },
    [options]
  );
}
