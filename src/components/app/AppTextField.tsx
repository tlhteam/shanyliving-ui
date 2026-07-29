"use client";

import { InputHTMLAttributes } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type AppTextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  multiline?: boolean;
};

export function AppTextField({ label, error, multiline, className, id, ...props }: AppTextFieldProps) {
  const fieldId = id ?? String(props.name ?? label).toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId} className="text-neutral-800 dark:text-neutral-200">{label}</Label>
      {multiline ? (
        <Textarea id={fieldId} className={cn("min-h-24 bg-white dark:bg-neutral-950", className)} {...(props as React.ComponentProps<"textarea">)} />
      ) : (
        <input id={fieldId} className={cn("h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/10 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:placeholder:text-neutral-500 dark:focus:border-white dark:focus:ring-white/10", className)} {...props} />
      )}
      {error ? <p className="text-sm text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
