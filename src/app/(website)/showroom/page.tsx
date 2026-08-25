import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { whatsappHref } from "@/lib/whatsapp";
import { AppButton } from "@/components/app/AppButton";
import { AppImage } from "@/components/app/AppImage";
import { AppSection } from "@/components/app/AppSection";
import { SiteIcon, SiteIconName } from "@/components/icons/SiteIcon";

const stats = [
  { key: "years", value: "15+", icon: "check" },
  { key: "sofas", value: "500+", icon: "sofa" },
  { key: "fabrics", value: "120+", icon: "palette" },
  { key: "consultation", value: "1:1", icon: "users" }
];

const reasons = ["fabrics", "sofas", "design", "custom"];

const services = [
  { key: "consultation", icon: "users" },
  { key: "fabric", icon: "palette" },
  { key: "size", icon: "ruler" },
  { key: "delivery", icon: "truck" }
];

const gallery = [
  "/images/showroom-interior.png",
  "/images/showroom-consultation.png",
  "/images/look-modern-elegance.png",
  "/images/category-sofas.png"
];

export default async function ShowroomPage() {
  const t = await getTranslations("showroomPage");
  const contact = await getTranslations("contact.details");
  const common = await getTranslations("common");

  return (
    <>
      <section className="relative isolate overflow-hidden text-white">
        <AppImage src="/images/showroom-interior.png" alt={t("imageAlt")} className="absolute inset-0" sizes="100vw" preload loading="eager" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto flex min-h-80 max-w-7xl flex-col justify-center px-4 py-12 sm:min-h-96 sm:px-6 lg:px-8">
          <h1 className="max-w-2xl font-serif text-3xl leading-tight sm:text-5xl lg:text-6xl">{t("title")}</h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/90">{t("subtitle")}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href={whatsappHref(common("whatsappShowroomMessage"))} target="_blank" rel="noreferrer noopener" className="block">
              <AppButton className="w-full gap-2 sm:w-auto"><SiteIcon name="message" className="size-4" /> {t("whatsapp")}</AppButton>
            </Link>
            <Link href="#book" className="block">
              <AppButton variant="outline" className="w-full border-white bg-white/10 text-white hover:bg-white hover:text-neutral-950 sm:w-auto">{t("book")}</AppButton>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-neutral-100 text-neutral-950 dark:bg-neutral-900 dark:text-neutral-50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-7 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.key} className="flex items-center gap-3">
              <SiteIcon name={stat.icon as SiteIconName} className="size-7 shrink-0 sm:size-8" />
              <div className="min-w-0">
                <p className="font-serif text-xl font-bold sm:text-2xl">{stat.value}</p>
                <p className="text-xs font-bold text-neutral-600 dark:text-neutral-400">{t(`statsLabels.${stat.key}`)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <AppSection className="text-neutral-950 dark:text-neutral-50">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <section>
            <h2 className="font-serif text-xl font-bold sm:text-2xl">{t("whyTitle")}</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {reasons.map((reason) => (
                <div key={reason} className="rounded-lg bg-neutral-100 p-5 text-neutral-950 dark:bg-neutral-900 dark:text-neutral-50">
                  <h3 className="font-serif text-lg font-bold sm:text-xl">{t(`reasons.${reason}.title`)}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-700 dark:text-neutral-300">{t(`reasons.${reason}.text`)}</p>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2 className="font-serif text-xl font-bold sm:text-2xl">{t("exploreTitle")}</h2>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {gallery.map((image) => (
                <AppImage key={image} src={image} alt={t("galleryAlt")} className="aspect-[1.45/1] rounded-lg" sizes="(max-width: 1024px) 50vw, 25vw" />
              ))}
            </div>
          </section>
        </div>

        <div id="book" className="mt-12 grid gap-6 rounded-lg bg-neutral-100 p-6 text-neutral-950 sm:p-8 dark:bg-neutral-900 dark:text-neutral-50 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="font-serif text-xl font-bold sm:text-2xl">{t("bookTitle")}</h2>
            <div className="mt-5 space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
              <p className="flex gap-2"><SiteIcon name="map-pin" className="size-4 shrink-0" /> <bdi>{contact("showroom.value")}</bdi></p>
              <p><bdi>{contact("phone.value")}</bdi></p>
              <p><bdi>{contact("email.value")}</bdi></p>
              <p><bdi>{contact("hours.value")}</bdi></p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href={whatsappHref(common("whatsappShowroomMessage"))} target="_blank" rel="noreferrer noopener" className="block">
                <AppButton className="w-full sm:w-auto">{t("whatsapp")}</AppButton>
              </Link>
              <Link href="/contact" className="block">
                <AppButton variant="outline" className="w-full sm:w-auto">{t("book")}</AppButton>
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-neutral-300 bg-white dark:border-white/15 dark:bg-neutral-950">
            <iframe
              title={t("mapTitle")}
              src="https://www.google.com/maps?q=Herzl%2034%2C%20Tel%20Aviv%2C%20Israel&output=embed"
              className="h-72 w-full sm:h-80"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div key={service.key} className="rounded-lg border border-neutral-200 bg-white p-5 text-neutral-950 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50">
              <SiteIcon name={service.icon as SiteIconName} className="size-7" />
              <h3 className="mt-4 font-bold">{t(`services.${service.key}.title`)}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-700 dark:text-neutral-300">{t(`services.${service.key}.text`)}</p>
            </div>
          ))}
        </div>
      </AppSection>
    </>
  );
}
