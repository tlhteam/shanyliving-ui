"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AppButton } from "@/components/app/AppButton";
import { AppImage } from "@/components/app/AppImage";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { ProductBuyActions } from "@/components/storefront/ProductBuyActions";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { StorefrontOptionGroup, StorefrontProduct } from "@/lib/storefront-pages";

type ProductDetailHeroProps = {
  product: StorefrontProduct;
  images: string[];
};

type OptionValue = StorefrontOptionGroup["values"][number];

const fallbackGroups: StorefrontOptionGroup[] = [
  { name: "Size", values: [{ label: "2.2m" }, { label: "2.4m" }, { label: "2.8m" }, { label: "3.2m" }] },
  { name: "Configuration", values: [{ label: "Left chaise" }, { label: "Right chaise" }] },
  {
    name: "Fabric",
    values: [{ label: "Boucle" }, { label: "Performance Linen" }, { label: "Soft Chenille" }, { label: "Premium Velvet" }]
  },
  {
    name: "Color",
    values: [
      { label: "Light Beige", swatch: "#eee9df" },
      { label: "Sand", swatch: "#d9d4ca" },
      { label: "Caramel", swatch: "#b1845f" },
      { label: "Espresso", swatch: "#3d271c" },
      { label: "Forest", swatch: "#183421" }
    ]
  }
];

function resolveGroups(product: StorefrontProduct): StorefrontOptionGroup[] {
  if (product.optionGroups?.length) {
    return product.optionGroups;
  }

  const colorValues = (product.colors ?? []).map((swatch, index) => ({
    label: product.colorNames?.[index] ?? `Color ${index + 1}`,
    swatch
  }));

  const fabricValues = (product.fabricImages ?? []).map((image, index) => ({
    label: product.variants?.[index] ?? `Fabric ${index + 1}`,
    image
  }));

  return fallbackGroups.map((group) => {
    if (group.name === "Color" && colorValues.length) {
      return { name: group.name, values: colorValues };
    }

    if (group.name === "Fabric" && fabricValues.length) {
      return { name: group.name, values: fabricValues };
    }

    return group;
  });
}

function normalizeToken(value: string) {
  return value.toLowerCase().replace(/gray/g, "grey").replace(/[^a-z0-9]+/g, "");
}

function labelTokens(label: string) {
  const words = label.split(/[^A-Za-z0-9]+/).filter(Boolean);

  return [normalizeToken(label), ...words.map(normalizeToken)]
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);
}

function fileToken(image: string) {
  const filename = image.split("/").pop() ?? image;

  return normalizeToken(filename.replace(/\.[a-z0-9]+$/i, ""));
}

function imageForSelection(
  product: StorefrontProduct,
  gallery: string[],
  selection: Record<string, string>,
  changedGroup: string
) {
  const entries = Object.entries(selection).filter(([, value]) => Boolean(value));
  const media = product.variantMedia ?? [];

  const exact = media.find(
    (entry) =>
      Object.keys(entry.options).length === entries.length &&
      entries.every(([name, value]) => entry.options[name] === value)
  );

  if (exact) {
    return exact.image;
  }

  const scored = media
    .map((entry) => ({
      image: entry.image,
      matched: Object.entries(entry.options).filter(([name, value]) => selection[name] === value).length,
      total: Object.keys(entry.options).length,
      touchesChanged: Object.keys(entry.options).includes(changedGroup)
    }))
    .filter((entry) => entry.matched === entry.total && entry.total > 0)
    .sort((a, b) => Number(b.touchesChanged) - Number(a.touchesChanged) || b.matched - a.matched);

  if (scored.length) {
    return scored[0].image;
  }

  const changedValue = selection[changedGroup];

  if (!changedValue) {
    return null;
  }

  for (const token of labelTokens(changedValue)) {
    if (token.length < 3) {
      continue;
    }

    const match = gallery.find((image) => {
      const file = fileToken(image);

      return file.includes(token) || token.includes(file);
    });

    if (match) {
      return match;
    }
  }

  return null;
}

function parseDescription(description?: string) {
  if (!description) {
    return { intro: "", specs: [] as Array<{ label: string; value: string }> };
  }

  const blocks = description.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  const intro: string[] = [];
  const specs: Array<{ label: string; value: string }> = [];

  blocks.forEach((block) => {
    const match = block.match(/^([A-Za-z][A-Za-z /&-]{1,38}):\s*([\s\S]+)$/);

    if (match) {
      specs.push({ label: match[1].trim(), value: match[2].trim().replace(/\.+$/, "") });
      return;
    }

    intro.push(block);
  });

  return { intro: intro.join(" "), specs };
}

