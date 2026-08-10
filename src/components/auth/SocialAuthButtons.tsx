"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { AppButton } from "@/components/app/AppButton";

export function SocialAuthButtons({ callbackUrl = "/customer" }: { callbackUrl?: string }) {
  const safeCallback = callbackUrl.startsWith("/") ? callbackUrl : "/customer";

  return (
    <div className="space-y-3">
      <AppButton type="button" variant="outline" className="w-full gap-3" onClick={() => signIn("google", { callbackUrl: safeCallback })}>
        <Image src="/images/google.png" alt="" width={22} height={22} className="size-5 object-contain" />
        Continue with Google
      </AppButton>
      <AppButton type="button" variant="outline" className="w-full gap-3 opacity-75" onClick={() => toast.info("Apple sign in is coming soon.")}>
        <Image src="/images/apple.png" alt="" width={22} height={22} className="size-5 object-contain dark:invert" />
        Continue with Apple
      </AppButton>
    </div>
  );
}
