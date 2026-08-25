"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { AppButton } from "@/components/app/AppButton";
import { AppSection } from "@/components/app/AppSection";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { journeyPhases, journeySteps, journeyStepNumber } from "@/lib/journey";
import { cn } from "@/lib/utils";

export function HomeJourney({ fromSocial = false }: { fromSocial?: boolean }) {
  const t = useTranslations("home.journey");
  const [openPhase, setOpenPhase] = useState<string>(journeyPhases[0].key);
  const total = journeySteps.length;

  return (
    <section id="journey" className="scroll-mt-24 bg-neutral-100 text-neutral-950 transition-colors dark:bg-neutral-900 dark:text-neutral-50">
      <AppSection className="py-10 sm:py-12 lg:py-16">
        {fromSocial ? (
          <div className="mb-8 rounded-xl border border-neutral-300 bg-white p-4 sm:p-6 dark:border-white/15 dark:bg-neutral-950">
            <span className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white dark:bg-white dark:text-neutral-950">
              <SiteIcon name="sparkle" className="size-3.5" />
              {t("instagram.badge")}
            </span>
            <h2 className="mt-3 font-serif text-xl leading-tight sm:text-2xl">{t("instagram.title")}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-700 dark:text-neutral-300">{t("instagram.text")}</p>
          </div>
        ) : null}

        <div className="max-w-3xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">{t("eyebrow")}</p>
          <h2 className="mt-3 font-serif text-2xl leading-tight sm:text-3xl lg:text-4xl">{t("title")}</h2>
          <p className="mt-3 text-sm leading-6 text-neutral-700 dark:text-neutral-300">{t("text")}</p>
        </div>

        <div className="mt-8 space-y-3 lg:mt-12 lg:grid lg:grid-cols-4 lg:gap-5 lg:space-y-0">
          {journeyPhases.map((phase, phaseIndex) => {
            const expanded = openPhase === phase.key;

            return (
              <div
                key={phase.key}
                className="overflow-hidden rounded-xl border border-neutral-300 bg-white dark:border-white/15 dark:bg-neutral-950 lg:rounded-2xl"
              >
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setOpenPhase(expanded ? "" : phase.key)}
                  className="flex w-full items-center gap-3 px-4 py-4 text-start lg:pointer-events-none lg:border-b lg:border-neutral-200 lg:px-5 dark:lg:border-white/10"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-neutral-950 text-xs font-bold text-white dark:bg-white dark:text-neutral-950">
                    {phaseIndex + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">{t(`phases.${phase.key}`)}</span>
                    <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                      {t("stepLabel", { number: journeyStepNumber(phase.steps[0].key), total })}
                    </span>
                  </span>
                  <SiteIcon
                    name="chevron-down"
                    className={cn("size-4 shrink-0 text-neutral-500 transition lg:hidden", expanded && "rotate-180")}
                  />
                </button>

                <ol className={cn("px-4 pb-4 lg:block lg:px-5 lg:pb-5 lg:pt-4", expanded ? "block" : "hidden")}>
                  {phase.steps.map((step, stepIndex) => (
                    <li key={step.key} className="relative ps-11">
                      {stepIndex === phase.steps.length - 1 ? null : (
                        <span aria-hidden className="absolute start-4 top-9 bottom-0 w-px bg-neutral-200 dark:bg-white/10" />
                      )}
                      <Link href={step.href} className="group block py-2.5">
                        <span className="absolute start-0 top-2 grid size-8 place-items-center rounded-full border border-neutral-300 bg-white text-neutral-800 transition group-hover:border-neutral-950 group-hover:bg-neutral-950 group-hover:text-white dark:border-white/20 dark:bg-neutral-950 dark:text-neutral-100 dark:group-hover:bg-white dark:group-hover:text-neutral-950">
                          <SiteIcon name={step.icon} className="size-4" />
                        </span>
                        <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400 dark:text-neutral-500">
                          {journeyStepNumber(step.key).toString().padStart(2, "0")}
                        </span>
                        <span className="mt-0.5 block text-sm font-bold leading-snug group-hover:underline">{t(`steps.${step.key}.title`)}</span>
                        <span className="mt-1 block text-xs leading-5 text-neutral-600 dark:text-neutral-400">{t(`steps.${step.key}.text`)}</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Link href="/collections" className="sm:w-auto">
            <AppButton className="w-full sm:w-auto">{fromSocial ? t("instagram.cta") : t("cta")}</AppButton>
          </Link>
          <Link href="/customize-your-sofa" className="sm:w-auto">
            <AppButton variant="outline" className="w-full sm:w-auto">{t("secondaryCta")}</AppButton>
          </Link>
        </div>
      </AppSection>
    </section>
  );
}
