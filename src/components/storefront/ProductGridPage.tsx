import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { AppButton } from "@/components/app/AppButton";
import { AppImage } from "@/components/app/AppImage";
import { AppSection } from "@/components/app/AppSection";
import { ProductCard } from "@/components/storefront/ProductCard";
import type { StorefrontPage } from "@/lib/storefront-pages";

export function ProductGridPage({ page }: { page: StorefrontPage }) {
  return (
    <>
      <section className="relative isolate overflow-hidden text-white">
        <AppImage src={page.heroImage} alt={page.title} className="absolute inset-0" sizes="100vw" preload loading="eager" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative mx-auto flex min-h-72 max-w-7xl flex-col justify-end px-4 py-12 sm:min-h-88 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/80">{page.eyebrow}</p>
          <h1 className="mt-3 font-serif text-4xl sm:text-6xl">{page.title}</h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/90 sm:text-base">{page.description}</p>
        </div>
      </section>
      <AppSection>
        <div className="-mx-4 mb-8 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex min-w-max gap-3">
            {page.filters.map((filter) => (
              <button key={filter} className="inline-flex h-10 min-w-28 items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white px-4 text-xs font-bold transition hover:border-neutral-950 hover:bg-neutral-950 hover:text-white">
                {filter}
                {["Sort by", "Sofa Type", "Size", "Seats", "Price", "Clear Filters"].includes(filter) ? <ChevronDown className="size-3.5" /> : null}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {page.products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <AppButton variant="outline" className="min-w-48 gap-2">
            Load more
            <ChevronDown className="size-4" />
          </AppButton>
        </div>
        <div className="mt-14 grid items-center gap-6 rounded-lg bg-neutral-100 p-6 sm:p-8 lg:grid-cols-[1fr_auto]">
          <div>
            <h2 className="font-serif text-2xl font-bold">Need help choosing?</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-700">Send a room photo, measurements, or a favorite style and the team will guide you to the right product and configuration.</p>
          </div>
          <Link href="/showroom">
            <AppButton className="w-full sm:w-auto">Talk to the showroom</AppButton>
          </Link>
        </div>
      </AppSection>
    </>
  );
}
