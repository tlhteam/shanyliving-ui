import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { AppImage } from "@/components/app/AppImage";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { SiteIcon, SiteIconName } from "@/components/icons/SiteIcon";
import { WhatsappIcon } from "@/components/icons/WhatsappIcon";
import { AppLogo } from "@/components/layout/AppLogo";
import { paymentMethods, siteImages } from "@/lib/images";

const shopLinks = [
  { key: "sofas", href: "/sofas" },
  { key: "livingRoom", href: "/living-room" },
  { key: "diningRoom", href: "/dining" },
  { key: "bedroom", href: "/bedroom" },
  { key: "coffeeTables", href: "/living-room" },
  { key: "chairs", href: "/dining" },
  { key: "newArrivals", href: "/new-arrivals" }
];
const serviceLinks = ["contact", "faq", "shipping", "warranty"];
const companyLinks = [
  { key: "about", href: "/about" },
  { key: "showroom", href: "/showroom" },
  { key: "privacy", href: "/privacy" },
  { key: "terms", href: "/terms" }
];

const contactRows = [
  { key: "address", icon: "map-pin" },
  { key: "phone", icon: "phone" },
  { key: "whatsapp", icon: "whatsapp" },
  { key: "email", icon: "mail" },
  { key: "weekHours", icon: "clock" },
  { key: "weekendHours", icon: "clock" }
];

export async function AppFooter() {
  const t = await getTranslations("footer");
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://www.instagram.com/shanyliving";

  return (
    <footer className="bg-neutral-950 text-neutral-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1fr_1fr_1fr_1.2fr_1.8fr] lg:px-8">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">{t("shop")}</h3>
          <div className="mt-5 flex flex-col gap-3 text-sm">
            {shopLinks.map((link) => <Link key={link.key} href={link.href} className="transition hover:text-white">{t(`shopLinks.${link.key}`)}</Link>)}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">{t("customerService")}</h3>
          <div className="mt-5 flex flex-col gap-3 text-sm">
            {serviceLinks.map((key) => <Link key={key} href="/contact" className="transition hover:text-white">{t(`serviceLinks.${key}`)}</Link>)}
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
            {contactRows.map((row) => (
              <span key={row.key} className="flex items-start gap-2.5">
                {row.icon === "whatsapp" ? <WhatsappIcon className="mt-0.5 size-4 shrink-0" /> : <SiteIcon name={row.icon as SiteIconName} className="mt-0.5 size-4" />}
                <bdi>{t(`contactRows.${row.key}`)}</bdi>
              </span>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2 lg:col-span-1">
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
