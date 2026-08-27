import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { AppImage } from "@/components/app/AppImage";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { WhatsappIcon } from "@/components/icons/WhatsappIcon";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { AppLogo } from "@/components/layout/AppLogo";
import { paymentMethods, siteImages } from "@/lib/images";
import { whatsappHref } from "@/lib/whatsapp";

const shopLinks = [
  { key: "sofas", href: "/sofas" },
  { key: "livingRoom", href: "/living-room" },
  { key: "diningRoom", href: "/dining" },
  { key: "bedroom", href: "/bedroom" }
];
const serviceLinks = [
  { key: "contact", href: "/contact" },
  { key: "faq", href: "/faq" },
  { key: "shipping", href: "/shipping" },
  { key: "warranty", href: "/warranty" }
];
const companyLinks = [
  { key: "about", href: "/about" },
  { key: "showroom", href: "/showroom" },
  { key: "privacy", href: "/privacy" },
  { key: "terms", href: "/terms" }
];

const contactRows = [
  { key: "address", Icon: MapPin },
  { key: "phone", Icon: Phone },
  { key: "whatsapp", Icon: WhatsappIcon },
  { key: "email", Icon: Mail },
  { key: "weekHours", Icon: Clock },
  { key: "weekendHours", Icon: Clock }
];

export async function AppFooter() {
  const t = await getTranslations("footer");
  const common = await getTranslations("common");
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://www.instagram.com/shanyliving";
  const phoneDigits = t("contactRows.phone").replace(/\D/g, "");
  const phoneHref = phoneDigits ? `tel:${phoneDigits}` : undefined;
  const emailHref = `mailto:${t("contactRows.email")}`;
  const contactRowHrefs: Partial<Record<string, string>> = {
    phone: phoneHref,
    email: emailHref,
    whatsapp: whatsappHref(common("whatsappMessage"))
  };

  return (
    <footer className="bg-neutral-950 text-neutral-300">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1fr_1fr_1.2fr_1.8fr] lg:gap-10 lg:px-8">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">{t("shop")}</h3>
          <div className="mt-5 flex flex-col gap-3 text-sm">
            {shopLinks.map((link) => <Link key={link.key} href={link.href} className="transition hover:text-white">{t(`shopLinks.${link.key}`)}</Link>)}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">{t("customerService")}</h3>
          <div className="mt-5 flex flex-col gap-3 text-sm">
            {serviceLinks.map((link) => <Link key={link.key} href={link.href} className="transition hover:text-white">{t(`serviceLinks.${link.key}`)}</Link>)}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">{t("company")}</h3>
          <div className="mt-5 flex flex-col gap-3 text-sm">
            {companyLinks.map((link) => <Link key={link.key} href={link.href} className="transition hover:text-white">{t(`companyLinks.${link.key}`)}</Link>)}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">{t("contact")}</h3>
          <div className="mt-5 flex flex-col gap-3 text-sm">
            {contactRows.map((row) => {
              const icon = <row.Icon className="mt-0.5 size-4 shrink-0" />;
              const href = contactRowHrefs[row.key];

              return href ? (
                <a key={row.key} href={href} target={row.key === "whatsapp" ? "_blank" : undefined} className="flex items-start gap-2.5 transition hover:text-white">
                  {icon}
                  <bdi>{t(`contactRows.${row.key}`)}</bdi>
                </a>
              ) : (
                <span key={row.key} className="flex items-start gap-2.5">
                  {icon}
                  <bdi>{t(`contactRows.${row.key}`)}</bdi>
                </span>
              );
            })}
          </div>
        </div>
        <div className="col-span-2 lg:col-span-1">
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">{t("follow")}</h3>
          <Link href={instagramUrl} target="_blank" rel="noreferrer noopener" className="group mt-5 block overflow-hidden rounded-lg border border-white/10">
            <AppImage
              src={siteImages.showroomInterior}
              alt={t("instagramAlt")}
              className="aspect-[3.9/1]"
              sizes="(max-width: 1024px) 100vw, 30vw"
              imageClassName="transition duration-500 group-hover:scale-[1.04]"
            />
          </Link>
          <Link href={instagramUrl} target="_blank" rel="noreferrer noopener" className="mt-5 inline-flex h-10 items-center gap-2 rounded-md border border-white px-4 text-sm text-white transition hover:bg-white hover:text-neutral-950">
            <InstagramIcon className="size-4" /> {t("instagramCta")}
          </Link>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-8 text-center sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:text-start">
          <AppLogo variant="light" imageClassName="w-32 sm:w-36" />
          <p className="text-xs">{t("rights")}</p>
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            <Link href="/privacy" className="transition hover:text-white">{t("privacy")}</Link>
            <span aria-hidden>|</span>
            <Link href="/terms" className="transition hover:text-white">{t("terms")}</Link>
            <span aria-hidden>|</span>
            <Link href="/accessibility" className="transition hover:text-white">{t("accessibility")}</Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {paymentMethods.map((method) => (
              <span key={method.name} className="flex h-10 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white px-2 sm:h-11 sm:w-18">
                <Image src={method.image} alt={method.name} width={96} height={60} className="max-h-6 w-auto object-contain sm:max-h-7" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
