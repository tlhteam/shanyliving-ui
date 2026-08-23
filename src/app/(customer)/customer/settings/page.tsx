"use client";

import { Monitor, Moon, ShieldCheck, Sun } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppDialog } from "@/components/app/AppDialog";
import { AppSwitch } from "@/components/app/AppSwitch";
import { CustomerTopbar } from "@/components/customer/CustomerShell";
import { useCustomerMutation, useCustomerQuery } from "@/hooks/use-customer";
import { useCustomerCommerceStore } from "@/stores/customer-commerce-store";
import { setUserLocale } from "@/i18n/actions";
import { AppLocale, isAppLocale, localeOption, localeOptions } from "@/i18n/config";
import type { CustomerProfile, CustomerSettings } from "@/types/customer";

type PasswordForm = {
  password: string;
  password_confirmation: string;
};

type SettingsTab = "account" | "security" | "notifications" | "privacy";

const tabs: SettingsTab[] = ["account", "security", "notifications", "privacy"];

const appearanceOptions = [
  ["light", Sun],
  ["dark", Moon],
  ["system", Monitor]
] as const;

const channels = ["email", "sms", "marketing", "whatsapp"] as const;

export default function SettingsPage() {
  const t = useTranslations("customer.settings");
  const locale = useLocale();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");
  const [languageOpen, setLanguageOpen] = useState(false);
  const [draftLocale, setDraftLocale] = useState<AppLocale>(isAppLocale(locale) ? locale : "he");
  const [switching, startSwitching] = useTransition();
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({ password: "", password_confirmation: "" });
  const commerceTheme = useCustomerCommerceStore((state) => state.theme);
  const setCommerceTheme = useCustomerCommerceStore((state) => state.setTheme);

  const profileQuery = useCustomerQuery<CustomerProfile>("profile", "/customer/profile");
  const settingsQuery = useCustomerQuery<CustomerSettings>("settings", "/customer/settings");
  const profile = profileQuery.data;
  const settings = settingsQuery.data;
  const notifications = settings?.notifications ?? {};

  useEffect(() => {
    if (settings?.appearance) {
      setCommerceTheme(settings.appearance);
    }
  }, [setCommerceTheme, settings?.appearance]);

  const updateSettings = useCustomerMutation<Partial<CustomerSettings>, CustomerSettings>(
    "settings",
    (values) => ({ path: "/customer/settings", options: { method: "PATCH", body: values } }),
    { successMessage: t("updated") }
  );

  const updatePassword = useCustomerMutation<PasswordForm, CustomerProfile>(
    "profile",
    (values) => ({ path: "/customer/profile", options: { method: "PATCH", body: values } }),
    {
      successMessage: t("passwordUpdated"),
      onSuccess: () => setPasswordForm({ password: "", password_confirmation: "" })
    }
  );

  const updateAppearance = (appearance: CustomerSettings["appearance"]) => {
    setCommerceTheme(appearance);
    updateSettings.mutate({ appearance });
  };

  const applyLanguage = () => {
    updateSettings.mutate({ language: draftLocale });

    startSwitching(() => {
      void setUserLocale(draftLocale).then(() => {
        setLanguageOpen(false);
        router.refresh();
      });
    });
  };

  const accountRows = [
    { key: "accountEmail", value: profile?.email ?? "", verified: true },
    { key: "phone", value: profile?.phone ?? "", verified: true },
    { key: "language", value: localeOption(locale).label, verified: false }
  ];

  return (
    <>
      <CustomerTopbar title={t("title")} subtitle={t("subtitle")} />
      <div className="mb-6 flex flex-wrap gap-8 text-sm font-bold">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={
              activeTab === tab
                ? "border-b-2 border-neutral-950 pb-2 text-neutral-950 dark:border-white dark:text-white"
                : "pb-2 text-neutral-500 transition hover:text-neutral-950 dark:hover:text-white"
            }
          >
            {t(`tabs.${tab}`)}
          </button>
        ))}
      </div>

      {activeTab === "account" ? (
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            <AppCard className="p-5">
              <h2 className="font-serif text-2xl font-bold">{t("accountTitle")}</h2>
              {accountRows.map((row) => (
                <div key={row.key} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-neutral-100 py-4 text-sm last:border-0 dark:border-white/10">
                  <span className="font-bold">{t(row.key)}</span>
                  <span className="min-w-0 truncate text-neutral-600 dark:text-neutral-300">
                    <bdi>{row.value || t("notSet")}</bdi>
                  </span>
                  {row.verified ? (
                    <span className="rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-700 dark:bg-emerald-600 dark:text-white">{t("verified")}</span>
                  ) : (
                    <AppButton
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDraftLocale(isAppLocale(locale) ? locale : "he");
                        setLanguageOpen(true);
                      }}
                    >
                      {t("change")}
                    </AppButton>
                  )}
                </div>
              ))}
            </AppCard>
            <AppCard className="p-5">
              <h2 className="font-serif text-2xl font-bold">{t("appearance")}</h2>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{t("appearanceText")}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {appearanceOptions.map(([value, Icon]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => updateAppearance(value)}
                    className={
                      commerceTheme === value
                        ? "rounded-lg border border-neutral-950 bg-neutral-950 p-4 text-center text-white transition dark:border-white dark:bg-white dark:text-neutral-950"
                        : "rounded-lg border border-neutral-200 p-4 text-center transition hover:border-neutral-950 dark:border-white/15 dark:hover:border-white"
                    }
                  >
                    <Icon className="mx-auto size-6" />
                    <span className="mt-2 block text-sm font-bold">{t(`themes.${value}`)}</span>
                  </button>
                ))}
              </div>
            </AppCard>
          </div>
          <AppCard className="h-fit p-5">
            <h2 className="font-serif text-2xl font-bold">{t("current")}</h2>
            <div className="mt-4 space-y-3 text-sm">
              <p className="flex justify-between gap-3">
                <span className="font-bold">{t("theme")}</span>
                <span className="text-neutral-600 dark:text-neutral-300">{t(`themes.${commerceTheme}`)}</span>
              </p>
              <p className="flex justify-between gap-3">
                <span className="font-bold">{t("language")}</span>
                <span className="text-neutral-600 dark:text-neutral-300">{localeOption(locale).label}</span>
              </p>
              <p className="flex justify-between gap-3">
                <span className="font-bold">{t("tour")}</span>
                <span className="text-neutral-600 dark:text-neutral-300">{settings?.tour_completed ? t("completed") : t("pending")}</span>
              </p>
            </div>
          </AppCard>
        </div>
      ) : null}

      {activeTab === "security" ? (
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <AppCard className="p-5">
            <h2 className="font-serif text-2xl font-bold">{t("changePassword")}</h2>
            <div className="mt-4 space-y-3">
              <input
                type="password"
                value={passwordForm.password}
                onChange={(event) => setPasswordForm((current) => ({ ...current, password: event.target.value }))}
                placeholder={t("newPassword")}
                className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:focus:border-white"
              />
              <input
                type="password"
                value={passwordForm.password_confirmation}
                onChange={(event) => setPasswordForm((current) => ({ ...current, password_confirmation: event.target.value }))}
                placeholder={t("confirmPassword")}
                className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:focus:border-white"
              />
            </div>
            <AppButton
              className="mt-4 w-full"
              loading={updatePassword.isPending}
              disabled={passwordForm.password.length < 8 || passwordForm.password !== passwordForm.password_confirmation}
              onClick={() => updatePassword.mutate(passwordForm)}
            >
              {t("updatePassword")}
            </AppButton>
          </AppCard>
          <AppCard className="p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="size-6 shrink-0" />
              <div>
                <h2 className="font-serif text-2xl font-bold">{t("twoFactor")}</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{t("twoFactorText")}</p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between gap-3">
              <span className="font-bold">{t("status")}</span>
              <span className="rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-700 dark:bg-emerald-600 dark:text-white">
                {settings?.two_factor_enabled ? t("enabled") : t("disabled")}
              </span>
            </div>
            <AppButton variant="outline" className="mt-4 w-full" onClick={() => updateSettings.mutate({ two_factor_enabled: !settings?.two_factor_enabled })}>
              {t("manage2fa")}
            </AppButton>
          </AppCard>
        </div>
      ) : null}

      {activeTab === "notifications" ? (
        <AppCard className="max-w-xl p-5">
          <h2 className="font-serif text-2xl font-bold">{t("notificationsTitle")}</h2>
          {channels.map((key) => (
            <div key={key} className="mt-4 flex items-center justify-between gap-4">
              <span className="font-bold">{t(`channels.${key}`)}</span>
              <AppSwitch
                checked={Boolean(notifications[key as keyof typeof notifications])}
                onClick={() => updateSettings.mutate({ notifications: { ...notifications, [key]: !notifications[key as keyof typeof notifications] } })}
              />
            </div>
          ))}
        </AppCard>
      ) : null}

      {activeTab === "privacy" ? (
        <AppCard className="max-w-3xl space-y-5 p-5">
          <div>
            <h2 className="font-serif text-2xl font-bold">{t("privacyTitle")}</h2>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{t("privacyText")}</p>
          </div>
          <div className="flex flex-col items-start justify-between gap-4 rounded-lg border border-neutral-200 p-4 sm:flex-row sm:items-center dark:border-white/10">
            <div>
              <p className="font-bold">{t("tourTitle")}</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{t("tourText")}</p>
            </div>
            <AppButton variant="outline" className="w-full sm:w-auto" onClick={() => updateSettings.mutate({ tour_completed: false })}>
              {t("resetTour")}
            </AppButton>
          </div>
          <div className="flex flex-col items-start justify-between gap-4 rounded-lg border border-red-100 p-4 sm:flex-row sm:items-center dark:border-red-400/20">
            <div>
              <h2 className="font-serif text-2xl font-bold text-red-600">{t("deleteTitle")}</h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{t("deleteText")}</p>
            </div>
            <AppButton variant="danger" className="w-full sm:w-auto" disabled>
              {t("deleteCta")}
            </AppButton>
          </div>
        </AppCard>
      ) : null}

      <AppDialog
        open={languageOpen}
        onOpenChange={(next) => !next && setLanguageOpen(false)}
        title={t("languageDialog")}
        footer={
          <>
            <AppButton variant="outline" onClick={() => setLanguageOpen(false)}>{t("cancel")}</AppButton>
            <AppButton loading={switching || updateSettings.isPending} onClick={applyLanguage}>{t("save")}</AppButton>
          </>
        }
      >
        <div className="grid gap-2">
          {localeOptions.map((option) => (
            <button
              key={option.locale}
              type="button"
              onClick={() => setDraftLocale(option.locale)}
              className={
                draftLocale === option.locale
                  ? "flex items-center justify-between rounded-md border border-neutral-950 bg-neutral-950 px-3 py-2.5 text-sm font-bold text-white dark:border-white dark:bg-white dark:text-neutral-950"
                  : "flex items-center justify-between rounded-md border border-neutral-200 px-3 py-2.5 text-sm transition hover:border-neutral-950 dark:border-white/15 dark:hover:border-white"
              }
            >
              {option.label}
              <span className="text-xs opacity-70">{option.short}</span>
            </button>
          ))}
        </div>
      </AppDialog>
    </>
  );
}
