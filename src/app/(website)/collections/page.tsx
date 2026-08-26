import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { AppButton } from "@/components/app/AppButton";
import { AppImage } from "@/components/app/AppImage";
import { AppSection } from "@/components/app/AppSection";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { getHomeCatalog } from "@/lib/catalog";
import { categoryHref } from "@/lib/categories";
import { categoryImage, siteImages } from "@/lib/images";

export const revalidate = 60;

export default async function CollectionsPage() {
  const t = await getTranslations("collections");
  const tCategories = await getTranslations("categories");
  const catalog = await getHomeCatalog();
  const categories = catalog.categories;

  return (
    <>
      <section className="relative isolate overflow-hidden text-white">
        <AppImage src={siteImages.showroomInterior} alt={t("imageAlt")} className="absolute inset-0" sizes="100vw" preload loading="eager" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative mx-auto flex min-h-64 max-w-7xl flex-col justify-end px-4 py-10 sm:min-h-96 sm:px-6 sm:py-12 lg:px-8">
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-white/80 sm:text-xs">
            <SiteIcon name="grid" className="size-4" /> {t("eyebrow")}
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-3xl leading-tight sm:text-5xl lg:text-6xl">{t("title")}</h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/90 sm:text-base">{t("subtitle")}</p>
        </div>
      </section>

      <div className="bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
        <AppSection>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => {
              const label = category.name || (tCategories.has(category.slug) ? tCategories(category.slug) : category.slug);
              const href = categoryHref(category.slug);

              return (
                <Link
                  key={category.slug}
                  href={href}
                  className="group block overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-neutral-900"
                >
                  <AppImage
                    src={categoryImage(category, index)}
                    alt={label}
                    className="aspect-[1.15/1]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    imageClassName="transition duration-700 group-hover:scale-[1.05]"
                  />
                  <div className="p-4 sm:p-5">
                    <h2 className="font-serif text-xl font-bold">{label}</h2>
                    <span className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-neutral-600 transition group-hover:text-neutral-950 dark:text-neutral-400 dark:group-hover:text-white">
                      {t("browse")} <SiteIcon name="arrow-right" className="size-4 rtl:rotate-180" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-12 grid items-center gap-6 rounded-lg bg-neutral-100 p-6 text-neutral-950 sm:p-8 dark:bg-neutral-900 dark:text-neutral-50 lg:grid-cols-[auto_1fr_auto]">
            <SiteIcon name="message" className="size-10" />
            <div>
              <h2 className="font-serif text-xl font-bold sm:text-2xl">{t("helpTitle")}</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-700 dark:text-neutral-300">{t("helpText")}</p>
            </div>
            <Link href="/contact" className="block">
              <AppButton className="w-full lg:w-auto">{t("helpCta")}</AppButton>
            </Link>
          </div>
        </AppSection>
      </div>
    </>
  );
}
