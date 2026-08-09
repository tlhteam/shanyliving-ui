"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AppButton } from "@/components/app/AppButton";
import { apiUrl } from "@/lib/api";

const schema = z
  .object({
    name: z.string().min(2, "Please enter your full name"),
    email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
    phone: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string().min(1, "Please confirm your password")
  })
  .refine((values) => values.password === values.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"]
  });

type FormValues = z.infer<typeof schema>;

const fieldClass =
  "h-11 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none transition focus:border-black";

export function RegisterForm() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", password: "", password_confirmation: "" }
  });

  const onSubmit = async (values: FormValues) => {
    if (!apiUrl) {
      form.setError("root", { type: "manual", message: "The account service is unavailable right now." });
      return;
    }

    const response = await fetch(`${apiUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const message = body?.errors?.email?.[0] ?? body?.message ?? "We could not create your account.";
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
      <div>
        <label htmlFor="register-name" className="mb-2 block text-sm font-semibold text-neutral-800">Full name</label>
        <input id="register-name" autoComplete="name" placeholder="David Garcia" {...form.register("name")} className={fieldClass} />
        {form.formState.errors.name?.message ? <p className="mt-1.5 text-sm text-red-600">{form.formState.errors.name.message}</p> : null}
      </div>
      <div>
        <label htmlFor="register-email" className="mb-2 block text-sm font-semibold text-neutral-800">Email</label>
        <input id="register-email" type="email" autoComplete="email" placeholder="you@example.com" {...form.register("email")} className={fieldClass} />
        {form.formState.errors.email?.message ? <p className="mt-1.5 text-sm text-red-600">{form.formState.errors.email.message}</p> : null}
      </div>
      <div>
        <label htmlFor="register-phone" className="mb-2 block text-sm font-semibold text-neutral-800">Phone</label>
        <input id="register-phone" type="tel" autoComplete="tel" placeholder="+972 50-123-4567" {...form.register("phone")} className={fieldClass} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="register-password" className="mb-2 block text-sm font-semibold text-neutral-800">Password</label>
          <input id="register-password" type="password" autoComplete="new-password" placeholder="At least 8 characters" {...form.register("password")} className={fieldClass} />
          {form.formState.errors.password?.message ? <p className="mt-1.5 text-sm text-red-600">{form.formState.errors.password.message}</p> : null}
        </div>
        <div>
          <label htmlFor="register-password-confirm" className="mb-2 block text-sm font-semibold text-neutral-800">Confirm password</label>
          <input id="register-password-confirm" type="password" autoComplete="new-password" placeholder="Repeat your password" {...form.register("password_confirmation")} className={fieldClass} />
          {form.formState.errors.password_confirmation?.message ? <p className="mt-1.5 text-sm text-red-600">{form.formState.errors.password_confirmation.message}</p> : null}
        </div>
      </div>
      {form.formState.errors.root?.message ? (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{form.formState.errors.root.message}</p>
      ) : null}
      <AppButton type="submit" className="w-full" loading={form.formState.isSubmitting} disabled={form.formState.isSubmitting}>Create account</AppButton>
    </form>
  );
}
