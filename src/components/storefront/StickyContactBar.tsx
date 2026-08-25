"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { AppButton } from "@/components/app/AppButton";
import { WhatsappIcon } from "@/components/icons/WhatsappIcon";

export function StickyContactBar({ whatsappHref }: { whatsappHref: string }) {
  const t = useTranslations("storefront.detail");

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur lg:hidden dark:border-white/10 dark:bg-neutral-950/95">
      <Link href={whatsappHref} target="_blank" className="block">
        <AppButton className="w-full gap-2">
          <WhatsappIcon className="size-4" />
          {t("whatsappForDetails")}
        </AppButton>
      </Link>
    </div>
  );
}