export function ProductDetailHero({ product, images }: ProductDetailHeroProps) {
  const t = useTranslations("storefront.detail");
  const locale = useLocale();
  const groups = useMemo(() => resolveGroups(product), [product]);
  const { intro, specs } = useMemo(() => parseDescription(product.description), [product.description]);

  const gallery = useMemo(() => {
    const optionImages = groups.flatMap((group) =>
      group.values.map((value) => value.image).filter((image): image is string => Boolean(image))
    );
    const variantImages = (product.variantMedia ?? []).map((entry) => entry.image);

    return [...new Set([...images.filter(Boolean), ...variantImages, ...optionImages])];
  }, [groups, images, product.variantMedia]);

  const [activeImage, setActiveImage] = useState(gallery[0] ?? product.image);
  const [selection, setSelection] = useState<Record<string, string>>(() =>
    Object.fromEntries(groups.map((group) => [group.name, group.values[0]?.label ?? ""]))
  );

  const hasPrice = product.price > 0;
  const summary = groups
    .map((group) => selection[group.name])
    .filter(Boolean)
    .join(" / ");

  const variantKey = groups
    .map((group) => selection[group.name])
    .filter(Boolean)
    .join("|");

  const select = (group: StorefrontOptionGroup, value: OptionValue) => {
    const nextSelection = { ...selection, [group.name]: value.label };
    setSelection(nextSelection);

    const nextImage = value.image ?? imageForSelection(product, gallery, nextSelection, group.name);

    if (nextImage) {
      setActiveImage(nextImage);
    }

    document.dispatchEvent(new Event("variant:change"));
  };

  const thumbnails = gallery.slice(0, 8);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="min-w-0">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100 sm:aspect-[1.15/1] dark:bg-neutral-900">
          {gallery.map((image) => (
            <AppImage
              key={image}
              src={image}
              alt={product.name}
              className={cn(
                "absolute inset-0 transition-opacity duration-500 ease-out",
                image === activeImage ? "opacity-100" : "opacity-0"
              )}
              sizes="(max-width: 1024px) 100vw, 55vw"
              preload={image === gallery[0]}
              loading={image === gallery[0] ? "eager" : "lazy"}
            />
          ))}
          <span className="absolute start-3 top-3 z-10 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-950 sm:start-4 sm:top-4 sm:text-xs">
            {product.badge ?? t("ready")}
          </span>
          <button
            type="button"
            aria-label={t("save", { name: product.name })}
            className="absolute end-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-white/85 text-neutral-950 transition hover:bg-white sm:end-4 sm:top-4"
          >
            <SiteIcon name="heart" className="size-4" />
          </button>
        </div>

        {thumbnails.length > 1 ? (
          <div className="-mx-4 mt-3 px-4 sm:mx-0 sm:mt-4 sm:px-0">
            <div className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto pb-2 sm:grid sm:grid-cols-6 sm:gap-3 sm:overflow-visible sm:pb-0">
              {thumbnails.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  aria-label={`Show ${product.name} image ${index + 1}`}
                  aria-pressed={activeImage === image}
                  onClick={() => setActiveImage(image)}
                  className={cn(
                    "w-20 shrink-0 snap-start overflow-hidden rounded-lg border-2 transition sm:w-auto",
                    activeImage === image ? "border-neutral-950 dark:border-white" : "border-transparent hover:border-neutral-300"
                  )}
                >
                  <AppImage src={image} alt={`${product.name} gallery ${index + 1}`} className="aspect-[1.2/1] w-full" sizes="120px" />
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <aside
        className="min-w-0"
        data-shiputzai-product=""
        data-product-id={product.slug}
        data-sku={product.slug}
        data-variant-id={variantKey}
      >
        <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs font-bold text-neutral-600 sm:mb-6 dark:text-neutral-400">
          <Link href="/">{t("home")}</Link>
          <SiteIcon name="chevron-right" className="size-3 rtl:rotate-180" />
          <Link href="/sofas">{t("collection")}</Link>
          <SiteIcon name="chevron-right" className="size-3 rtl:rotate-180" />
          <span className="text-neutral-950 dark:text-neutral-50">{product.name}</span>
        </nav>

        <h1 className="font-serif text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">{product.name}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs sm:mt-4">
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-950 dark:bg-white/10 dark:text-white">
            {product.badge ?? t("ready")}
          </span>
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-950 dark:bg-white/10 dark:text-white">
            {t("trusted")}
          </span>
          <span className="text-neutral-600 dark:text-neutral-400">{t("reviews")}</span>
        </div>

        {intro ? (
          <p className="mt-4 text-sm leading-6 text-neutral-700 sm:mt-5 dark:text-neutral-300">{intro}</p>
        ) : null}

        <div className="mt-6 border-t border-neutral-200 pt-5 dark:border-white/10">
          <p className="text-sm font-bold">
            {hasPrice ? (
              <>{t("from")} <span className="text-2xl sm:text-3xl">{formatMoney(product.price, locale)}</span></>
            ) : (
              <span className="text-2xl sm:text-3xl">{t("priceOnRequest")}</span>
            )}
          </p>
          <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
            {hasPrice ? t("priceVaries") : t("quoteNote")}
          </p>
        </div>

        <div className="mt-6 space-y-5">
          {groups.map((group) => (
            <div key={group.name}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">{group.name}</span>
                <span className="text-sm font-bold">{selection[group.name]}</span>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-2.5">
                {group.values.map((value) => {
                  const active = selection[group.name] === value.label;

                  if (value.swatch) {
                    return (
                      <button
                        key={`${group.name}-${value.label}`}
                        type="button"
                        title={value.label}
                        aria-label={value.label}
                        aria-pressed={active}
                        onClick={() => select(group, value)}
                        className={cn(
                          "size-9 rounded-full border-2 transition",
                          active
                            ? "border-neutral-950 ring-2 ring-neutral-950/20 dark:border-white"
                            : "border-neutral-200 hover:border-neutral-500 dark:border-white/20"
                        )}
                        style={{ backgroundColor: value.swatch }}
                      />
                    );
                  }

                  if (value.image) {
                    return (
                      <button
                        key={`${group.name}-${value.label}`}
                        type="button"
                        aria-pressed={active}
                        onClick={() => select(group, value)}
                        className={cn(
                          "w-20 overflow-hidden rounded-lg border-2 p-1 text-center transition",
                          active ? "border-neutral-950 dark:border-white" : "border-neutral-200 hover:border-neutral-400 dark:border-white/15"
                        )}
                      >
                        <AppImage src={value.image} alt={value.label} className="aspect-square rounded-md" sizes="80px" />
                        <span className="mt-1 block truncate text-[10px] font-bold">{value.label}</span>
                      </button>
                    );
                  }

                  return (
                    <button
                      key={`${group.name}-${value.label}`}
                      type="button"
                      aria-pressed={active}
                      onClick={() => select(group, value)}
                      className={cn(
                        "h-10 rounded-md border px-4 text-xs font-bold transition",
                        active
                          ? "border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950"
                          : "border-neutral-300 hover:border-neutral-950 dark:border-white/15"
                      )}
                    >
                      {value.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {summary ? (
          <p className="mt-5 rounded-lg bg-neutral-100 p-3 text-xs leading-5 text-neutral-700 dark:bg-white/10 dark:text-neutral-300">
            <span className="font-bold">{t("selection")}:</span> {summary}
          </p>
        ) : null}

        <div className="mt-5">
          <ProductBuyActions product={product} />
        </div>

        <div data-shiputzai-button-slot="" className="mt-3 empty:mt-0" />

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Link href={`/customize-your-sofa?product=${product.slug}&step=model`} className="block">
            <AppButton variant="outline" className="w-full">{t("customize")}</AppButton>
          </Link>
          <Link href={`/customize-your-sofa?product=${product.slug}&step=room`} className="block">
            <AppButton variant="outline" className="w-full">{t("seeInRoom")}</AppButton>
          </Link>
        </div>

        {hasPrice ? (
          <p className="mt-3 text-center text-xs text-neutral-600 dark:text-neutral-400">
            {t("ctaNote")}
          </p>
        ) : (
          <Link href="/showroom" className="mt-3 block">
            <AppButton variant="outline" className="w-full">{t("askShowroom")}</AppButton>
          </Link>
        )}

        {specs.length || product.dimensions ? (
          <dl className="mt-7 divide-y divide-neutral-200 border-t border-neutral-200 text-sm dark:divide-white/10 dark:border-white/10">
            {product.dimensions && !specs.some((spec) => spec.label.toLowerCase().startsWith("dimensions")) ? (
              <div className="grid grid-cols-1 gap-1 py-2.5 sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:gap-3">
                <dt className="min-w-0 break-words text-xs font-bold uppercase leading-5 tracking-[0.1em] text-neutral-500 dark:text-neutral-400">{t("dimensions")}</dt>
                <dd className="min-w-0 break-words text-neutral-800 dark:text-neutral-200">{product.dimensions}</dd>
              </div>
            ) : null}
            {specs.map((spec) => (
              <div key={spec.label} className="grid grid-cols-1 gap-1 py-2.5 sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:gap-3">
                <dt className="min-w-0 break-words text-xs font-bold uppercase leading-5 tracking-[0.1em] text-neutral-500 dark:text-neutral-400">{spec.label}</dt>
                <dd className="min-w-0 break-words text-neutral-800 dark:text-neutral-200">{spec.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </aside>
    </div>
  );
}
