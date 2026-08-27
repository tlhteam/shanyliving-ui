import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { AppButton } from "@/components/app/AppButton";
import { AppSection } from "@/components/app/AppSection";
import { ChevronDown } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqGroup = {
  heading: string;
  items: FaqItem[];
};

export async function FaqPage() {
  const t = await getTranslations("faq");
  const groups = t.raw("groups") as FaqGroup[];

  return (
    <div className="bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <AppSection className="max-w-3xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">{t("eyebrow")}</p>
        <h1 className="mt-3 font-serif text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{t("title")}</h1>
        <p className="mt-4 text-sm leading-6 text-neutral-700 dark:text-neutral-300">{t("subtitle")}</p>

        <div className="mt-10 space-y-10">
          {groups.map((group) => (
            <section key={group.heading}>
              <h2 className="font-serif text-xl font-bold sm:text-2xl">{group.heading}</h2>
              <div className="mt-4 divide-y divide-neutral-200 rounded-lg border border-neutral-200 dark:divide-white/10 dark:border-white/10">
                {group.items.map((item) => (
                  <details key={item.question} className="group px-4 py-3.5">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-sm font-bold marker:hidden">
                      {item.question}
                      <ChevronDown className="mt-0.5 size-4 shrink-0 transition group-open:rotate-180" />
                    </summary>
                    <p className="mt-2.5 text-sm leading-6 text-neutral-700 dark:text-neutral-300">{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-lg bg-neutral-100 p-6 text-neutral-950 sm:p-8 dark:bg-neutral-900 dark:text-neutral-50">
          <h2 className="font-serif text-xl font-bold sm:text-2xl">{t("ctaTitle")}</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-700 dark:text-neutral-300">{t("ctaText")}</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="block">
              <AppButton className="w-full sm:w-auto">{t("ctaContact")}</AppButton>
            </Link>
            <Link href="/showroom" className="block">
              <AppButton variant="outline" className="w-full sm:w-auto">{t("ctaShowroom")}</AppButton>
            </Link>
          </div>
        </div>
      </AppSection>
    </div>
  );
}
