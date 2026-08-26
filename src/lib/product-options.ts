import { fabrics as fallbackFabrics } from "@/lib/fabrics";
import { sofaConfigurations, sofaSizes } from "@/lib/sofa-options";
import type { StorefrontProduct } from "@/lib/storefront-pages";

export type ProductChoice = {
  label: string;
  swatch?: string | null;
  image?: string | null;
};

const fallbackColors: ProductChoice[] = [
  { label: "Light Beige", swatch: "#eee9df" },
  { label: "Sand", swatch: "#d9d4ca" },
  { label: "Caramel", swatch: "#b1845f" },
  { label: "Espresso", swatch: "#3d271c" },
  { label: "Forest", swatch: "#183421" }
];

export function optionChoices(product: StorefrontProduct | undefined, name: string): ProductChoice[] {
  const group = product?.optionGroups?.find((entry) => entry.name.toLowerCase() === name.toLowerCase());

  return (group?.values ?? []).map((value) => ({
    label: value.label,
    swatch: value.swatch ?? null,
    image: value.image ?? null
  }));
}

export function productSizes(product?: StorefrontProduct): string[] {
  const sizes = optionChoices(product, "size").map((choice) => choice.label);

  return sizes.length ? [...sizes, "Custom Size"] : sofaSizes;
}

export function productConfigurations(product?: StorefrontProduct): string[] {
  const configurations = optionChoices(product, "configuration").map((choice) => choice.label);

  return configurations.length ? configurations : sofaConfigurations;
}

export function productFabrics(product?: StorefrontProduct): ProductChoice[] {
  const choices = optionChoices(product, "fabric");

  if (!choices.length) {
    return fallbackFabrics.map((fabric) => ({ label: fabric.name, image: fabric.image }));
  }

  return choices.map((choice, index) => ({
    ...choice,
    image: choice.image ?? product?.fabricImages?.[index] ?? fallbackFabrics.find((fabric) => fabric.name === choice.label)?.image ?? null
  }));
}

export function productColors(product?: StorefrontProduct): ProductChoice[] {
  const choices = optionChoices(product, "color");

  if (choices.length) {
    return choices;
  }

  if (product?.colors?.length) {
    return product.colors.map((swatch, index) => ({
      label: product.colorNames?.[index] ?? swatch,
      swatch,
      image: null
    }));
  }

  return fallbackColors;
}

export function variantImage(product: StorefrontProduct | undefined, selection: Record<string, string | undefined>) {
  const entries = Object.entries(selection).filter((entry): entry is [string, string] => Boolean(entry[1]));

  if (!product?.variantMedia?.length || !entries.length) {
    return undefined;
  }

  const scored = product.variantMedia
    .map((media) => {
      const keys = Object.keys(media.options);
      const matched = entries.filter(([name, value]) =>
        keys.some((key) => key.toLowerCase() === name.toLowerCase() && media.options[key] === value)
      );

      return { image: media.image, score: matched.length, size: keys.length };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.size - b.size);

  return scored[0]?.image;
}
