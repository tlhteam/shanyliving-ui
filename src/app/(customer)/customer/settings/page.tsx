"use client";

import { Monitor, Moon, ShieldCheck, Sun } from "lucide-react";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppSwitch } from "@/components/app/AppSwitch";
import { CustomerTopbar } from "@/components/customer/CustomerShell";
import { customer } from "@/lib/customer-panel";

export default function SettingsPage() {
  return (
    <>
      <CustomerTopbar title="Settings" subtitle="Manage your account settings and preferences." />
      <div className="mb-6 flex gap-8 text-sm font-bold">
        {["Account", "Security", "Notifications", "Privacy"].map((tab, index) => <span key={tab} className={index === 0 ? "border-b-2 border-black pb-2" : "pb-2 text-neutral-500"}>{tab}</span>)}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <AppCard className="p-5">
            <h2 className="font-serif text-2xl font-bold">Account Settings</h2>
            {[["Account Email", customer.email], ["Phone Number", customer.phone], ["Language", "English"], ["Currency", "USD ($)"], ["Time Zone", "(GMT+3) Jerusalem"]].map(([label, value], index) => (
              <div key={label} className="flex items-center justify-between border-b border-neutral-100 py-4 text-sm last:border-0">
                <span className="font-bold">{label}</span>
                <span className="text-neutral-600">{value}</span>
                {index < 2 ? <span className="rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-700">Verified</span> : <AppButton variant="outline" size="sm">Change</AppButton>}
              </div>
            ))}
          </AppCard>
          <AppCard className="p-5">
            <h2 className="font-serif text-2xl font-bold">Appearance</h2>
            <p className="mt-1 text-sm text-neutral-600">Choose how you want your Shany Living experience to look.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[["Light", Sun], ["Dark", Moon], ["System", Monitor]].map(([label, Icon]) => <button key={String(label)} className="rounded-lg border border-neutral-200 p-4 text-center transition hover:border-black"><Icon className="mx-auto size-6" /><span className="mt-2 block text-sm font-bold">{String(label)}</span></button>)}
            </div>
          </AppCard>
          <AppCard className="flex items-center justify-between gap-4 p-5">
            <div><h2 className="font-serif text-2xl font-bold text-red-600">Delete Account</h2><p className="text-sm text-neutral-600">Permanently delete your account and all of your data.</p></div>
            <AppButton variant="danger">Delete Account</AppButton>
          </AppCard>
        </div>
        <div className="space-y-5">
          <AppCard className="p-5">
            <h2 className="font-serif text-2xl font-bold">Change Password</h2>
            <div className="mt-4 space-y-3">{["Current Password", "New Password", "Confirm New Password"].map((field) => <input key={field} type="password" placeholder={field} className="h-11 w-full rounded-md border border-neutral-300 px-3 text-sm" />)}</div>
            <AppButton className="mt-4 w-full">Update Password</AppButton>
          </AppCard>
          <AppCard className="p-5">
            <div className="flex items-start gap-3"><ShieldCheck className="size-6" /><div><h2 className="font-serif text-2xl font-bold">Two-Factor Authentication</h2><p className="text-sm text-neutral-600">Add an extra layer of security to your account.</p></div></div>
            <div className="mt-5 flex items-center justify-between"><span className="font-bold">Status</span><span className="rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-700">Enabled</span></div>
            <AppButton variant="outline" className="mt-4 w-full">Manage 2FA</AppButton>
          </AppCard>
          <AppCard className="p-5">
            <h2 className="font-serif text-2xl font-bold">Notifications</h2>
            {["Email", "SMS", "Marketing", "WhatsApp"].map((item, index) => <div key={item} className="mt-4 flex items-center justify-between"><span className="font-bold">{item}</span><AppSwitch checked={index !== 2} /></div>)}
          </AppCard>
        </div>
      </div>
    </>
  );
}
