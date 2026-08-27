"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { AppButton } from "@/components/app/AppButton";
import { AppCarousel } from "@/components/app/AppCarousel";
import { AppImage } from "@/components/app/AppImage";
import { AppSection } from "@/components/app/AppSection";
import { HomeJourney } from "@/components/landing/HomeJourney";
import { WhatsappIcon } from "@/components/icons/WhatsappIcon";
import {
  ArrowRight,
  Check,
  Gem,
  Gift,
  Image as ImageIcon,
  Lock,
  MapPin,
  MessageSquare,
  Palette,
  Sofa,
  Truck
} from "lucide-react";
import { ProductCard } from "@/components/storefront/ProductCard";
import { Testimonials } from "@/components/storefront/Testimonials";
import { categoryHref } from "@/lib/categories";
import { categoryImage, siteImages } from "@/lib/images";
import type { StorefrontProduct } from "@/lib/storefront-pages";
import { whatsappHref } from "@/lib/whatsapp";
import type { HomeCatalog, CatalogCategory } from "@/lib/catalog";

const clubPerks = [
  { key: "offers", Icon: Gift },
  { key: "arrivals", Icon: Check },
  { key: "inspiration", Icon: ImageIcon }
];

const features = [
  { key: "craftsmanship", Icon: Gem },
  { key: "delivery", Icon: Truck },
  { key: "sizes", Icon: Sofa },
  { key: "fabrics", Icon: Palette },
  { key: "consultation", Icon: MessageSquare },
  { key: "payments", Icon: Lock }
];

function CategoryTile({ category, index, circular = false }: { category: CatalogCategory; index: number; circular?: boolean }) {
  const t = useTranslations("categories");
  const label = category.name || (t.has(category.slug) ? t(category.slug) : category.slug);
  const href = categoryHref(category.slug);

  return (
    <div>
      <Link href={href} className="group block text-center">
        <AppImage
          src={categoryImage(category, index)}
          alt={label}
          className={circular ? "aspect-square rounded-full" : "aspect-[1.18/1] rounded-lg"}
          sizes="(max-width: 640px) 28vw, (max-width: 1024px) 30vw, 15vw"
          imageClassName="transition duration-500 group-hover:scale-[1.06]"
        />
        <span className="mt-2 block text-[11px] font-bold leading-tight group-hover:underline sm:mt-3 sm:text-sm">{label}</span>
      </Link>
    </div>
  );
}

