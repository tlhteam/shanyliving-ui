"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { defaultLocale, isAppLocale, localeCookieMaxAge, localeCookieName } from "@/i18n/config";

export async function setUserLocale(locale: string) {
  const store = await cookies();

  store.set(localeCookieName, isAppLocale(locale) ? locale : defaultLocale, {
    path: "/",
    maxAge: localeCookieMaxAge,
    sameSite: "lax"
  });

  revalidatePath("/", "layout");
}
