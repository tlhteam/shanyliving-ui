"use client";

import { InputHTMLAttributes } from "react";
import { FieldValues, Path, RegisterOptions, useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type AppTextFieldProps<TValues extends FieldValues = FieldValues> = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  multiline?: boolean;
  name: Path<TValues>;
  rules?: RegisterOptions<TValues, Path<TValues>>;
};

export function AppTextField<TValues extends FieldValues = FieldValues>({ label, error, multiline, className, id, name, rules, ...props }: AppTextFieldProps<TValues>) {
  const form = useFormContext<TValues>();
  const fieldId = id ?? String(name ?? label).toLowerCase().replace(/\s+/g, "-");
  const fieldError = error ?? String(form?.formState.errors[name]?.message ?? "");
  const registered = form ? form.register(name, rules) : { name };

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId} className="text-neutral-800 dark:text-neutral-200">{label}</Label>
      {multiline ? (
        <Textarea id={fieldId} className={cn("min-h-24 bg-white dark:bg-neutral-950", className)} {...registered} {...(props as React.ComponentProps<"textarea">)} />
      ) : (
        <input id={fieldId} className={cn("h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/10 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:placeholder:text-neutral-500 dark:focus:border-white dark:focus:ring-white/10", className)} {...registered} {...props} />
      )}
      {fieldError ? <p className="text-sm text-red-600 dark:text-red-300">{fieldError}</p> : null}
    </div>
  );
}
