"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

      const redirectPath =
        values.email.toLowerCase() === "admin@shanyliving.com"
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
    <main className="grid min-h-screen place-items-center bg-[#eee8df] p-4">
      <AppCard className="w-full max-w-md p-7">
        <div className="text-center">
          <AppLogo className="justify-center" imageClassName="w-44" />
          <h1 className="mt-2 text-2xl font-semibold text-neutral-950">
            Sign in
          </h1>

          <p className="mt-2 text-sm text-neutral-600">
            Enter your account details to continue.
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
              className="mb-2 block text-sm font-medium text-neutral-800"
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
              className="h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/10"
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
              className="mb-2 block text-sm font-medium text-neutral-800"
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
              className="h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/10"
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
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {String(errors.root.message)}
            </div>
          ) : null}

          <AppButton
            type="submit"
            className="w-full"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Sign in
          </AppButton>
        </form>
      </AppCard>
    </main>
  );
}
