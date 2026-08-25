import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { whatsappHref } from "@/lib/whatsapp";
import { AppButton } from "@/components/app/AppButton";
import { AppImage } from "@/components/app/AppImage";
import { AppSection } from "@/components/app/AppSection";
import { SiteIcon, SiteIconName } from "@/components/icons/SiteIcon";
import { WhatsappIcon } from "@/components/icons/WhatsappIcon";
import { siteImages } from "@/lib/images";

const details = [
  { key: "showroom", icon: "map-pin" },
  { key: "phone", icon: "phone" },
  { key: "email", icon: "mail" },
  { key: "hours", icon: "clock" }
];

export default async function ContactPage() {
  const t = await getTranslations("contact");
  const common = await getTranslations("common");
  const phoneHref = `tel:${t("details.phone.value").replace(/\D/g, "")}`;
  const emailHref = `mailto:${t("details.email.value")}`;
  const detailHrefs: Partial<Record<string, string>> = { phone: phoneHref, email: emailHref };

  return (
    <>
      <section className="relative isolate grid min-h-70 place-items-center overflow-hidden px-4 py-16 text-center text-white sm:min-h-90">
        <AppImage
          src={siteImages.showroom}
          alt={t("imageAlt")}
          className="absolute inset-0"
          sizes="100vw"
          preload
          loading="eager"
          objectPosition="30% center"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">{t("eyebrow")}</p>
          <h1 className="mt-3 font-serif text-3xl sm:text-5xl">{t("title")}</h1>
          <p className="mt-4 text-sm leading-6 text-white/90 sm:text-base">{t("subtitle")}</p>
        </div>
      </section>

      <AppSection className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
        <div>
          <h2 className="font-serif text-2xl font-bold">{t("formTitle")}</h2>
          <div className="mt-7 flex flex-col gap-5">
            {details.map((detail) => {
              const href = detailHrefs[detail.key];
              const content = (
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">{t(`details.${detail.key}.label`)}</p>
                  <p className="mt-1 text-sm leading-6">{t(`details.${detail.key}.value`)}</p>
                </div>
              );

              return (
                <div key={detail.key} className="flex items-start gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-neutral-100 text-neutral-950 dark:bg-white/10 dark:text-neutral-50">
                    <SiteIcon name={detail.icon as SiteIconName} className="size-5" />
                  </span>
                  {href ? (
                    <a href={href} className="transition hover:text-neutral-600 dark:hover:text-neutral-300">
                      {content}
                    </a>
                  ) : (
                    content
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={whatsappHref(common("whatsappMessage"))} target="_blank" rel="noreferrer noopener" className="block">
              <AppButton className="w-full gap-2 sm:w-auto"><WhatsappIcon className="size-4" /> {t("whatsappCta")}</AppButton>
            </Link>
            <Link href={phoneHref} className="block">
              <AppButton variant="outline" className="w-full gap-2 sm:w-auto">
                <SiteIcon name="phone" className="size-4" /> {t("callCta")}
              </AppButton>
            </Link>
            <Link href="/collections"><AppButton variant="outline" className="w-full sm:w-auto">{t("browseCta")}</AppButton></Link>
          </div>
        </div>
        <AppImage
          src={siteImages.showroomInterior}
          alt={t("imageAlt")}
          className="aspect-4/3 rounded-lg"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </AppSection>
    </>
  );
}
