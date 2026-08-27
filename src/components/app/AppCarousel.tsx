"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type AppCarouselProps = {
  children: React.ReactNode;
  ariaLabel: string;
  className?: string;
  railClassName?: string;
  loop?: boolean;
  arrows?: boolean;
};

const EDGE_TOLERANCE = 2;

export function AppCarousel({
  children,
  ariaLabel,
  className,
  railClassName,
  loop = false,
  arrows = true
}: AppCarouselProps) {
  const t = useTranslations("common");
  const railRef = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);

  const measure = useCallback(() => {
    const rail = railRef.current;

    if (rail) {
      setOverflowing(rail.scrollWidth - rail.clientWidth > EDGE_TOLERANCE);
    }
  }, []);

  useEffect(() => {
    measure();

    const rail = railRef.current;

    if (!rail || typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(measure);
    observer.observe(rail);

    return () => observer.disconnect();
  }, [measure]);

  const scrollBy = (direction: 1 | -1) => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    const first = rail.firstElementChild as HTMLElement | null;
    const step = first ? first.offsetWidth + 16 : rail.clientWidth * 0.8;
    const maxScroll = rail.scrollWidth - rail.clientWidth;
    const position = Math.abs(rail.scrollLeft);

    if (loop && direction === 1 && position >= maxScroll - EDGE_TOLERANCE) {
      rail.scrollTo({ left: 0, behavior: "smooth" });

      return;
    }

    if (loop && direction === -1 && position <= EDGE_TOLERANCE) {
      rail.scrollTo({ left: rail.scrollWidth * Math.sign(rail.scrollLeft || 1), behavior: "smooth" });

      return;
    }

    rail.scrollBy({ left: step * direction * (rail.scrollLeft < 0 ? -1 : 1), behavior: "smooth" });
  };

  return (
    <div className={cn("relative", className)}>
      <div
        ref={railRef}
        role="group"
        aria-label={ariaLabel}
        className={cn(
          "-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          railClassName
        )}
      >
        {children}
      </div>

      {arrows && overflowing ? (
        <>
          <button
            type="button"
            aria-label={t("previous")}
            onClick={() => scrollBy(-1)}
            className="absolute start-0 top-1/2 hidden -translate-y-1/2 place-items-center rounded-full border border-neutral-200 bg-white/90 p-2 shadow-[var(--shadow-elevation-2)] transition hover:bg-white sm:grid dark:border-white/15 dark:bg-neutral-900/90 dark:hover:bg-neutral-900"
          >
            <ChevronLeft className="size-4 rtl:rotate-180" />
          </button>
          <button
            type="button"
            aria-label={t("next")}
            onClick={() => scrollBy(1)}
            className="absolute end-0 top-1/2 hidden -translate-y-1/2 place-items-center rounded-full border border-neutral-200 bg-white/90 p-2 shadow-[var(--shadow-elevation-2)] transition hover:bg-white sm:grid dark:border-white/15 dark:bg-neutral-900/90 dark:hover:bg-neutral-900"
          >
            <ChevronRight className="size-4 rtl:rotate-180" />
          </button>
        </>
      ) : null}
    </div>
  );
}
