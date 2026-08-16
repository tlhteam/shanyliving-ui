"use client";

import { useState } from "react";
import { AppImage } from "@/components/app/AppImage";
import { SiteIcon } from "@/components/icons/SiteIcon";
import type { StorefrontProduct } from "@/lib/storefront-pages";

const optionGroups = [
  {
    title: "Size & Configuration",
    summary: "2.8m / Right chaise",
    details: ["2.2m apartment sofa", "2.4m standard width", "2.8m lounge layout", "3.2m family layout"]
  },
  {
    title: "Fabric",
    summary: "Boucle, linen, chenille, velvet",
    details: ["Boucle", "Performance Linen", "Soft Chenille", "Premium Velvet"]
  },
  {
    title: "Color",
    summary: "Light Beige, Sand, Caramel, Espresso, Forest",
    details: ["Light Beige", "Sand", "Caramel", "Espresso", "Forest"]
  },
  {
    title: "Leg Style",
    summary: "Hidden, oak, walnut, black metal",
    details: ["Hidden base", "Natural oak", "Walnut wood", "Black metal"]
  },
  {
    title: "Cushion Comfort",
    summary: "Medium-soft showroom comfort",
    details: ["Deep seats", "Premium fill", "Supportive back pillows", "Family daily use"]
  }
];

const swatches = [
  { name: "Light Beige", value: "#eee9df" },
  { name: "Sand", value: "#d9d4ca" },
  { name: "Caramel", value: "#b1845f" },
  { name: "Espresso", value: "#3d271c" },
  { name: "Forest", value: "#183421" }
];

export function ProductDetailAccordion({ product }: { product: StorefrontProduct }) {
  const [open, setOpen] = useState(optionGroups[0].title);

  return (
    <div className="mt-6 divide-y divide-neutral-300 border border-neutral-300 bg-white text-neutral-950 dark:divide-white/15 dark:border-white/20 dark:bg-neutral-950 dark:text-neutral-50">
      {optionGroups.map((group) => {
        const expanded = open === group.title;

        return (
          <div key={group.title}>
            <button type="button" onClick={() => setOpen(expanded ? "" : group.title)} className="flex w-full items-center justify-between px-5 py-4 text-start transition hover:bg-neutral-50 dark:hover:bg-white/10" aria-expanded={expanded}>
              <span>
                <span className="block text-sm font-bold">{group.title}</span>
                <span className="text-xs text-neutral-600 dark:text-neutral-400">{expanded ? group.summary : "Choose your preference"}</span>
              </span>
              <SiteIcon name="chevron-right" className={`size-4 transition ${expanded ? "rotate-90" : ""}`} />
            </button>
            {expanded ? (
              <div className="animate-in fade-in slide-in-from-top-1 px-5 pb-5">
                {group.title === "Fabric" ? (
                  <div className="grid grid-cols-4 gap-3">
                    {["/images/category-sofas.png", "/images/product-linen-cushion.png", "/images/look-warm-minimalism.png", "/images/look-urban-luxury.png"].map((image, index) => (
                      <AppImage key={image} src={image} alt={`${group.details[index]} preview`} className="aspect-square rounded-md border border-neutral-200 dark:border-white/10" sizes="96px" />
                    ))}
                  </div>
                ) : null}
                {group.title === "Color" ? (
                  <div className="flex flex-wrap gap-3">
                    {swatches.map((swatch) => (
                      <span key={swatch.name} title={swatch.name} className="text-center text-[10px] font-bold text-neutral-600 dark:text-neutral-300">
                        <span className="mx-auto block size-9 rounded-full border border-neutral-300 dark:border-white/20" style={{ backgroundColor: swatch.value }} />
                        <span className="mt-1 block">{swatch.name}</span>
                      </span>
                    ))}
                  </div>
                ) : null}
                {group.title !== "Fabric" && group.title !== "Color" ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {group.details.map((detail) => (
                      <span key={detail} className="rounded-md border border-neutral-200 px-3 py-2 text-xs font-bold dark:border-white/10">{detail}</span>
                    ))}
                  </div>
                ) : null}
                <div className="mt-4 rounded-md bg-neutral-50 p-3 text-xs text-neutral-600 dark:bg-white/10 dark:text-neutral-300">
                  Preview based on {product.name}. Final selections continue in the 4-step customizer.
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
