"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type AppSwitchProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  checked?: boolean;
};

export function AppSwitch({ checked, className, ...props }: AppSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={cn("relative h-6 w-11 rounded-full transition", checked ? "bg-black" : "bg-neutral-300", className)}
      {...props}
    >
      <span className={cn("absolute top-1 size-4 rounded-full bg-white transition", checked ? "start-6" : "start-1")} />
    </button>
  );
}
