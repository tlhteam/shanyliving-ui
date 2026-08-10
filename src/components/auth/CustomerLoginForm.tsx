"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AppButton } from "@/components/app/AppButton";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required")
});

type FormValues = z.infer<typeof schema>;

export function CustomerLoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const router = useRouter();
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });

  const onSubmit = async (values: FormValues) => {
    const result = await signIn("credentials", { ...values, role: "customer", redirect: false });

    if (!result || result.error) {
      form.setError("root", { type: "manual", message: "Invalid email or password" });
      return;
    }

    router.push(callbackUrl?.startsWith("/") ? callbackUrl : "/customer");
    router.refresh();
  };

  return (
    <div className="mt-6 space-y-4">
      <SocialAuthButtons callbackUrl={callbackUrl?.startsWith("/") ? callbackUrl : "/customer"} />
      <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wide text-neutral-400">
        <span className="h-px flex-1 bg-neutral-200" />
        or
        <span className="h-px flex-1 bg-neutral-200" />
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label htmlFor="customer-email" className="mb-2 block text-sm font-semibold text-neutral-800 dark:text-neutral-200">Email</label>
        <input
          id="customer-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...form.register("email")}
          className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-black dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:placeholder:text-neutral-500 dark:focus:border-white"
        />
        {form.formState.errors.email?.message ? <p className="mt-1.5 text-sm text-red-600">{form.formState.errors.email.message}</p> : null}
      </div>
      <div>
        <label htmlFor="customer-password" className="mb-2 block text-sm font-semibold text-neutral-800 dark:text-neutral-200">Password</label>
        <input
          id="customer-password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          {...form.register("password")}
          className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-black dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:placeholder:text-neutral-500 dark:focus:border-white"
        />
        {form.formState.errors.password?.message ? <p className="mt-1.5 text-sm text-red-600">{form.formState.errors.password.message}</p> : null}
      </div>
      {form.formState.errors.root?.message ? (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">{form.formState.errors.root.message}</p>
      ) : null}
      <AppButton type="submit" className="w-full" loading={form.formState.isSubmitting} disabled={form.formState.isSubmitting}>Sign in</AppButton>
      </form>
    </div>
  );
}
