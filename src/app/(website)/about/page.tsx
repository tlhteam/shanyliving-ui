import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { AppButton } from "@/components/app/AppButton";
import { AppImage } from "@/components/app/AppImage";
import { AppSection } from "@/components/app/AppSection";
import { Award, Palette, Ruler, Sofa } from "lucide-react";
import { looks, siteImages } from "@/lib/images";

const values = [
  { key: "measure", Icon: Ruler },
  { key: "fabrics", Icon: Palette },
  { key: "durability", Icon: Award },
  { key: "service", Icon: Sofa }
];

export default async function AboutPage() {
  const t = await getTranslations("about");
  const tLooks = await getTranslations("home.shopTheLook.looks");

  return (
    <>
      <section className="relative isolate grid min-h-70 place-items-center overflow-hidden px-4 py-16 text-center text-white sm:min-h-90">
        <AppImage src={siteImages.showroomInterior} alt={t("imageAlt")} className="absolute inset-0" sizes="100vw" preload loading="eager" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">{t("eyebrow")}</p>
          <h1 className="mt-3 font-serif text-3xl sm:text-5xl">{t("title")}</h1>
          <p className="mt-4 text-sm leading-6 text-white/90 sm:text-base">{t("subtitle")}</p>
        </div>
      </section>

      <AppSection className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <AppImage
          src={siteImages.showroom}
          alt={t("teamImageAlt")}
          className="aspect-4/3 rounded-lg"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div>
          <h2 className="font-serif text-2xl font-bold sm:text-3xl">{t("storyTitle")}</h2>
          <p className="mt-5 text-sm leading-7 text-neutral-700">{t("storyFirst")}</p>
          <p className="mt-4 text-sm leading-7 text-neutral-700">{t("storySecond")}</p>
          <Link href="/contact"><AppButton className="mt-7 w-full sm:w-auto">{t("storyCta")}</AppButton></Link>
        </div>
      </AppSection>

      <section className="bg-neutral-100 text-neutral-950 dark:bg-neutral-900 dark:text-neutral-50">
        <AppSection>
          <h2 className="text-center font-serif text-2xl font-bold sm:text-3xl">{t("valuesTitle")}</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.key} className="rounded-lg bg-white p-6 text-neutral-950 shadow-sm dark:bg-neutral-950 dark:text-neutral-50">
                <value.Icon className="size-8" />
                <h3 className="mt-5 font-bold">{t(`values.${value.key}.title`)}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">{t(`values.${value.key}.text`)}</p>
              </div>
            ))}
          </div>
        </AppSection>
      </section>

      <AppSection>
        <h2 className="font-serif text-2xl font-bold sm:text-3xl">{t("inspirationTitle")}</h2>
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {looks.map((look) => (
            <div key={look.key} className="group relative overflow-hidden rounded-lg">
              <AppImage
                src={look.image}
                alt={tLooks(look.key)}
                className="aspect-[1.5/1]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                imageClassName="transition duration-500 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/55 to-transparent" />
              <span className="absolute bottom-3 start-3 text-xs font-bold text-white">{tLooks(look.key)}</span>
            </div>
          ))}
        </div>
      </AppSection>
    </>
  );
}
