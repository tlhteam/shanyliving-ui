import Link from "next/link";
import { AppButton } from "@/components/app/AppButton";
import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppLogo } from "@/components/layout/AppLogo";

export default function NotFound() {
  return (
    <>
      <AppHeader />
      <main className="grid min-h-[62vh] place-items-center bg-[#f5f1ea] px-4 py-20 text-center">
        <div className="max-w-xl">
          <AppLogo className="justify-center" imageClassName="w-48" />
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.24em] text-neutral-500">404</p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-neutral-950 sm:text-5xl">Page not found</h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-neutral-600">
            The page may have moved, but our sofas are still exactly where they should be.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/"><AppButton className="w-full sm:w-auto">Back to Home</AppButton></Link>
            <Link href="/sofas"><AppButton variant="outline" className="w-full sm:w-auto">View Sofas</AppButton></Link>
          </div>
        </div>
      </main>
      <AppFooter />
    </>
  );
}
