"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { AppButton } from "@/components/app/AppButton";
import { AppPasswordInput } from "@/components/app/AppPasswordInput";
import { RecaptchaV2 } from "@/components/auth/RecaptchaV2";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { apiUrl } from "@/lib/api";

type FormValues = {
  name: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation: string;
  recaptcha_token?: string;
};

const fieldClass =
  "h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-black dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:placeholder:text-neutral-500 dark:focus:border-white";

const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export function RegisterForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(
      z
        .object({
          name: z.string().min(2, t("errors.nameRequired")),
          email: z.string().min(1, t("errors.emailRequired")).email(t("errors.emailInvalid")),
          phone: z.string().optional(),
          password: z.string().min(8, t("errors.passwordShort")),
          password_confirmation: z.string().min(1, t("errors.confirmRequired")),
          recaptcha_token: z.string().optional()
        })
        .refine((values) => values.password === values.password_confirmation, {
          message: t("errors.mismatch"),
          path: ["password_confirmation"]
        })
    ),
    defaultValues: { name: "", email: "", phone: "", password: "", password_confirmation: "", recaptcha_token: "" }
  });
  const setRecaptchaToken = useCallback((token: string) => form.setValue("recaptcha_token", token, { shouldValidate: true }), [form]);

  const onSubmit = async (values: FormValues) => {
    if (!apiUrl) {
      form.setError("root", { type: "manual", message: t("errors.serviceDown") });
      return;
    }

    const response = await fetch(`${apiUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const message = body?.errors?.email?.[0] ?? body?.message ?? t("errors.createFailed");
      form.setError("root", { type: "manual", message });
      return;
    }

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      role: "customer",
      redirect: false
    });

    if (!result || result.error) {
      router.push("/login");
      return;
    }

    router.push("/customer");
    router.refresh();
  };

  return (
    <div className="mt-6 space-y-4">
      <SocialAuthButtons callbackUrl="/customer" />
      <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wide text-neutral-400">
        <span className="h-px flex-1 bg-neutral-200" />
        {t("or")}
        <span className="h-px flex-1 bg-neutral-200" />
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label htmlFor="register-name" className="mb-2 block text-sm font-semibold text-neutral-800 dark:text-neutral-200">{t("name")}</label>
        <input id="register-name" autoComplete="name" placeholder={t("namePlaceholder")} {...form.register("name")} className={fieldClass} />
        {form.formState.errors.name?.message ? <p className="mt-1.5 text-sm text-red-600">{form.formState.errors.name.message}</p> : null}
      </div>
      <div>
        <label htmlFor="register-email" className="mb-2 block text-sm font-semibold text-neutral-800 dark:text-neutral-200">{t("email")}</label>
        <input id="register-email" type="email" autoComplete="email" placeholder={t("emailPlaceholder")} {...form.register("email")} className={fieldClass} />
        {form.formState.errors.email?.message ? <p className="mt-1.5 text-sm text-red-600">{form.formState.errors.email.message}</p> : null}
      </div>
      <div>
        <label htmlFor="register-phone" className="mb-2 block text-sm font-semibold text-neutral-800 dark:text-neutral-200">{t("phone")}</label>
        <input id="register-phone" type="tel" autoComplete="tel" placeholder={t("phonePlaceholder")} {...form.register("phone")} className={fieldClass} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="register-password" className="mb-2 block text-sm font-semibold text-neutral-800 dark:text-neutral-200">{t("password")}</label>
          <AppPasswordInput id="register-password" autoComplete="new-password" placeholder={t("newPasswordPlaceholder")} {...form.register("password")} className={fieldClass} />
          {form.formState.errors.password?.message ? (
            <p className="mt-1.5 text-sm text-red-600">{form.formState.errors.password.message}</p>
          ) : (
            <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">{t("newPasswordPlaceholder")}</p>
          )}
        </div>
        <div>
          <label htmlFor="register-password-confirm" className="mb-2 block text-sm font-semibold text-neutral-800 dark:text-neutral-200">{t("confirmPassword")}</label>
          <AppPasswordInput id="register-password-confirm" autoComplete="new-password" placeholder={t("confirmPasswordPlaceholder")} {...form.register("password_confirmation")} className={fieldClass} />
          {form.formState.errors.password_confirmation?.message ? <p className="mt-1.5 text-sm text-red-600">{form.formState.errors.password_confirmation.message}</p> : null}
        </div>
      </div>
      <RecaptchaV2 siteKey={recaptchaSiteKey} onChange={setRecaptchaToken} />
      {form.formState.errors.root?.message ? (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">{form.formState.errors.root.message}</p>
      ) : null}
      <AppButton type="submit" className="w-full" loading={form.formState.isSubmitting} disabled={form.formState.isSubmitting}>{t("createAccount")}</AppButton>
      </form>
    </div>
  );
}
