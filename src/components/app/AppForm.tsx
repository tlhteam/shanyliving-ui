"use client";

import { ReactNode } from "react";
import { FieldValues, FormProvider, SubmitHandler, UseFormReturn } from "react-hook-form";
import { AppButton } from "@/components/app/AppButton";
import { cn } from "@/lib/utils";

type AppFormProps<TValues extends FieldValues> = {
  form: UseFormReturn<TValues>;
  children: ReactNode | ((form: UseFormReturn<TValues>) => ReactNode);
  onSubmit: SubmitHandler<TValues>;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  className?: string;
};

export function AppForm<TValues extends FieldValues>({ form, children, onSubmit, submitLabel = "Save", cancelLabel = "Cancel", onCancel, className }: AppFormProps<TValues>) {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-5", className)} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">{typeof children === "function" ? children(form) : children}</div>
        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          {onCancel ? <AppButton type="button" variant="outline" onClick={onCancel}>{cancelLabel}</AppButton> : null}
          <AppButton type="submit" disabled={form.formState.isSubmitting}>{submitLabel}</AppButton>
        </div>
      </form>
    </FormProvider>
  );
}
