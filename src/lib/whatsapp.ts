export const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+972503334295").replace(/\D/g, "");

export function whatsappHref(message?: string) {
  if (!whatsappNumber) {
    return "/contact";
  }

  const base = `https://wa.me/${whatsappNumber}`;

  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function whatsappDisplay() {
  if (!whatsappNumber) {
    return "";
  }

  const local = whatsappNumber.startsWith("972") ? `0${whatsappNumber.slice(3)}` : whatsappNumber;

  return local.replace(/^(\d{3})(\d{3})(\d+)$/, "$1-$2-$3");
}
