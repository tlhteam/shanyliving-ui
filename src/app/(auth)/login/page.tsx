import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Gift, Heart, LockKeyhole, Package, Sofa } from "lucide-react";
import { authOptions } from "@/auth";
import { AppCard } from "@/components/app/AppCard";
import { AppLogo } from "@/components/layout/AppLogo";
import { CustomerLoginForm } from "@/components/auth/CustomerLoginForm";

type PageProps = { searchParams: Promise<{ callbackUrl?: string }> };

export default async function CustomerLoginPage({ searchParams }: PageProps) {
  const { callbackUrl } = await searchParams;
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect(callbackUrl?.startsWith("/") ? callbackUrl : "/customer");
  }

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
            {[Package, Sofa, Heart, Gift].map((Icon, index) => (
              <span key={index} className="grid size-14 place-items-center rounded-full bg-white/10 backdrop-blur">
                <Icon className="size-6" />
              </span>
            ))}
          </div>
        </div>
      </section>
      <section className="grid place-items-center p-4 sm:p-6">
        <AppCard className="w-full max-w-md p-6 sm:p-7">
          <AppLogo className="justify-center" imageClassName="w-40 sm:w-44" />
          <div className="mt-8 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-black text-white">
              <LockKeyhole className="size-5" />
            </div>
            <h2 className="mt-4 font-serif text-2xl font-bold sm:text-3xl">Customer sign in</h2>
            <p className="mt-2 text-sm text-neutral-600">Access your orders, saved designs, wishlist, messages and settings.</p>
          </div>
          <CustomerLoginForm callbackUrl={callbackUrl} />
          <p className="mt-5 text-center text-sm text-neutral-600">
            New to SHANY Living? <Link href="/register" className="font-bold text-neutral-950 hover:underline">Create an account</Link>
          </p>
        </AppCard>
      </section>
    </main>
  );
}
