"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { AppButton } from "@/components/app/AppButton";

export function SocialAuthButtons({ callbackUrl = "/customer" }: { callbackUrl?: string }) {
  const t = useTranslations("auth");
  const safeCallback = callbackUrl.startsWith("/") ? callbackUrl : "/customer";

  return (
    <div className="space-y-3">
      <AppButton type="button" variant="outline" className="w-full gap-3" onClick={() => signIn("google", { callbackUrl: safeCallback })}>
        <Image src="/images/google.png" alt="" width={22} height={22} className="size-5 object-contain" />
        {t("google")}
      </AppButton>
      <AppButton type="button" variant="outline" className="w-full gap-3 opacity-75" onClick={() => toast.info(t("appleSoon"))}>
        <Image src="/images/apple.png" alt="" width={22} height={22} className="size-5 object-contain dark:invert" />
        {t("apple")}
      </AppButton>
    </div>
  );
}
