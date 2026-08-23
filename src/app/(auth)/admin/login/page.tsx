import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { authOptions } from "@/auth";
import { AppCard } from "@/components/app/AppCard";
import { AppLogo } from "@/components/layout/AppLogo";
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";

export const metadata: Metadata = {
  title: "Staff sign in",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } }
};

type PageProps = { searchParams: Promise<{ callbackUrl?: string }> };

export default async function LoginPage({ searchParams }: PageProps) {
  const { callbackUrl } = await searchParams;
  const t = await getTranslations("auth");
  const session = await getServerSession(authOptions);

  if (session?.user?.role === "admin") {
    redirect(callbackUrl?.startsWith("/") ? callbackUrl : "/admin");
  }

  if (session?.user) {
    redirect("/customer");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#eee8df] p-4 text-neutral-950 transition-colors dark:bg-neutral-950 dark:text-neutral-50">
      <AppCard className="w-full max-w-md overflow-hidden p-0 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50">
        <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-6 dark:border-white/10 dark:bg-neutral-950 sm:px-7">
          <AppLogo className="justify-center dark:hidden" imageClassName="w-40 sm:w-44" />
          <AppLogo variant="light" className="hidden justify-center dark:inline-flex" imageClassName="w-40 sm:w-44" />
        </div>
        <div className="p-6 sm:p-7">
          <div className="text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
              <ShieldCheck className="size-5" />
            </div>
            <h1 className="mt-4 text-2xl font-semibold">{t("adminTitle")}</h1>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{t("adminSubtitle")}</p>
          </div>
          <AdminLoginForm callbackUrl={callbackUrl} />
        </div>
      </AppCard>
    </main>
  );
}
