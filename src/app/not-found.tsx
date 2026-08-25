import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { AppButton } from "@/components/app/AppButton";
import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppLogo } from "@/components/layout/AppLogo";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <>
      <AppHeader />
      <main className="grid min-h-[62vh] place-items-center bg-surface-cream px-4 py-20 text-center text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
        <div className="max-w-xl">
          <AppLogo className="justify-center dark:hidden" imageClassName="w-48" />
          <AppLogo variant="light" className="hidden justify-center dark:inline-flex" imageClassName="w-48" />
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-400">{t("eyebrow")}</p>
          <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">{t("title")}</h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-neutral-600 dark:text-neutral-400">{t("text")}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/" className="block"><AppButton className="w-full sm:w-auto">{t("home")}</AppButton></Link>
            <Link href="/collections" className="block"><AppButton variant="outline" className="w-full sm:w-auto">{t("browse")}</AppButton></Link>
          </div>
        </div>
      </main>
      <AppFooter />
    </>
  );
}
