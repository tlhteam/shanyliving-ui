"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
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
  const { update: updateSession } = useSession();
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
    {
      successMessage: "Profile updated.",
      onSuccess: (profile) => updateSession({ user: { name: profile.name, email: profile.email, image: profile.avatar } })
    }
  );

  const updateAvatar = useCustomerMutation<File, CustomerProfile>(
    "profile",
    (avatar) => {
      const formData = new FormData();
      formData.append("avatar", avatar);

      return { path: "/customer/profile/avatar", options: { method: "POST", formData } };
    },
    {
      successMessage: "Profile image updated.",
      onSuccess: (profile) => updateSession({ user: { name: profile.name, email: profile.email, image: profile.avatar } })
    }
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
              <div className="relative mx-auto grid size-28 place-items-center overflow-hidden rounded-full bg-neutral-200 text-3xl font-bold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                {profileQuery.data?.avatar ? (
                  <Image src={profileQuery.data.avatar} alt={profileQuery.data.name} fill sizes="112px" className="object-cover" />
                ) : (
                  (profileQuery.data?.name ?? "U").slice(0, 1).toUpperCase()
                )}
              </div>
              <label className="mt-4 inline-flex h-9 cursor-pointer items-center justify-center rounded-md border border-neutral-300 bg-white px-3 text-sm font-medium text-neutral-950 transition hover:bg-neutral-100 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:hover:bg-white/10">
                {updateAvatar.isPending ? "Loading..." : "Upload Photo"}
                <input type="file" accept="image/*" className="sr-only" onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    updateAvatar.mutate(file);
                  }
                }} />
              </label>
              <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">JPG, PNG or WEBP. Max 2MB.</p>
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
                <div key={address.id} className="rounded-lg border border-neutral-200 p-4 dark:border-white/10">
                  <p className="font-bold">{address.label ?? "Address"}</p>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{address.line1}<br />{address.city}<br />{address.country}</p>
                </div>
              ))}
              {!addressesQuery.isLoading && addresses.length === 0 ? <p className="text-sm text-neutral-600 dark:text-neutral-400">No addresses saved yet.</p> : null}
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
                <div><p className="font-bold">{label}</p><p className="text-xs text-neutral-600 dark:text-neutral-400">Receive updates and news</p></div>
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
