"use client";

import { useEffect, useId } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      render: (container: string | HTMLElement, parameters: { sitekey: string; callback: (token: string) => void; "expired-callback": () => void }) => number;
      reset: (widgetId?: number) => void;
    };
  }
}

type RecaptchaV2Props = {
  siteKey?: string;
  onChange: (token: string) => void;
};

export function RecaptchaV2({ siteKey, onChange }: RecaptchaV2Props) {
  const id = useId().replace(/:/g, "");

  useEffect(() => {
    if (!siteKey) {
      return;
    }

    const renderWidget = () => {
      const container = document.getElementById(id);

      if (!container || container.dataset.rendered || !window.grecaptcha) {
        return;
      }

      window.grecaptcha.render(container, {
        sitekey: siteKey,
        callback: onChange,
        "expired-callback": () => onChange("")
      });
      container.dataset.rendered = "true";
    };

    if (window.grecaptcha) {
      renderWidget();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>("script[data-recaptcha='v2']");

    if (existing) {
      existing.addEventListener("load", renderWidget, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.dataset.recaptcha = "v2";
    script.onload = renderWidget;
    document.head.appendChild(script);
  }, [id, onChange, siteKey]);

  if (!siteKey) {
    return null;
  }

  return <div id={id} className="min-h-[78px]" />;
}
