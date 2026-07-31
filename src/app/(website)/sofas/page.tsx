import Link from "next/link";
import { ArrowRight, MessageCircle, Ruler } from "lucide-react";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppImage } from "@/components/app/AppImage";
import { AppSection } from "@/components/app/AppSection";
import { getHomeCatalog } from "@/lib/catalog";
import { productImage, siteImages } from "@/lib/images";

function formatPrice(price: number) {
  return new Intl.NumberFormat("he-IL").format(price);
}

export default async function SofasPage() {
  const catalog = await getHomeCatalog();
  const products = [...catalog.featuredProducts, ...catalog.bestSellers];

  return (
    <>
      <section className="relative isolate grid min-h-70 place-items-center overflow-hidden px-4 py-16 text-center text-white sm:min-h-90">
        <AppImage src={siteImages.hero} alt="Shany Living sofa collection" className="absolute inset-0" sizes="100vw" preload loading="eager" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative mx-auto max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">Collection</p>
          <h1 className="mt-3 font-serif text-3xl sm:text-5xl">Customizable sofas</h1>
          <p className="mt-4 text-sm leading-6 text-white/90 sm:text-base">
            Select a model and continue to size, structure, fabric, color and WhatsApp consultation.
          </p>
        </div>
      </section>

      <AppSection>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <AppCard key={product.slug} className="group overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <AppImage
                src={productImage(product, index)}
                alt={product.name}
                className="aspect-4/3"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                imageClassName="transition duration-500 group-hover:scale-[1.05]"
              />
              <div className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-serif text-xl font-bold">{product.name}</h2>
                  <span className="text-sm font-bold text-neutral-700">From ₪ {formatPrice(product.price)}</span>
                </div>
                {product.seat_range && (
                  <p className="mt-3 flex items-center gap-2 text-xs text-neutral-600"><Ruler className="size-4" /> Available in {product.seat_range}</p>
                )}
                <div className="mt-4 flex items-center gap-1.5">
                  {(product.colors?.length ? product.colors : ["#eee9df", "#715b45", "#0b5b3e"]).map((color) => (
                    <span key={color} className="size-4 rounded-full border border-neutral-200" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-[1fr_44px] gap-3">
                  <AppButton size="sm">Customize</AppButton>
                  <Link href="/contact" aria-label={`Ask about ${product.name}`} className="grid h-9 place-items-center rounded-md border border-neutral-300 transition hover:bg-neutral-100">
                    <MessageCircle className="size-4" />
                  </Link>
                </div>
              </div>
            </AppCard>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center gap-4 rounded-lg bg-neutral-100 px-6 py-10 text-center">
          <h2 className="font-serif text-2xl font-bold">Not sure which model fits your room?</h2>
          <p className="max-w-xl text-sm leading-6 text-neutral-700">Send us a photo of your space and our team will recommend the right size, fabric and layout.</p>
          <Link href="/contact"><AppButton className="gap-2">Talk to a designer <ArrowRight className="size-4" /></AppButton></Link>
        </div>
      </AppSection>
    </>
  );
}
