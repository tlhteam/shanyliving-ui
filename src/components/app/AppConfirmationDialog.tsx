"use client";

import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { AppButton } from "@/components/app/AppButton";
import { AppDialog } from "@/components/app/AppDialog";

type AppConfirmationDialogProps = {
  open: boolean;
  title?: string;
  itemName?: string;
  confirmValue?: string;
  typedValue: string;
  onTypedValueChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

export function AppConfirmationDialog({ open, title, itemName, confirmValue = "DELETE", typedValue, onTypedValueChange, onCancel, onConfirm }: AppConfirmationDialogProps) {
  const t = useTranslations("common.confirm");
  const canDelete = typedValue.trim() === confirmValue;
  const item = itemName ?? t("thisRecord");

  return (
    <AppDialog
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && onCancel()}
      title={title ?? t("title")}
      description={t("hint", { value: confirmValue, item })}
      className="sm:max-w-md"
      footer={
        <>
          <AppButton type="button" variant="outline" onClick={onCancel}>{t("cancel")}</AppButton>
          <AppButton type="button" variant="danger" disabled={!canDelete} onClick={onConfirm}>{t("delete")}</AppButton>
        </>
      }
    >
      <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-950 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100">
        <div className="flex items-center gap-2 font-semibold">
          <AlertTriangle className="size-4" />
          {t("warning")}
        </div>
        <p className="mt-2 text-sm">{t("body", { item })}</p>
      </div>
      <input
        value={typedValue}
        onChange={(event) => onTypedValueChange(event.target.value)}
        placeholder={confirmValue}
        className="mt-4 h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-950 outline-none transition focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/10 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-white dark:focus:ring-white/10"
      />
    </AppDialog>
  )
}
