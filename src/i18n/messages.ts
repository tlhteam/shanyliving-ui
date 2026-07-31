import type { AbstractIntlMessages } from "next-intl";
import { defaultLocale } from "@/i18n/config";

const fallbackLocale = "en";

export async function loadMessages(locale: string): Promise<AbstractIntlMessages> {
  const candidates = [locale, fallbackLocale, defaultLocale];

  for (const candidate of candidates) {
    try {
      const imported = await import(`../../messages/${candidate}.json`);

      return imported.default as AbstractIntlMessages;
    } catch {
      continue;
    }
  }

  return {};
}
