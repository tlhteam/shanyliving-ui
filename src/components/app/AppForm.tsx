"use client";

import { FormEvent, ReactNode } from "react";
import { AppButton } from "@/components/app/AppButton";
import { cn } from "@/lib/utils";

type AppFormProps = {
  children: ReactNode;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  className?: string;
};

export function AppForm({ children, onSubmit, submitLabel = "Save", cancelLabel = "Cancel", onCancel, className }: AppFormProps) {
  return (
    <form onSubmit={onSubmit} className={cn("space-y-4", className)} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        {onCancel ? <AppButton type="button" variant="outline" onClick={onCancel}>{cancelLabel}</AppButton> : null}
        <AppButton type="submit">{submitLabel}</AppButton>
      </div>
    </form>
  );
}
