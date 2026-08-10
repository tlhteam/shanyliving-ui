"use client";

import { Monitor, Moon, ShieldCheck, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppDialog } from "@/components/app/AppDialog";
import { AppSwitch } from "@/components/app/AppSwitch";
import { CustomerTopbar } from "@/components/customer/CustomerShell";
import { useCustomerMutation, useCustomerQuery } from "@/hooks/use-customer";
import type { CustomerProfile, CustomerSettings } from "@/types/customer";

type PasswordForm = {
  password: string;
  password_confirmation: string;
};

type FieldDialog = {
  key: "language";
  label: string;
  value: string;
} | null;

type SettingsTab = "Account" | "Security" | "Notifications" | "Privacy";

const tabs: SettingsTab[] = ["Account", "Security", "Notifications", "Privacy"];

const appearanceOptions = [
  ["light", "Light", Sun],
  ["dark", "Dark", Moon],
  ["system", "System", Monitor]
] as const;

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("Account");
  const [fieldDialog, setFieldDialog] = useState<FieldDialog>(null);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({ password: "", password_confirmation: "" });
  const { setTheme } = useTheme();

  const profileQuery = useCustomerQuery<CustomerProfile>("profile", "/customer/profile");
  const settingsQuery = useCustomerQuery<CustomerSettings>("settings", "/customer/settings");
  const profile = profileQuery.data;
  const settings = settingsQuery.data;
  const notifications = settings?.notifications ?? {};

  useEffect(() => {
    if (settings?.appearance) {
      setTheme(settings.appearance);
    }
  }, [setTheme, settings?.appearance]);

  const updateSettings = useCustomerMutation<Partial<CustomerSettings>, CustomerSettings>(
    "settings",
    (values) => ({ path: "/customer/settings", options: { method: "PATCH", body: values } }),
    {
      successMessage: "Settings updated.",
      onSuccess: () => setFieldDialog(null)
    }
  );

  const updatePassword = useCustomerMutation<PasswordForm, CustomerProfile>(
    "profile",
    (values) => ({ path: "/customer/profile", options: { method: "PATCH", body: values } }),
    {
      successMessage: "Password updated.",
      onSuccess: () => setPasswordForm({ password: "", password_confirmation: "" })
    }
  );

  const updateAppearance = (appearance: CustomerSettings["appearance"]) => {
    setTheme(appearance);
    updateSettings.mutate({ appearance });
  };

  return (
    <>
      <CustomerTopbar title="Settings" subtitle="Manage your account settings and preferences." />
      <div className="mb-6 flex flex-wrap gap-8 text-sm font-bold">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? "border-b-2 border-black pb-2 text-black dark:border-white dark:text-white" : "pb-2 text-neutral-500 transition hover:text-neutral-950 dark:hover:text-white"}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Account" ? (
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            <AppCard className="p-5">
              <h2 className="font-serif text-2xl font-bold">Account Settings</h2>
              {[
                ["Account Email", profile?.email ?? ""],
                ["Phone Number", profile?.phone ?? ""],
                ["Language", settings?.language ?? "he"]
              ].map(([label, value], index) => (
                <div key={label} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-neutral-100 py-4 text-sm last:border-0 dark:border-white/10">
                  <span className="font-bold">{label}</span>
                  <span className="text-neutral-600 dark:text-neutral-300">{value || "Not set"}</span>
                  {index < 2 ? (
                    <span className="rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-700 dark:bg-emerald-600 dark:text-white">Verified</span>
                  ) : (
                    <AppButton variant="outline" size="sm" onClick={() => setFieldDialog({ key: "language", label, value })}>Change</AppButton>
                  )}
                </div>
              ))}
            </AppCard>
            <AppCard className="p-5">
              <h2 className="font-serif text-2xl font-bold">Appearance</h2>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Choose how you want your Shany Living experience to look.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {appearanceOptions.map(([value, label, Icon]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => updateAppearance(value)}
                    className={`rounded-lg border p-4 text-center transition hover:border-black dark:hover:border-white ${settings?.appearance === value ? "border-black dark:border-white" : "border-neutral-200 dark:border-white/15"}`}
                  >
                    <Icon className="mx-auto size-6" />
                    <span className="mt-2 block text-sm font-bold">{label}</span>
                  </button>
                ))}
              </div>
            </AppCard>
          </div>
          <AppCard className="h-fit p-5">
            <h2 className="font-serif text-2xl font-bold">Current Preferences</h2>
            <div className="mt-4 space-y-3 text-sm">
              <p className="flex justify-between"><span className="font-bold">Theme</span><span className="text-neutral-600 dark:text-neutral-300">{settings?.appearance ?? "system"}</span></p>
              <p className="flex justify-between"><span className="font-bold">Language</span><span className="text-neutral-600 dark:text-neutral-300">{settings?.language ?? "he"}</span></p>
              <p className="flex justify-between"><span className="font-bold">Tour</span><span className="text-neutral-600 dark:text-neutral-300">{settings?.tour_completed ? "Completed" : "Pending"}</span></p>
            </div>
          </AppCard>
        </div>
      ) : null}

      {activeTab === "Security" ? (
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <AppCard className="p-5">
            <h2 className="font-serif text-2xl font-bold">Change Password</h2>
            <div className="mt-4 space-y-3">
              <input type="password" value={passwordForm.password} onChange={(event) => setPasswordForm((current) => ({ ...current, password: event.target.value }))} placeholder="New Password" className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:focus:border-white" />
              <input type="password" value={passwordForm.password_confirmation} onChange={(event) => setPasswordForm((current) => ({ ...current, password_confirmation: event.target.value }))} placeholder="Confirm New Password" className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:focus:border-white" />
            </div>
            <AppButton className="mt-4 w-full" loading={updatePassword.isPending} disabled={passwordForm.password.length < 8 || passwordForm.password !== passwordForm.password_confirmation} onClick={() => updatePassword.mutate(passwordForm)}>
              Update Password
            </AppButton>
          </AppCard>
          <AppCard className="p-5">
            <div className="flex items-start gap-3"><ShieldCheck className="size-6" /><div><h2 className="font-serif text-2xl font-bold">Two-Factor Authentication</h2><p className="text-sm text-neutral-600 dark:text-neutral-400">Add an extra layer of security to your account.</p></div></div>
            <div className="mt-5 flex items-center justify-between"><span className="font-bold">Status</span><span className="rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-700 dark:bg-emerald-600 dark:text-white">{settings?.two_factor_enabled ? "Enabled" : "Disabled"}</span></div>
            <AppButton variant="outline" className="mt-4 w-full" onClick={() => updateSettings.mutate({ two_factor_enabled: !settings?.two_factor_enabled })}>Manage 2FA</AppButton>
          </AppCard>
        </div>
      ) : null}

      {activeTab === "Notifications" ? (
        <AppCard className="max-w-xl p-5">
          <h2 className="font-serif text-2xl font-bold">Notifications</h2>
          {[
            ["email", "Email"],
            ["sms", "SMS"],
            ["marketing", "Marketing"],
            ["whatsapp", "WhatsApp"]
          ].map(([key, label]) => (
            <div key={key} className="mt-4 flex items-center justify-between">
              <span className="font-bold">{label}</span>
              <AppSwitch checked={Boolean(notifications[key as keyof typeof notifications])} onClick={() => updateSettings.mutate({ notifications: { ...notifications, [key]: !notifications[key as keyof typeof notifications] } })} />
            </div>
          ))}
        </AppCard>
      ) : null}

      {activeTab === "Privacy" ? (
        <AppCard className="max-w-3xl space-y-5 p-5">
          <div>
            <h2 className="font-serif text-2xl font-bold">Privacy</h2>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Control privacy and data-related account actions.</p>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-lg border border-neutral-200 p-4 dark:border-white/10">
            <div><p className="font-bold">First-login tour</p><p className="text-sm text-neutral-600 dark:text-neutral-400">Show the customer panel guide again on next visit.</p></div>
            <AppButton variant="outline" onClick={() => updateSettings.mutate({ tour_completed: false })}>Reset Tour</AppButton>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-lg border border-red-100 p-4 dark:border-red-400/20">
            <div><h2 className="font-serif text-2xl font-bold text-red-600">Delete Account</h2><p className="text-sm text-neutral-600 dark:text-neutral-400">Account deletion requires support approval.</p></div>
            <AppButton variant="danger" disabled>Delete Account</AppButton>
          </div>
        </AppCard>
      ) : null}

      <AppDialog
        open={Boolean(fieldDialog)}
        onOpenChange={(next) => !next && setFieldDialog(null)}
        title={`Change ${fieldDialog?.label ?? "Setting"}`}
        footer={
          <>
            <AppButton variant="outline" onClick={() => setFieldDialog(null)}>Cancel</AppButton>
            <AppButton loading={updateSettings.isPending} onClick={() => fieldDialog && updateSettings.mutate({ [fieldDialog.key]: fieldDialog.value })}>Save</AppButton>
          </>
        }
      >
        <input
          value={fieldDialog?.value ?? ""}
          onChange={(event) => fieldDialog && setFieldDialog({ ...fieldDialog, value: event.target.value })}
          className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:focus:border-white"
        />
      </AppDialog>
    </>
  );
}
