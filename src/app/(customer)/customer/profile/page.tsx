"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AppCard } from "@/components/app/AppCard";
import { AppForm } from "@/components/app/AppForm";
import { AppSwitch } from "@/components/app/AppSwitch";
import { AppTextField } from "@/components/app/AppTextField";
import { CustomerTopbar } from "@/components/customer/CustomerShell";
import { useCustomerMutation, useCustomerQuery } from "@/hooks/use-customer";
import type { CustomerAddress, CustomerProfile, CustomerSettings } from "@/types/customer";

type ProfileForm = {
  name: string;
  email: string;
  phone: string;
  avatar: string;
};

export default function ProfilePage() {
  const form = useForm<ProfileForm>({
    defaultValues: { name: "", email: "", phone: "", avatar: "" }
  });

  const profileQuery = useCustomerQuery<CustomerProfile>("profile", "/customer/profile");
  const addressesQuery = useCustomerQuery<CustomerAddress[]>("addresses", "/customer/addresses");
  const settingsQuery = useCustomerQuery<CustomerSettings>("settings", "/customer/settings");

  useEffect(() => {
    if (profileQuery.data) {
      form.reset({
        name: profileQuery.data.name ?? "",
        email: profileQuery.data.email ?? "",
        phone: profileQuery.data.phone ?? "",
        avatar: profileQuery.data.avatar ?? ""
      });
    }
  }, [form, profileQuery.data]);

  const updateProfile = useCustomerMutation<ProfileForm, CustomerProfile>(
    "profile",
    (values) => ({ path: "/customer/profile", options: { method: "PATCH", body: values } }),
    { successMessage: "Profile updated." }
  );

  const updateSettings = useCustomerMutation<CustomerSettings["notifications"], CustomerSettings>(
    "settings",
    (notifications) => ({ path: "/customer/settings", options: { method: "PATCH", body: { notifications } } }),
    { successMessage: "Preferences updated." }
  );

  const notifications = settingsQuery.data?.notifications ?? {};
  const addresses = addressesQuery.data ?? [];

  return (
    <>
      <CustomerTopbar title="My Profile" subtitle="Manage your personal information and account details." />
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <AppCard className="p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold">Personal Information</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-[140px_1fr]">
            <div className="text-center">
              <div className="mx-auto grid size-28 place-items-center rounded-full bg-neutral-200 text-3xl font-bold">
                {(profileQuery.data?.name ?? "U").slice(0, 1).toUpperCase()}
              </div>
              <p className="mt-2 text-xs text-neutral-500">Add an avatar URL to update your photo.</p>
            </div>
            <AppForm form={form} onSubmit={(values) => updateProfile.mutate(values)} submitLabel={updateProfile.isPending ? "Saving..." : "Save Profile"}>
              <AppTextField<ProfileForm> name="name" label="Full Name" />
              <AppTextField<ProfileForm> name="email" label="Email Address" />
              <AppTextField<ProfileForm> name="phone" label="Phone Number" />
              <AppTextField<ProfileForm> name="avatar" label="Avatar URL" />
            </AppForm>
          </div>
        </AppCard>
        <div className="space-y-5">
          <AppCard className="p-5">
            <h2 className="font-serif text-2xl font-bold">My Addresses</h2>
            <div className="mt-4 space-y-3">
              {addresses.slice(0, 2).map((address) => (
                <div key={address.id} className="rounded-lg border border-neutral-200 p-4">
                  <p className="font-bold">{address.label ?? "Address"}</p>
                  <p className="mt-2 text-sm text-neutral-600">{address.line1}<br />{address.city}<br />{address.country}</p>
                </div>
              ))}
              {!addressesQuery.isLoading && addresses.length === 0 ? <p className="text-sm text-neutral-600">No addresses saved yet.</p> : null}
            </div>
          </AppCard>
          <AppCard className="p-5">
            <h2 className="font-serif text-2xl font-bold">Communication Preferences</h2>
            {[
              ["email", "Email Notification"],
              ["sms", "SMS Notification"],
              ["marketing", "Marketing & Promotions"],
              ["whatsapp", "Whatsapp Notifications"]
            ].map(([key, label]) => (
              <div key={key} className="mt-4 flex items-center justify-between gap-4">
                <div><p className="font-bold">{label}</p><p className="text-xs text-neutral-600">Receive updates and news</p></div>
                <AppSwitch
                  checked={Boolean(notifications[key as keyof typeof notifications])}
                  onClick={() => updateSettings.mutate({ ...notifications, [key]: !notifications[key as keyof typeof notifications] })}
                />
              </div>
            ))}
          </AppCard>
        </div>
      </div>
    </>
  );
}
