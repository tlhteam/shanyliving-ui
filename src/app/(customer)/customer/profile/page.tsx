"use client";

import { useForm } from "react-hook-form";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppForm } from "@/components/app/AppForm";
import { AppSwitch } from "@/components/app/AppSwitch";
import { AppTextField } from "@/components/app/AppTextField";
import { CustomerTopbar } from "@/components/customer/CustomerShell";
import { addresses, customer } from "@/lib/customer-panel";

type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthday: string;
};

export default function ProfilePage() {
  const form = useForm<ProfileForm>({
    defaultValues: { firstName: customer.firstName, lastName: customer.lastName, email: customer.email, phone: customer.phone, birthday: "May 12, 1990" }
  });

  return (
    <>
      <CustomerTopbar title="My Profile" subtitle="Manage your personal information and account details." />
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <AppCard className="p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold">Personal Information</h2>
            <AppButton variant="outline" size="sm">Edit Profile</AppButton>
          </div>
          <div className="grid gap-6 lg:grid-cols-[140px_1fr]">
            <div className="text-center">
              <div className="mx-auto size-28 rounded-full bg-neutral-200" />
              <AppButton variant="outline" className="mt-4 w-full" size="sm">Change Photo</AppButton>
              <p className="mt-2 text-xs text-neutral-500">JPG, PNG or WEBP. Max 2MB</p>
            </div>
            <AppForm form={form} onSubmit={() => undefined} submitLabel="Save Profile">
              <AppTextField<ProfileForm> name="firstName" label="First Name" />
              <AppTextField<ProfileForm> name="lastName" label="Last Name" />
              <AppTextField<ProfileForm> name="email" label="Email Address" />
              <AppTextField<ProfileForm> name="phone" label="Phone Number" />
              <AppTextField<ProfileForm> name="birthday" label="Date of Birth" />
              <AppTextField<ProfileForm> name="firstName" label="Preferred Language" />
            </AppForm>
          </div>
        </AppCard>
        <div className="space-y-5">
          <AppCard className="p-5">
            <h2 className="font-serif text-2xl font-bold">My Addresses</h2>
            <div className="mt-4 space-y-3">
              {addresses.slice(0, 2).map((address) => <div key={address.id} className="rounded-lg border border-neutral-200 p-4"><p className="font-bold">{address.label}</p><p className="mt-2 text-sm text-neutral-600">{address.line}<br />{address.city}<br />{address.country}</p></div>)}
            </div>
          </AppCard>
          <AppCard className="p-5">
            <h2 className="font-serif text-2xl font-bold">Communication Preferences</h2>
            {["Email Notification", "SMS Notification", "Marketing & Promotions", "Whatsapp Notifications"].map((item, index) => (
              <div key={item} className="mt-4 flex items-center justify-between gap-4">
                <div><p className="font-bold">{item}</p><p className="text-xs text-neutral-600">Receive updates and news</p></div>
                <AppSwitch checked={index === 0 || index === 3} />
              </div>
            ))}
          </AppCard>
        </div>
      </div>
    </>
  );
}
