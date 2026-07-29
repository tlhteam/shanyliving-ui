import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export type AppButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

export const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition duration-200 disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "bg-neutral-950 text-white hover:bg-neutral-800",
        variant === "secondary" && "bg-[#e7ddcf] text-neutral-950 hover:bg-[#d8c9b5]",
        variant === "outline" && "border border-neutral-300 bg-white text-neutral-950 hover:bg-neutral-100",
        variant === "ghost" && "text-neutral-800 hover:bg-neutral-100",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-11 px-5 text-sm",
        size === "lg" && "h-13 px-7 text-base",
        className
      )}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  )
);
AppButton.displayName = "AppButton";
