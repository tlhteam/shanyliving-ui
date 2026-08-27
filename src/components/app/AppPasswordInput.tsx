"use client";

import { InputHTMLAttributes, forwardRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";

export type AppPasswordInputProps = InputHTMLAttributes<HTMLInputElement>;

export const AppPasswordInput = forwardRef<HTMLInputElement, AppPasswordInputProps>(
  ({ className, style, ...props }, ref) => {
    const t = useTranslations("common");
    const [visible, setVisible] = useState(false);

    return (
      <div className="relative">
        <input
          ref={ref}
          {...props}
          type={visible ? "text" : "password"}
          style={{ paddingInlineEnd: "2.75rem", ...style }}
          className={className}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? t("hidePassword") : t("showPassword")}
          className="absolute inset-y-0 end-0 grid w-11 place-items-center text-neutral-500 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    );
  }
);
AppPasswordInput.displayName = "AppPasswordInput";