export function HomeExperience({
  catalog,
  featured,
  fromSocial = false
}: {
  catalog: HomeCatalog;
  featured: StorefrontProduct[];
  fromSocial?: boolean;
}) {
  const t = useTranslations("home");
  const tAbout = useTranslations("about");
  const common = useTranslations("common");
  const whatsappLink = whatsappHref(common("whatsappMessage"));
  const categories = catalog.categories;
  const [subscribeEmail, setSubscribeEmail] = useState("");

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subscribeEmail)) {
      toast.error(t("club.subscribeInvalid"));
      return;
    }

    toast.success(t("club.subscribeSuccess"));
    setSubscribeEmail("");
  };

  return (
    <>
      <section id="hero" className="relative isolate grid min-h-120 scroll-mt-24 place-items-center overflow-hidden px-4 py-20 text-center text-white sm:min-h-140 lg:min-h-160">
        <AppImage
          src={siteImages.hero}
          alt={t("hero.imageAlt")}
          className="absolute inset-0"
          sizes="100vw"
          objectPosition="center 65%"
          preload
          loading="eager"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/55 via-black/40 to-black/60" />
        <div className="relative mx-auto max-w-3xl">
          <h1 className="font-serif text-4xl leading-[1.05] drop-shadow-md sm:text-6xl lg:text-7xl">{t("hero.title")}</h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-white/90 sm:mt-6 sm:text-base">{t("hero.subtitle")}</p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link href="/customize-your-sofa">
              <AppButton size="lg" className="w-full sm:w-auto">
                {t("hero.primaryCta")}
              </AppButton>
            </Link>
            <Link href="/collections">
              <AppButton
                size="lg"
                variant="outline"
                className="w-full border-white bg-white/10 text-white backdrop-blur hover:bg-white hover:text-neutral-950 sm:w-auto"
              >
                {t("hero.secondaryCta")}
              </AppButton>
            </Link>
          </div>
        </div>
      </section>

      <AppSection id="categories" className="scroll-mt-24 text-neutral-950 dark:text-neutral-50">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-serif text-2xl font-bold sm:text-3xl">{t("categories.title")}</h2>
        </div>
        <div className="hidden sm:grid sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((category, index) => (
            <CategoryTile key={category.slug} category={category} index={index} />
          ))}
        </div>
        <AppCarousel ariaLabel={t("categories.title")} className="sm:hidden" arrows={false}>
          {categories.map((category, index) => (
            <div key={category.slug} className="w-28 shrink-0 snap-start">
              <CategoryTile category={category} index={index} circular />
            </div>
          ))}
        </AppCarousel>
      </AppSection>

      <AppSection id="featured" className="scroll-mt-24 text-neutral-950 dark:text-neutral-50">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-serif text-2xl font-bold sm:text-3xl">{t("featured.title")}</h2>
          <Link href="/collections" className="inline-flex items-center gap-2 text-sm font-bold hover:underline">
            {t("featured.viewAll")} <ArrowRight className="size-4 rtl:rotate-180" />
          </Link>
        </div>
        <div className="hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
        <AppCarousel ariaLabel={t("featured.title")} className="sm:hidden" arrows={false}>
          {featured.map((product) => (
            <div key={product.slug} className="w-[78vw] shrink-0 snap-start">
              <ProductCard product={product} className="h-full" />
            </div>
          ))}
        </AppCarousel>
      </AppSection>

      <HomeJourney product={featured[0]} fromSocial={fromSocial} />

      <section className="relative isolate overflow-hidden text-white">
        <AppImage
          src={siteImages.showroom}
          alt={t("showroom.imageAlt")}
          className="absolute inset-0"
          sizes="100vw"
          objectPosition="30% center"
        />
        <div className="absolute inset-0 bg-black/45 lg:bg-linear-to-r lg:from-black/10 lg:via-black/30 lg:to-black/65" />
        <AppSection dir="ltr" className="relative grid min-h-120 items-center sm:min-h-105 lg:grid-cols-[1fr_480px]">
          <div className="hidden lg:block" />
          <div className="text-center lg:text-end">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl">{t("showroom.title")}</h2>
            <p className="mt-5 flex items-center justify-center gap-2 text-sm lg:justify-end"><MapPin className="size-4" /> <bdi>{t("showroom.address")}</bdi></p>
            <p className="mt-4 text-sm leading-6 text-white/90"><bdi>{t("showroom.weekHours")}</bdi><br /><bdi>{t("showroom.weekendHours")}</bdi></p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-end">
              <Link href="/contact"><AppButton className="w-full sm:w-auto">{t("showroom.bookCta")}</AppButton></Link>
            </div>
          </div>
        </AppSection>
      </section>

      <section id="about" className="scroll-mt-24 bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
        <AppSection className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <AppImage
            src={siteImages.showroomInterior}
            alt={tAbout("teamImageAlt")}
            className="aspect-4/3 rounded-lg"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div>
            <h2 className="font-serif text-2xl font-bold sm:text-3xl">{tAbout("storyTitle")}</h2>
            <p className="mt-5 text-sm leading-7 text-neutral-700 dark:text-neutral-300">{tAbout("storyFirst")}</p>
            <div className="mt-7 grid grid-cols-2 gap-5 sm:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.key} className="flex items-start gap-2.5">
                  <feature.Icon className="mt-0.5 size-5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold">{t(`features.${feature.key}.title`)}</p>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400">{t(`features.${feature.key}.text`)}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/about"><AppButton variant="outline" className="mt-7 w-full sm:w-auto">{t("about.cta")}</AppButton></Link>
          </div>
        </AppSection>
      </section>

      <Testimonials className="text-neutral-950 dark:text-neutral-50" />

      <section className="bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
        <AppSection className="grid items-center gap-8 py-10 lg:grid-cols-[1.1fr_1fr_1.3fr]">
          <div>
            <h2 className="font-serif text-xl font-bold sm:text-2xl">{t("club.title")}</h2>
            <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">{t("club.text")}</p>
          </div>
          <form className="flex w-full" onSubmit={handleSubscribe}>
            <input
              type="email"
              value={subscribeEmail}
              onChange={(event) => setSubscribeEmail(event.target.value)}
              aria-label={t("club.emailLabel")}
              placeholder={t("club.emailPlaceholder")}
              className="h-11 min-w-0 flex-1 rounded-s-md border border-neutral-300 bg-white px-3 text-sm text-neutral-950 outline-none focus:border-neutral-900 dark:border-white/15 dark:bg-neutral-900 dark:text-neutral-50 dark:focus:border-white"
            />
            <button type="submit" className="h-11 rounded-e-md bg-black px-5 text-sm font-semibold text-white transition hover:bg-neutral-800">{t("club.subscribe")}</button>
          </form>
          <div className="flex flex-wrap gap-4 text-xs sm:grid sm:grid-cols-3 sm:divide-x sm:divide-neutral-300 dark:sm:divide-white/15">
            {clubPerks.map((perk) => (
              <span key={perk.key} className="flex items-center gap-2 sm:justify-center sm:px-3"><perk.Icon className="size-5" /> {t(`club.perks.${perk.key}`)}</span>
            ))}
          </div>
        </AppSection>
      </section>

      <Link
        aria-label={t("whatsappFloating")}
        href={whatsappLink}
        target="_blank"
        className="fixed bottom-20 end-4 z-40 inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-whatsapp-brand px-4 py-3 text-xs font-bold text-white shadow-lg transition hover:scale-105 sm:bottom-6 sm:end-6 sm:text-sm"
      >
        <WhatsappIcon className="size-6 shrink-0 sm:size-7" />
        {t("whatsappFloating")}
      </Link>
    </>
  );
}
