import { cookies } from "next/headers";
import { AppLocale, defaultLocale, isAppLocale, localeCookieName } from "@/i18n/config";

export async function getUserLocale(): Promise<AppLocale> {
  const store = await cookies();
  const value = store.get(localeCookieName)?.value;

  return isAppLocale(value) ? value : defaultLocale;
}
