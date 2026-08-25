"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AppButton } from "@/components/app/AppButton";
import { AppImage } from "@/components/app/AppImage";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { WhatsappIcon } from "@/components/icons/WhatsappIcon";
import { StickyContactBar } from "@/components/storefront/StickyContactBar";
import { productCategoryHref } from "@/lib/categories";
import { isCustomOrderCategory } from "@/lib/custom-order";
import { fabrics } from "@/lib/fabrics";
import { sofaConfigurations, sofaSizes } from "@/lib/sofa-options";
import { localizedProductDescription, localizedProductName } from "@/lib/storefront-pages";
import { buildProductQuoteMessage, buildSofaQuoteMessage, whatsappHref } from "@/lib/whatsapp";
import type { StorefrontOptionGroup, StorefrontProduct } from "@/lib/storefront-pages";

type ProductDetailHeroProps = {
  product: StorefrontProduct;
  images: string[];
};

function parseDescription(description?: string) {
  if (!description) {
    return {
      intro: "",
      specs: [] as Array<{ label: string; value: string }>,
    };
  }

  const blocks = description
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  const intro: string[] = [];
  const specs: Array<{ label: string; value: string }> = [];

  blocks.forEach((block) => {
    const match = block.match(/^([A-Za-z][A-Za-z /&-]{1,38}):\s*([\s\S]+)$/);

    if (match) {
      specs.push({
        label: match[1].trim(),
        value: match[2].trim().replace(/\.+$/, ""),
      });
      return;
    }

    intro.push(block);
  });

  return { intro: intro.join(" "), specs };
}

function findColorImageIndex(product: StorefrontProduct, images: string[], colorName: string) {
  const variant = product.variantMedia?.find((media) =>
    Object.values(media.options).some((value) => value.toLowerCase() === colorName.toLowerCase()),
  );

  return variant ? images.findIndex((image) => image === variant.image) : -1;
}

function configurationSummary(groups?: StorefrontOptionGroup[]) {
  const relevant = (groups ?? []).filter((group) =>
    ["size", "configuration"].includes(group.name.toLowerCase()),
  );

  if (!relevant.length) {
    return "";
  }

  return relevant
    .map((group) => `${group.name}: ${group.values.map((value) => value.label).join(", ")}`)
    .join(" · ");
}

