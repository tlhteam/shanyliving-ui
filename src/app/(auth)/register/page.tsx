import Link from "next/link";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Gift, Heart, Package, Sofa, UserPlus } from "lucide-react";
import { authOptions } from "@/auth";
import { AppCard } from "@/components/app/AppCard";
import { AppLogo } from "@/components/layout/AppLogo";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default async function RegisterPage() {
  const t = await getTranslations("auth");
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/customer");
  }

  return (
    <main className="grid min-h-screen bg-neutral-100 dark:bg-neutral-950 lg:grid-cols-[1fr_560px]">
      <section className="relative hidden overflow-hidden bg-black text-white lg:block">
        <div className="absolute inset-0 bg-[url('/images/look-warm-minimalism.png')] bg-cover bg-center opacity-60" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <AppLogo variant="light" imageClassName="w-44" />
          <div>
            <h1 className="font-serif text-6xl leading-tight">{t("registerHeroTitle")}</h1>
            <p className="mt-5 max-w-lg text-white/80">{t("registerHeroText")}</p>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[Package, Sofa, Heart, Gift].map((Icon, index) => (
              <span key={index} className="grid size-14 place-items-center rounded-full bg-white/10 backdrop-blur">
                <Icon className="size-6" />
              </span>
            ))}
          </div>
        </div>
      </section>
      <section className="grid place-items-center p-4 sm:p-6">
        <AppCard className="w-full max-w-lg p-6 sm:p-7">
          <AppLogo className="justify-center dark:hidden" imageClassName="w-40 sm:w-44" />
          <AppLogo variant="light" className="hidden justify-center dark:inline-flex" imageClassName="w-40 sm:w-44" />
          <div className="mt-8 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-black text-white">
              <UserPlus className="size-5" />
            </div>
            <h2 className="mt-4 font-serif text-2xl font-bold sm:text-3xl">{t("registerTitle")}</h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{t("registerSubtitle")}</p>
          </div>
          <RegisterForm />
          <p className="mt-5 text-center text-sm text-neutral-600 dark:text-neutral-400">
            {t("haveAccount")} <Link href="/login" className="font-bold text-neutral-950 hover:underline dark:text-white">{t("signIn")}</Link>
          </p>
        </AppCard>
      </section>
    </main>
  );
}
