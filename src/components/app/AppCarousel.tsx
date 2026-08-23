"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { cn } from "@/lib/utils";

type AppCarouselProps = {
  children: React.ReactNode;
  itemClassName?: string;
  className?: string;
  arrows?: boolean;
  dots?: boolean;
  previousLabel?: string;
  nextLabel?: string;
};

export function AppCarousel({
  children,
  itemClassName = "basis-[82%] sm:basis-1/2 lg:basis-1/3",
  className,
  arrows = true,
  dots = true,
  previousLabel = "Previous",
  nextLabel = "Next"
}: AppCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [count, setCount] = useState(0);

  const items = Array.isArray(children) ? children : [children];

  const sync = useCallback(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const slides = Array.from(track.children) as HTMLElement[];
    setCount(slides.length);

    if (!slides.length) {
      return;
    }

    const center = track.scrollLeft + track.clientWidth / 2;
    let closest = 0;
    let smallest = Number.POSITIVE_INFINITY;

    slides.forEach((slide, index) => {
      const distance = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center);

      if (distance < smallest) {
        smallest = distance;
        closest = index;
      }
    });

    setActive(closest);
  }, []);

  useEffect(() => {
    sync();
  }, [sync, items.length]);

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    const slides = track ? (Array.from(track.children) as HTMLElement[]) : [];
    const target = slides[Math.max(0, Math.min(index, slides.length - 1))];

    if (!track || !target) {
      return;
    }

    track.scrollTo({ left: target.offsetLeft - track.offsetLeft, behavior: "smooth" });
  };

  return (
    <div className={cn("relative", className)}>
      <div
        ref={trackRef}
        onScroll={sync}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => (
          <div key={index} className={cn("min-w-0 shrink-0 grow-0 snap-start", itemClassName)}>
            {item}
          </div>
        ))}
      </div>

      {arrows && count > 1 ? (
        <>
          <button
            type="button"
            aria-label={previousLabel}
            onClick={() => scrollToIndex(active - 1)}
            className="absolute -start-2 top-1/2 hidden size-9 -translate-y-1/2 place-items-center rounded-full bg-white text-neutral-900 shadow-md transition hover:bg-neutral-900 hover:text-white sm:grid"
          >
            <SiteIcon name="arrow-left" className="size-4 rtl:rotate-180" />
          </button>
          <button
            type="button"
            aria-label={nextLabel}
            onClick={() => scrollToIndex(active + 1)}
            className="absolute -end-2 top-1/2 hidden size-9 -translate-y-1/2 place-items-center rounded-full bg-white text-neutral-900 shadow-md transition hover:bg-neutral-900 hover:text-white sm:grid"
          >
            <SiteIcon name="arrow-right" className="size-4 rtl:rotate-180" />
          </button>
        </>
      ) : null}

      {dots && count > 1 ? (
        <div className="mt-3 flex justify-center gap-1.5 sm:hidden">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`${nextLabel} ${index + 1}`}
              aria-current={active === index}
              onClick={() => scrollToIndex(index)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                active === index ? "w-5 bg-neutral-900 dark:bg-white" : "w-1.5 bg-neutral-300 dark:bg-white/30"
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
