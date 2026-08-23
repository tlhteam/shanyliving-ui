"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { AppButton } from "@/components/app/AppButton";
import { SiteIcon } from "@/components/icons/SiteIcon";

type SignInGateProps = {
  namespace: "cart" | "checkout";
  callbackUrl: string;
};

export function SignInGate({ namespace, callbackUrl }: SignInGateProps) {
  const t = useTranslations(namespace);

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5 text-neutral-950 shadow-sm sm:p-6 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50">
      <span className="grid size-10 place-items-center rounded-full bg-neutral-100 dark:bg-white/10">
        <SiteIcon name="lock" className="size-5" />
      </span>
      <h2 className="mt-4 font-serif text-xl font-bold sm:text-2xl">{t("signInTitle")}</h2>
      <p className="mt-2 text-sm leading-6 text-neutral-700 dark:text-neutral-300">{t("signInText")}</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <AppButton type="button" className="w-full gap-2 sm:w-auto" onClick={() => signIn("google", { callbackUrl })}>
          <Image src="/images/google.png" alt="" width={20} height={20} className="size-5 rounded-full bg-white object-contain p-0.5" />
          {t("google")}
        </AppButton>
        <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="w-full sm:w-auto">
          <AppButton type="button" variant="outline" className="w-full sm:w-auto">
            {namespace === "cart" ? t("emailSignIn") : t("signInTitle")}
          </AppButton>
        </Link>
      </div>
    </div>
  );
}
