"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Gift, Heart, LockKeyhole, Package, Sofa } from "lucide-react";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppLogo } from "@/components/layout/AppLogo";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters")
});

type FormValues = z.infer<typeof schema>;

export default function CustomerLoginPage() {
  const router = useRouter();
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: "customer@shanyliving.com", password: "password" } });

  const onSubmit = async (values: FormValues) => {
    const result = await signIn("credentials", { ...values, redirect: false });

    if (result?.error) {
      form.setError("root", { type: "manual", message: "Invalid email or password" });
      return;
    }

    router.push("/customer");
    router.refresh();
  };

  return (
    <main className="grid min-h-screen bg-neutral-100 lg:grid-cols-[1fr_520px]">
      <section className="relative hidden overflow-hidden bg-black text-white lg:block">
        <div className="absolute inset-0 bg-[url('/images/hero-living-room.png')] bg-cover bg-center opacity-60" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <AppLogo variant="light" imageClassName="w-44" />
          <div>
            <h1 className="font-serif text-6xl leading-tight">Your SHANY Living account</h1>
            <p className="mt-5 max-w-lg text-white/80">Track orders, continue saved sofa designs, manage addresses, cards, gift cards, and messages with the showroom team.</p>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[Package, Sofa, Heart, Gift].map((Icon, index) => <span key={index} className="grid size-14 place-items-center rounded-full bg-white/10 backdrop-blur"><Icon className="size-6" /></span>)}
          </div>
        </div>
      </section>
      <section className="grid place-items-center p-4">
        <AppCard className="w-full max-w-md p-7">
          <AppLogo className="justify-center" imageClassName="w-44" />
          <div className="mt-8 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-black text-white"><LockKeyhole className="size-5" /></div>
            <h1 className="mt-4 font-serif text-3xl font-bold">Customer sign in</h1>
            <p className="mt-2 text-sm text-neutral-600">Access your orders, saved designs, wishlist, messages and settings.</p>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <input {...form.register("email")} type="email" placeholder="customer@shanyliving.com" className="h-11 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-black" />
            <input {...form.register("password")} type="password" placeholder="Enter your password" className="h-11 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-black" />
            {form.formState.errors.root?.message ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{form.formState.errors.root.message}</p> : null}
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <p className="font-bold">Local customer access</p>
              <p className="mt-1 text-xs">customer@shanyliving.com / password</p>
            </div>
            <AppButton type="submit" className="w-full" loading={form.formState.isSubmitting}>Sign in</AppButton>
          </form>
          <p className="mt-5 text-center text-sm text-neutral-600">Admin? <Link href="/login" className="font-bold text-neutral-950">Use admin sign in</Link></p>
        </AppCard>
      </section>
    </main>
  );
}
