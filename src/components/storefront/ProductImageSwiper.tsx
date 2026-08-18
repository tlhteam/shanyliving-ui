"use client";

import { useEffect, useMemo, useState } from "react";
import { AppImage } from "@/components/app/AppImage";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProductImageSwiperProps = {
  images: string[];
  productName: string;
  badge?: string;
};

export function ProductImageSwiper({ images, productName, badge }: ProductImageSwiperProps) {
  const gallery = useMemo(() => images.filter(Boolean), [images]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (gallery.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % gallery.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [gallery.length]);

  const activeImage = gallery[activeIndex] ?? gallery[0] ?? null;

  return (
    <section>
      <div className="relative overflow-hidden rounded-lg">
        <AppImage src={activeImage} alt={productName} className="aspect-[1.15/1]" sizes="(max-width: 1024px) 100vw, 55vw" preload loading="eager" imageClassName="object-cover transition-transform duration-700 hover:scale-[1.02]" />
        <span className="absolute start-4 top-4 rounded-full bg-white px-4 py-1 text-xs font-bold text-neutral-950">{badge ?? "Ready to order"}</span>
        <span className="absolute end-4 top-4 grid size-9 place-items-center rounded-full bg-white/80 text-neutral-950">
          <SiteIcon name="heart" className="size-5" />
        </span>
        {gallery.length > 1 ? (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/35 px-3 py-2 backdrop-blur">
            {gallery.map((image, index) => (
              <button
                key={`${image}-dot-${index}`}
                type="button"
                aria-label={`Show ${productName} image ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={cn("size-2 rounded-full bg-white/50 transition", activeIndex === index && "w-5 bg-white")}
              />
            ))}
          </div>
        ) : null}
      </div>
      <div className="mt-4 grid grid-cols-5 gap-3">
        {gallery.slice(0, 5).map((image, index) => (
          <Button
            key={`${image}-${index}`}
            type="button"
            variant="ghost"
            className={cn("h-auto rounded-lg border p-0", activeIndex === index ? "border-neutral-950 dark:border-white" : "border-transparent")}
            onClick={() => setActiveIndex(index)}
          >
            <AppImage src={image} alt={`${productName} gallery ${index + 1}`} className="aspect-[1.2/1] w-full rounded-lg" sizes="20vw" />
          </Button>
        ))}
      </div>
    </section>
  );
}
