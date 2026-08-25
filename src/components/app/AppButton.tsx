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
        "inline-flex items-center justify-center rounded-xl font-medium transition duration-200 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
        variant === "primary" &&
          "bg-neutral-950 text-white shadow-[var(--shadow-elevation-1)] hover:bg-neutral-800 hover:shadow-[var(--shadow-elevation-2)] active:shadow-[var(--shadow-press)] dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200",
        variant === "secondary" &&
          "bg-neutral-100 text-neutral-950 shadow-[var(--shadow-elevation-1)] hover:shadow-[var(--shadow-elevation-2)] active:shadow-[var(--shadow-press)] dark:bg-white/10 dark:text-neutral-50 dark:hover:bg-white/15",
        variant === "outline" &&
          "bg-white text-neutral-950 shadow-[var(--shadow-elevation-1)] hover:shadow-[var(--shadow-elevation-2)] active:shadow-[var(--shadow-press)] dark:border dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:hover:bg-white/10",
        variant === "ghost" && "text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-white/10",
        variant === "danger" &&
          "bg-red-600 text-white shadow-[var(--shadow-elevation-1)] hover:bg-red-700 hover:shadow-[var(--shadow-elevation-2)] active:shadow-[var(--shadow-press)]",
        size === "sm" && "min-h-9 px-3 py-2 text-sm",
        size === "md" && "min-h-11 px-5 py-3 text-sm",
        size === "lg" && "min-h-13 px-7 py-3.5 text-base",
        className
      )}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <span className="me-2 inline-block size-4 shrink-0 animate-spin rounded-full border-2 border-current border-e-transparent" aria-hidden />
      ) : null}
      {children}
    </button>
  )
);
AppButton.displayName = "AppButton";
