"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AppButton } from "@/components/app/AppButton";
import { SofaLayeredPreview, metresFor, widthRatioFor } from "@/components/sofa/SofaLayeredPreview";
import { useOptionLabel } from "@/hooks/use-option-label";
import { productColors, productConfigurations, productFabrics, productSizes, variantImage } from "@/lib/product-options";
import { cn } from "@/lib/utils";
import type { StorefrontProduct } from "@/lib/storefront-pages";

type Selection = {
  size: string;
  configuration: string;
  fabric: string;
  color: string;
};

const chipClass = (active: boolean) =>
  cn(
    "rounded-md border px-3 py-1.5 text-xs font-bold transition",
    active
      ? "border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950"
      : "border-neutral-300 hover:border-neutral-950 dark:border-white/15 dark:hover:border-white"
  );

export function JourneyPreview({ product }: { product: StorefrontProduct }) {
  const t = useTranslations("home.journey.preview");
  const optionLabel = useOptionLabel();

  const sizes = useMemo(() => productSizes(product).filter((size) => size !== "Custom Size"), [product]);
  const configurations = useMemo(() => productConfigurations(product), [product]);
  const fabrics = useMemo(() => productFabrics(product), [product]);
  const colors = useMemo(() => productColors(product), [product]);

  const [selection, setSelection] = useState<Selection>({ size: "", configuration: "", fabric: "", color: "" });

  const size = sizes.includes(selection.size) ? selection.size : (sizes[Math.min(1, sizes.length - 1)] ?? "");
  const configuration = configurations.includes(selection.configuration)
    ? selection.configuration
    : (configurations[0] ?? "");
  const fabric = fabrics.find((item) => item.label === selection.fabric) ?? fabrics[0];
  const color = colors.find((item) => item.label === selection.color) ?? colors[0];

  const baseImage =
    variantImage(product, { Color: color?.label, Fabric: fabric?.label, Size: size, Configuration: configuration }) ??
    color?.image ??
    product.image;

  const select = (patch: Partial<Selection>) => setSelection((current) => ({ ...current, ...patch }));

  const groups = [
    {
      key: "size",
      values: sizes,
      active: size,
      onSelect: (value: string) => select({ size: value })
    },
    {
      key: "configuration",
      values: configurations,
      active: configuration,
      onSelect: (value: string) => select({ configuration: value })
    },
    {
      key: "fabric",
      values: fabrics.map((item) => item.label),
      active: fabric?.label ?? "",
      onSelect: (value: string) => select({ fabric: value })
    },
    {
      key: "color",
      values: colors.map((item) => item.label),
      active: color?.label ?? "",
      onSelect: (value: string) => select({ color: value })
    }
  ];

  const customizerHref = `/customize-your-sofa?product=${product.slug}&step=size`;

  return (
    <div className="rounded-xl border border-neutral-300 bg-white p-4 dark:border-white/15 dark:bg-neutral-950 sm:p-6 lg:rounded-2xl">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-8">
        <SofaLayeredPreview
          alt={product.name}
          baseImage={baseImage}
          fabricImage={fabric?.image}
          fabricLabel={fabric?.label}
          colorSwatch={color?.swatch}
          colorLabel={color?.label}
          sizeLabel={size}
          widthRatio={widthRatioFor(size, sizes)}
          widthMetres={metresFor(size)}
          vector
          mirrored={configurations.indexOf(configuration) > 0}
          compact
        />

        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
            {t("eyebrow")}
          </p>
          <h3 className="mt-2 font-serif text-xl font-bold sm:text-2xl">{t("title")}</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">{t("text")}</p>

          <div className="mt-5 space-y-4">
            {groups.map((group, index) =>
              group.values.length ? (
                <div key={group.key}>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                    {index + 1}. {t(`groups.${group.key}`)}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {group.values.map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => group.onSelect(value)}
                        aria-pressed={group.active === value}
                        className={chipClass(group.active === value)}
                      >
                        {optionLabel(value)}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null
            )}
          </div>

          <Link href={customizerHref} className="mt-6 block">
            <AppButton className="w-full sm:w-auto">{t("cta")}</AppButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
