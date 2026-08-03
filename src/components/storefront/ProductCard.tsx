import Link from "next/link";
import { Heart, MessageCircle, Plus } from "lucide-react";
import { AppButton } from "@/components/app/AppButton";
import { AppImage } from "@/components/app/AppImage";
import type { StorefrontProduct } from "@/lib/storefront-pages";

const formatPrice = (price: number) => new Intl.NumberFormat("en").format(price);

export function ProductCard({ product }: { product: StorefrontProduct }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/sofas/${product.slug}`} className="relative block overflow-hidden">
        <AppImage
          src={product.image}
          alt={product.name}
          className="aspect-[1.38/1]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          imageClassName="transition duration-700 group-hover:scale-[1.05]"
        />
        {product.badge ? (
          <span className="absolute start-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-950">
            {product.badge}
          </span>
        ) : null}
        <span className="absolute end-3 top-3 grid size-8 place-items-center rounded-full bg-white/80 text-neutral-900 transition group-hover:bg-white">
          <Heart className="size-4" />
        </span>
      </Link>
      <div className="p-4 sm:p-5">
        <Link href={`/sofas/${product.slug}`} className="font-bold transition hover:text-neutral-600">
          {product.name}
        </Link>
        <p className="mt-1 text-sm font-bold">₪ {formatPrice(product.price)}</p>
        {product.seatRange ? <p className="mt-4 text-xs text-neutral-600">Available in {product.seatRange}</p> : <div className="mt-4 h-4" />}
        <div className="mt-3 flex items-center gap-1.5">
          {(product.colors ?? ["#eee9df", "#6a5845", "#0d5f43"]).slice(0, 3).map((color) => (
            <span key={`${product.slug}-${color}`} className="size-4 rounded-full border border-neutral-200" style={{ backgroundColor: color }} />
          ))}
          <span className="grid size-4 place-items-center rounded-full border border-neutral-300 text-neutral-500">
            <Plus className="size-3" />
          </span>
        </div>
        <div className="mt-5 grid grid-cols-[1fr_48px] gap-3">
          <Link href="/customize-your-sofa">
            <AppButton size="sm" className="w-full">Customize</AppButton>
          </Link>
          <Link href="/showroom" aria-label={`Ask about ${product.name}`} className="grid h-9 place-items-center rounded-md border border-neutral-300 transition hover:bg-neutral-100">
            <MessageCircle className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
