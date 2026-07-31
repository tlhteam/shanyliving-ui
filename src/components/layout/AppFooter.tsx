import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { AppImage } from "@/components/app/AppImage";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { WhatsappIcon } from "@/components/icons/WhatsappIcon";
import { AppLogo } from "@/components/layout/AppLogo";
import { paymentMethods, siteImages } from "@/lib/images";

const shopLinks = ["sofas", "livingRoom", "diningRoom", "bedroom", "coffeeTables", "chairs", "newArrivals"];
const serviceLinks = ["contact", "faq", "shipping", "warranty"];
const companyLinks = ["about", "showroom", "privacy", "terms"];

const contactRows = [
  { key: "address", icon: MapPin },
  { key: "phone", icon: Phone },
  { key: "whatsapp", icon: WhatsappIcon },
  { key: "email", icon: Mail },
  { key: "weekHours", icon: Clock },
  { key: "weekendHours", icon: Clock }
];

export async function AppFooter() {
  const t = await getTranslations("footer");

  return (
    <footer className="bg-neutral-950 text-neutral-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1fr_1fr_1fr_1.2fr_1.8fr] lg:px-8">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">{t("shop")}</h3>
          <div className="mt-5 flex flex-col gap-3 text-sm">
            {shopLinks.map((key) => <Link key={key} href="/sofas" className="transition hover:text-white">{t(`shopLinks.${key}`)}</Link>)}
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
            {companyLinks.map((key) => <Link key={key} href="/about" className="transition hover:text-white">{t(`companyLinks.${key}`)}</Link>)}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">{t("contact")}</h3>
          <div className="mt-5 flex flex-col gap-3 text-sm">
            {contactRows.map((row) => (
              <span key={row.key} className="flex items-start gap-2.5">
                <row.icon className="mt-0.5 size-4 shrink-0" />
                {t(`contactRows.${row.key}`)}
              </span>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2 lg:col-span-1">
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">{t("follow")}</h3>
          <Link href="/about" className="group mt-5 block overflow-hidden rounded-lg border border-white/10">
            <AppImage
              src={siteImages.showroomInterior}
              alt={t("instagramAlt")}
              className="aspect-3.9/1"
              sizes="(max-width: 1024px) 100vw, 30vw"
              imageClassName="transition duration-500 group-hover:scale-[1.04]"
            />
          </Link>
          <Link href="/contact" className="mt-5 inline-flex h-10 items-center gap-2 rounded-md border border-white px-4 text-sm text-white transition hover:bg-white hover:text-neutral-950">
            <InstagramIcon className="size-4" /> {t("instagramCta")}
          </Link>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-8 text-center sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:text-start">
          <AppLogo variant="light" imageClassName="w-32 sm:w-36" />
          <p className="text-xs">{t("rights")}</p>
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            <Link href="/about" className="transition hover:text-white">{t("privacy")}</Link>
            <span aria-hidden>|</span>
            <Link href="/about" className="transition hover:text-white">{t("terms")}</Link>
            <span aria-hidden>|</span>
            <Link href="/contact" className="transition hover:text-white">{t("accessibility")}</Link>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {paymentMethods.map((method) => (
              <span key={method.name} className="grid h-11 w-18 place-items-center rounded-md bg-white p-1.5 sm:h-12 sm:w-20">
                <Image src={method.image} alt={method.name} width={80} height={48} className="h-full w-full object-contain" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
