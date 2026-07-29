"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppLogo } from "@/components/layout/AppLogo";

const schema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setError("root", {
          type: "manual",
          message: "Invalid email or password",
        });

        return;
      }

      const callbackUrl =
        new URLSearchParams(window.location.search).get("callbackUrl");
      const redirectPath = callbackUrl?.startsWith("/")
        ? callbackUrl
        : values.email.toLowerCase() === "admin@shanyliving.com"
          ? "/admin"
          : "/customer";

      router.push(redirectPath);
      router.refresh();
    } catch {
      setError("root", {
        type: "manual",
        message: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#eee8df] p-4 text-neutral-950 transition-colors dark:bg-neutral-950 dark:text-neutral-50">
      <AppCard className="w-full max-w-md overflow-hidden p-0 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50">
        <div className="border-b border-neutral-200 bg-neutral-50 px-7 py-6 dark:border-white/10 dark:bg-neutral-950">
          <AppLogo className="justify-center dark:hidden" imageClassName="w-44" />
          <AppLogo variant="light" className="hidden justify-center dark:inline-flex" imageClassName="w-44" />
        </div>

        <div className="p-7">
        <div className="text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
            <ShieldCheck className="size-5" />
          </div>

          <h1 className="mt-4 text-2xl font-semibold">
            Admin sign in
          </h1>

          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
            Access the catalog, leads, appointments, and showroom dashboard.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 space-y-4"
          noValidate
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-neutral-800 dark:text-neutral-200"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="admin@shanyliving.com"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
              className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/10 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:placeholder:text-neutral-500 dark:focus:border-white dark:focus:ring-white/10"
            />

            {errors.email?.message ? (
              <p className="mt-1.5 text-sm text-red-600">
                {String(errors.email.message)}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-neutral-800 dark:text-neutral-200"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              aria-invalid={Boolean(errors.password)}
              {...register("password")}
              className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/10 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:placeholder:text-neutral-500 dark:focus:border-white dark:focus:ring-white/10"
            />

            {errors.password?.message ? (
              <p className="mt-1.5 text-sm text-red-600">
                {String(errors.password.message)}
              </p>
            ) : null}
          </div>

          {errors.root?.message ? (
            <div
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200"
            >
              {String(errors.root.message)}
            </div>
          ) : null}

          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100">
            <div className="flex items-center gap-2 font-semibold">
              <LockKeyhole className="size-4" />
              Local admin access
            </div>
            <p className="mt-1 text-xs">admin@shanyliving.com / password</p>
          </div>

          <AppButton
            type="submit"
            className="w-full"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Sign in
          </AppButton>
        </form>
        </div>
      </AppCard>
    </main>
  );
}
