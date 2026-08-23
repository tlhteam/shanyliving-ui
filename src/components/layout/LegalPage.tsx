import { getTranslations } from "next-intl/server";
import { AppSection } from "@/components/app/AppSection";
import { SiteIcon } from "@/components/icons/SiteIcon";

type LegalSection = {
  heading: string;
  body: string;
};

export async function LegalPage({ document }: { document: "privacy" | "terms" | "accessibility" }) {
  const t = await getTranslations("legal");
  const sections = t.raw(`${document}.sections`) as LegalSection[];

  return (
    <div className="bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <AppSection className="max-w-3xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">{t("updated")}</p>
        <h1 className="mt-3 font-serif text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">{t(`${document}.title`)}</h1>
        <p className="mt-4 text-sm leading-6 text-neutral-700 dark:text-neutral-300">{t(`${document}.intro`)}</p>

        <p className="mt-6 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100">
          <SiteIcon name="shield" className="mt-0.5 size-4 shrink-0" />
          <span>{t("reviewNotice")}</span>
        </p>

        <div className="mt-10 space-y-8">
          {sections.map((section, index) => (
            <section key={section.heading}>
              <h2 className="flex items-baseline gap-3 font-serif text-xl font-bold sm:text-2xl">
                <span className="text-sm font-bold text-neutral-400 dark:text-neutral-500">{String(index + 1).padStart(2, "0")}</span>
                {section.heading}
              </h2>
              <p className="mt-2 text-sm leading-6 text-neutral-700 dark:text-neutral-300">{section.body}</p>
            </section>
          ))}
        </div>
      </AppSection>
    </div>
  );
}
