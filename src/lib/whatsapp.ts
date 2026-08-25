export type SofaQuoteConfig = {
  productName: string;
  productId?: string;
  size?: string;
  configuration?: string;
  fabric?: string;
  color?: string;
  configId?: string;
  customerName?: string;
  customerEmail?: string;
};

export function generateConfigId() {
  return `SL-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

function formatTimestamp() {
  return new Date().toLocaleString("he-IL", { dateStyle: "medium", timeStyle: "short" });
}

export function buildSofaQuoteMessage(config: SofaQuoteConfig): string {
  const rows: Array<[string, string | undefined]> = [
    ["דגם", config.productName],
    ["מזהה דגם", config.productId],
    ["מידה", config.size],
    ["קונפיגורציה", config.configuration],
    ["בד", config.fabric],
    ["צבע", config.color],
    ["מזהה הגדרה", config.configId],
    ["שם הלקוח", config.customerName],
    ["אימייל", config.customerEmail],
    ["תאריך ושעה", formatTimestamp()]
  ];

  const details = rows
    .filter((row): row is [string, string] => Boolean(row[1]))
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  return [
    "היי שני ליווינג, התאמתי ספה באתר ואשמח לקבל מחיר ופרטים נוספים.",
    "",
    details,
    "",
    "אשמח שתשלחו לי מחיר ופרטים."
  ].join("\n");
}

export type ProductQuoteConfig = {
  productName: string;
  productId?: string;
  category?: string;
  colorNames?: string[];
  customerName?: string;
  customerEmail?: string;
};

export function buildProductQuoteMessage(config: ProductQuoteConfig): string {
  const rows: Array<[string, string | undefined]> = [
    ["פריט", config.productName],
    ["מזהה פריט", config.productId],
    ["קטגוריה", config.category],
    ["צבעים זמינים", config.colorNames?.join(", ")],
    ["שם הלקוח", config.customerName],
    ["אימייל", config.customerEmail],
    ["תאריך ושעה", formatTimestamp()]
  ];

  const details = rows
    .filter((row): row is [string, string] => Boolean(row[1]))
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  return [
    "היי שני ליווינג, אשמח להזמין את הפריט הבא בהתאמה אישית.",
    "",
    details,
    "",
    "אשמח לקבל פרטים על אפשרויות ההתאמה (מידות, גימור/בד, צבע) ומחיר."
  ].join("\n");
}

export function buildWhatsAppUrl(rawNumber: string | undefined, message: string): string | null {
  const number = rawNumber?.replace(/\D/g, "");
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : null;
}

export function buildPhoneUrl(rawNumber: string | undefined): string | null {
  const number = rawNumber?.replace(/\D/g, "");
  return number ? `tel:${number}` : null;
}
