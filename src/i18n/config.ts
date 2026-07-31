export const locales = ["he", "en", "fr", "it"] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "he";

export const localeCookieName = "NEXT_LOCALE";

export const localeCookieMaxAge = 60 * 60 * 24 * 365;

export const localeDirections: Record<AppLocale, "rtl" | "ltr"> = {
  he: "rtl",
  en: "ltr",
  fr: "ltr",
  it: "ltr"
};

export const localeOptions: Array<{ locale: AppLocale; label: string; english: string; short: string }> = [
  { locale: "he", label: "עברית", english: "Hebrew", short: "HE" },
  { locale: "en", label: "English", english: "English", short: "EN" },
  { locale: "fr", label: "Français", english: "French", short: "FR" },
  { locale: "it", label: "Italiano", english: "Italian", short: "IT" }
];

export function isAppLocale(value?: string | null): value is AppLocale {
  return !!value && locales.includes(value as AppLocale);
}

export function localeDirection(locale: string) {
  return isAppLocale(locale) ? localeDirections[locale] : localeDirections[defaultLocale];
}

export function localeOption(locale: string) {
  return localeOptions.find((option) => option.locale === locale) ?? localeOptions[0];
}
