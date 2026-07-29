import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function AppStack({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-4", className)} {...props} />;
}
