import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function AppCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-lg border border-neutral-200 bg-white text-neutral-950 shadow-sm transition-colors dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50", className)} {...props} />;
}
