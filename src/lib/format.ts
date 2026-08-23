export const currencySymbol = "₪";

export function formatMoney(amount: number, locale = "en") {
  return `${currencySymbol} ${new Intl.NumberFormat(locale).format(Math.round(amount))}`;
}

export function formatCount(value: number, locale = "en") {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatDate(value?: string | null, locale = "en") {
  if (!value) {
    return "";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric" }).format(parsed);
}
