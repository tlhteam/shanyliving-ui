import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function AppSection({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={cn("mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16", className)} {...props} />;
}
