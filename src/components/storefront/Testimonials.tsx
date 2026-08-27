"use client";

import { useTranslations } from "next-intl";
import { AppSection } from "@/components/app/AppSection";
import { Star } from "lucide-react";
import { testimonials } from "@/lib/testimonials";

export function Testimonials({ className }: { className?: string }) {
  const t = useTranslations("testimonials");

  if (testimonials.length === 0) return null;

  return (
    <AppSection className={className}>
      <h2 className="font-serif text-2xl font-bold sm:text-3xl">{t("title")}</h2>
      <p className="mt-2 max-w-xl text-sm text-neutral-600 dark:text-neutral-400">{t("subtitle")}</p>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((item, index) => (
          <div key={index} className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-900">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, star) => (
                <Star
                  key={star}
                  className={star < item.rating ? "size-4 fill-amber-500 text-amber-500" : "size-4 text-neutral-300 dark:text-neutral-700"}
                />
              ))}
            </div>
            <p className="mt-3 text-sm leading-6 text-neutral-700 dark:text-neutral-300">&ldquo;{item.quote}&rdquo;</p>
            <p className="mt-3 text-sm font-bold">
              {item.name}
              {item.location ? <span className="font-normal text-neutral-500 dark:text-neutral-400">, {item.location}</span> : null}
            </p>
          </div>
        ))}
      </div>
    </AppSection>
  );
}
