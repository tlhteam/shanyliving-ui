import { getRequestConfig } from "next-intl/server";
import { isAppLocale } from "@/i18n/config";
import { getUserLocale } from "@/i18n/locale";
import { loadMessages } from "@/i18n/messages";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = isAppLocale(requested) ? requested : await getUserLocale();

  return {
    locale,
    messages: await loadMessages(locale)
  };
});