export function ProductDetailHero({ product, images }: ProductDetailHeroProps) {
  const t = useTranslations("storefront.detail");
  const locale = useLocale();
  const name = localizedProductName(product, locale);
  const description = localizedProductDescription(product, locale);
  const { intro, specs } = useMemo(
    () => parseDescription(description),
    [description],
  );
  const materials = specs.find((spec) => /material|care|fabric/i.test(spec.label))?.value;

  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedFabric, setSelectedFabric] = useState(0);

  const heroImage = images[activeImage] ?? images[0] ?? product.image;
  const isSofa = product.category === "sofas";
  const isCustomOrder = isCustomOrderCategory(product.category);
  const selectedColorName = product.colorNames?.[selectedColor] ?? product.colors?.[selectedColor];
  const quoteMessage = isSofa
    ? buildSofaQuoteMessage({
        productName: product.name,
        productId: product.slug,
        fabric: fabrics[selectedFabric]?.name,
        color: selectedColorName
      })
    : buildProductQuoteMessage({ productName: product.name, productId: product.slug, category: product.subcategory, colorNames: product.colorNames });
  const quoteHref = whatsappHref(quoteMessage);
  const configuration = isSofa ? sofaConfigurations.join(", ") : configurationSummary(product.optionGroups);

  const accordionItems = [
    { key: "dimensions", label: t("dimensions"), content: product.dimensions || t("dimensionsFallback") },
    ...(isSofa ? [{ key: "sizes", label: t("sizesLabel"), content: sofaSizes.join(", ") }] : []),
    { key: "configuration", label: t("configurationLabel"), content: configuration || t("configurationFallback") },
    { key: "materials", label: t("materialsLabel"), content: materials || t("materialsFallback") },
    ...(isCustomOrder
      ? [
          { key: "delivery", label: t("deliveryLabel"), content: t("deliveryInfo") },
          { key: "installation", label: t("installationLabel"), content: t("installationInfo") },
        ]
      : []),
  ];

  return (
    <div className={`grid gap-8 lg:grid-cols-[1.1fr_0.9fr] ${isCustomOrder ? "pb-24 lg:pb-0" : ""}`}>
      <section className="min-w-0 self-start lg:sticky lg:top-24">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100 sm:aspect-[1.15/1] dark:bg-neutral-900">
          <AppImage
            src={heroImage}
            alt={`${name} — ${t("angle", { number: activeImage + 1 })}`}
            className="absolute inset-0"
            sizes="(max-width: 1024px) 100vw, 55vw"
            preload
            loading="eager"
          />
        </div>

        {images.length > 1 ? (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveImage(index)}
                aria-label={t("angle", { number: index + 1 })}
                aria-current={index === activeImage}
                className={`relative size-16 shrink-0 overflow-hidden rounded-md border transition sm:size-20 ${
                  index === activeImage
                    ? "border-neutral-950 ring-2 ring-neutral-950/15 dark:border-white dark:ring-white/25"
                    : "border-neutral-200 hover:border-neutral-400 dark:border-white/10"
                }`}
              >
                <AppImage src={image} alt="" className="absolute inset-0" sizes="80px" />
              </button>
            ))}
          </div>
        ) : null}
      </section>

      <aside className="min-w-0" data-shiputzai-product="" data-product-id={product.slug} data-sku={product.slug}>
        <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs font-bold text-neutral-600 sm:mb-6 dark:text-neutral-400">
          <Link href="/">{t("home")}</Link>
          <SiteIcon name="chevron-right" className="size-3 rtl:rotate-180" />
          <Link href={productCategoryHref[product.category] ?? "/sofas"}>{t(`collectionLabels.${product.category}`)}</Link>
          <SiteIcon name="chevron-right" className="size-3 rtl:rotate-180" />
          <span className="text-neutral-950 dark:text-neutral-50">
            {name}
          </span>
        </nav>

        <h1 className="font-serif text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
          {name}
        </h1>

        {intro ? (
          <p className="mt-4 text-sm leading-6 text-neutral-700 sm:mt-5 dark:text-neutral-300">
            {intro}
          </p>
        ) : null}

        {isCustomOrder ? (
          <p className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-neutral-700 dark:text-neutral-300">
            <SiteIcon name="truck" className="size-4 shrink-0" />
            {t("deliveryEstimate")}
          </p>
        ) : null}

        {isSofa ? (
          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
              {t("fabricsLabel")}
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              {fabrics.map((item, index) => (
                <button key={item.name} type="button" onClick={() => setSelectedFabric(index)} aria-current={index === selectedFabric} className="group text-center text-xs font-bold">
                  <AppImage
                    src={item.image}
                    alt={item.name}
                    className={`size-14 rounded-md border transition group-hover:scale-105 ${
                      index === selectedFabric
                        ? "border-neutral-950 ring-2 ring-neutral-950/15 dark:border-white dark:ring-white/25"
                        : "border-neutral-200 dark:border-white/10"
                    }`}
                    sizes="56px"
                  />
                  <span className="mt-1.5 block text-neutral-700 dark:text-neutral-300">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {product.colors?.length ? (
          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
              {t("colorsLabel")}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {product.colors.map((colorValue, index) => {
                const colorName = product.colorNames?.[index] ?? colorValue;

                return (
                  <button
                    key={`${colorValue}-${index}`}
                    type="button"
                    onClick={() => {
                      setSelectedColor(index);
                      const imageIndex = findColorImageIndex(product, images, colorName);

                      if (imageIndex >= 0) {
                        setActiveImage(imageIndex);
                      }
                    }}
                    aria-label={colorName}
                    aria-current={index === selectedColor}
                    title={colorName}
                    className="group text-center"
                  >
                    <span
                      className={`block size-9 rounded-full border-2 shadow-sm transition group-hover:scale-110 ${
                        index === selectedColor
                          ? "border-neutral-950 ring-2 ring-neutral-950/15 dark:border-white dark:ring-white/25"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: colorValue }}
                    />
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
              {product.colorNames?.[selectedColor] ?? product.colors[selectedColor]}
            </p>
          </div>
        ) : null}

        <div className="mt-6 divide-y divide-neutral-200 border-y border-neutral-200 text-sm dark:divide-white/10 dark:border-white/10">
          {accordionItems.map((item) => (
            <details key={item.key} className="group py-3.5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-bold marker:hidden">
                {item.label}
                <SiteIcon name="chevron-down" className="size-4 shrink-0 transition group-open:rotate-180" />
              </summary>
              <p className="mt-2.5 leading-6 text-neutral-700 dark:text-neutral-300">{item.content}</p>
            </details>
          ))}
        </div>

        {isCustomOrder ? (
          <div className="mt-5 space-y-1.5 text-sm leading-6 text-neutral-700 dark:text-neutral-300">
            <p>{t("customPricing")}</p>
            <p>{t("paymentFlexibility")}</p>
          </div>
        ) : null}

        {isSofa ? (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={`/customize-your-sofa?product=${product.slug}&step=size`}
              className="block sm:min-w-40 sm:flex-1"
            >
              <AppButton className="w-full">{t("customize")}</AppButton>
            </Link>
            <Link
              href={`/customize-your-sofa?product=${product.slug}&step=room`}
              className="block sm:min-w-40 sm:flex-1"
            >
              <AppButton variant="outline" className="w-full gap-2">
                <SiteIcon name="sparkle" className="size-4" />
                {t("seeInRoom")}
              </AppButton>
            </Link>
          </div>
        ) : isCustomOrder ? (
          <div className="mt-6">
            <Link href={quoteHref} target="_blank" className="block">
              <AppButton className="w-full gap-2">
                <WhatsappIcon className="size-4" />
                {t("requestCustomOrder")}
              </AppButton>
            </Link>
          </div>
        ) : null}

        <div data-shiputzai-button-slot="" className="mt-3 empty:mt-0" />

        {isSofa ? (
          <div className="mt-4 hidden lg:block">
            <Link href={quoteHref} target="_blank" className="block">
              <AppButton variant="outline" className="w-full gap-2">
                <WhatsappIcon className="size-4" />
                {t("whatsappForDetails")}
              </AppButton>
            </Link>
          </div>
        ) : null}

        {isCustomOrder ? (
          <Link
            href="/contact"
            className="mt-4 block text-center text-sm font-bold underline underline-offset-4 lg:text-start"
          >
            {t("requestPersonalPrice")}
          </Link>
        ) : null}
      </aside>

      {isCustomOrder ? <StickyContactBar whatsappHref={quoteHref} /> : null}
    </div>
  );
}
