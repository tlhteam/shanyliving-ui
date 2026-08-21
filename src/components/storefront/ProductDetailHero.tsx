"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AppButton } from "@/components/app/AppButton";
import { AppImage } from "@/components/app/AppImage";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { ProductBuyActions } from "@/components/storefront/ProductBuyActions";
import { cn } from "@/lib/utils";
import type { StorefrontOptionGroup, StorefrontProduct } from "@/lib/storefront-pages";

type ProductDetailHeroProps = {
  product: StorefrontProduct;
  images: string[];
};

const fallbackGroups: StorefrontOptionGroup[] = [
  {
    name: "Size",
    values: [{ label: "2.2m" }, { label: "2.4m" }, { label: "2.8m" }, { label: "3.2m" }]
  },
  {
    name: "Configuration",
    values: [{ label: "Left chaise" }, { label: "Right chaise" }]
  },
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

export function ProductDetailHero({ product, images }: ProductDetailHeroProps) {
  const groups = useMemo(() => resolveGroups(product), [product]);
  const gallery = useMemo(() => images.filter(Boolean), [images]);
  const [activeImage, setActiveImage] = useState(gallery[0] ?? product.image);
  const [selection, setSelection] = useState<Record<string, string>>(() =>
    Object.fromEntries(groups.map((group) => [group.name, group.values[0]?.label ?? ""]))
  );

  const hasPrice = product.price > 0;
  const summary = groups
    .map((group) => selection[group.name])
    .filter(Boolean)
    .join(" / ");

  const select = (group: StorefrontOptionGroup, value: StorefrontOptionGroup["values"][number]) => {
    setSelection((current) => ({ ...current, [group.name]: value.label }));

    if (value.image) {
      setActiveImage(value.image);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="min-w-0">
        <div className="relative overflow-hidden rounded-lg">
          <AppImage
            src={activeImage}
            alt={product.name}
            className="aspect-square sm:aspect-[1.15/1]"
            sizes="(max-width: 1024px) 100vw, 55vw"
            preload
            loading="eager"
            imageClassName="object-cover transition duration-700"
          />
          <span className="absolute start-3 top-3 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-950 sm:start-4 sm:top-4 sm:text-xs">
            {product.badge ?? "Ready to order"}
          </span>
          <button
            type="button"
            aria-label={`Save ${product.name}`}
            className="absolute end-3 top-3 grid size-9 place-items-center rounded-full bg-white/85 text-neutral-950 transition hover:bg-white sm:end-4 sm:top-4"
          >
            <SiteIcon name="heart" className="size-4" />
          </button>
        </div>

        {gallery.length > 1 ? (
          <div className="-mx-4 mt-3 px-4 sm:mx-0 sm:mt-4 sm:px-0">
            <div className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto pb-2 sm:grid sm:grid-cols-5 sm:gap-3 sm:overflow-visible sm:pb-0">
              {gallery.slice(0, 8).map((image, index) => (
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

      <aside className="min-w-0">
        <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs font-bold text-neutral-600 sm:mb-6 dark:text-neutral-400">
          <Link href="/">Home</Link>
          <SiteIcon name="chevron-right" className="size-3 rtl:rotate-180" />
          <Link href="/sofas">Sofas</Link>
          <SiteIcon name="chevron-right" className="size-3 rtl:rotate-180" />
          <span className="text-neutral-950 dark:text-neutral-50">{product.name}</span>
        </nav>

        <h1 className="font-serif text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">{product.name}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs sm:mt-4 sm:text-sm">
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-950 dark:bg-white/10 dark:text-white">
            {product.badge ?? "Ready to order"}
          </span>
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-950 dark:bg-white/10 dark:text-white">
            Trusted showroom pick
          </span>
          <span className="text-neutral-600 dark:text-neutral-400">4.8 (36 reviews)</span>
        </div>

        <p className="mt-4 max-w-md text-sm leading-6 text-neutral-700 sm:mt-5 dark:text-neutral-300">
          {product.description ?? "A modern furniture piece with refined proportions and made-to-order comfort for everyday living."}
        </p>

        <p className="mt-6 text-sm font-bold">
          {hasPrice ? (
            <>From <span className="text-2xl sm:text-3xl">NIS {new Intl.NumberFormat("en").format(product.price)}</span></>
          ) : (
            <span className="text-2xl sm:text-3xl">Price on request</span>
          )}
        </p>
        <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
          {hasPrice ? "Price varies by size and configuration" : "Available by showroom quote"}
        </p>

        {product.dimensions ? (
          <p className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm dark:border-white/10 dark:bg-white/10">
            <span className="font-bold">Dimensions:</span> {product.dimensions}
          </p>
        ) : null}

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
                          active ? "border-neutral-950 ring-2 ring-neutral-950/20 dark:border-white" : "border-neutral-200 hover:border-neutral-500 dark:border-white/20"
                        )}
                        style={{ backgroundColor: value.swatch }}
                      />
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
            <span className="font-bold">Your selection:</span> {summary}
          </p>
        ) : null}

        <div className="mt-5">
          <ProductBuyActions product={product} />
        </div>

        {hasPrice ? (
          <>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Link href={`/customize-your-sofa?product=${product.slug}&step=model`} className="block">
                <AppButton variant="outline" className="w-full">Customize Your Sofa</AppButton>
              </Link>
              <Link href={`/customize-your-sofa?product=${product.slug}&step=room`} className="block">
                <AppButton variant="outline" className="w-full">See It In My Room (AI)</AppButton>
              </Link>
            </div>
            <p className="mt-3 text-center text-xs text-neutral-600 dark:text-neutral-400">
              Add to cart for checkout, customize in 4 steps, or preview the sofa in your room.
            </p>
          </>
        ) : (
          <Link href="/showroom" className="mt-3 block">
            <AppButton variant="outline" className="w-full">Ask Showroom Team</AppButton>
          </Link>
        )}
      </aside>
    </div>
  );
}
