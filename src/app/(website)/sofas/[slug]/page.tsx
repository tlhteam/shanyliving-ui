import Link from "next/link";
import { notFound } from "next/navigation";
import { AppButton } from "@/components/app/AppButton";
import { AppImage } from "@/components/app/AppImage";
import { AppSection } from "@/components/app/AppSection";
import { SiteIcon, SiteIconName } from "@/components/icons/SiteIcon";
import { ProductCard } from "@/components/storefront/ProductCard";
import { getStorefrontProduct, storefrontProducts } from "@/lib/storefront-pages";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const fabricImages = ["/images/category-sofas.png", "/images/look-warm-minimalism.png", "/images/sofa-noa.png", "/images/category-living-room.png", "/images/look-urban-luxury.png", "/images/showroom-interior.png"];

const benefits = [
  { title: "Personal Consultation", text: "We are here to help", icon: "message" },
  { title: "Premium Fabrics", text: "Made to order", icon: "fabric" },
  { title: "Warranty", text: "3 years", icon: "shield" },
  { title: "Nationwide delivery", text: "Fast & Reliable", icon: "truck" }
];

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = getStorefrontProduct(slug);

  if (!product) {
    notFound();
  }

  const related = storefrontProducts.filter((item) => item.slug !== product.slug).slice(0, 5);

  return (
    <>
      <AppSection className="pt-8 sm:pt-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section>
            <div className="relative overflow-hidden rounded-lg">
              <AppImage src={product.image} alt={product.name} className="aspect-[1.15/1]" sizes="(max-width: 1024px) 100vw, 55vw" preload loading="eager" imageClassName="object-cover" />
              <span className="absolute start-4 top-4 rounded-full bg-white px-4 py-1 text-xs font-bold">{product.badge ?? "New"}</span>
              <span className="absolute end-4 top-4 grid size-9 place-items-center rounded-full bg-white/80"><SiteIcon name="heart" className="size-5" /></span>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-3">
              {[product.image, "/images/sofa-luna.png", "/images/sofa-noa.png", "/images/sofa-ella.png", "/images/look-modern-elegance.png"].map((image) => (
                <AppImage key={image} src={image} alt={`${product.name} gallery`} className="aspect-[1.2/1] rounded-lg" sizes="20vw" />
              ))}
            </div>
          </section>
          <aside>
            <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs font-bold text-neutral-600">
              <Link href="/">Home</Link>
              <SiteIcon name="chevron-right" className="size-3" />
              <Link href="/sofas">Sofas</Link>
              <SiteIcon name="chevron-right" className="size-3" />
              <span className="text-neutral-950">{product.name}</span>
            </nav>
            <h1 className="font-serif text-4xl font-bold sm:text-5xl">{product.name}</h1>
            <div className="mt-4 flex items-center gap-3 text-sm">
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em]">{product.badge ?? "Customizable"}</span>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em]">Trusted showroom pick</span>
              <span>4.8 (36 reviews)</span>
            </div>
            <p className="mt-5 max-w-md text-sm leading-6 text-neutral-700">{product.description ?? "A modern sofa with deep cushions, refined proportions and made-to-order comfort for everyday living."}</p>
            <p className="mt-7 text-sm font-bold">From <span className="text-3xl">₪ {new Intl.NumberFormat("en").format(product.price)}</span></p>
            <p className="mt-1 text-xs text-neutral-600">Price varies by size and configuration</p>
            <div className="mt-6 divide-y divide-neutral-300 border border-neutral-300">
              {["Size & Configuration", "Fabric", "Color", "Leg Style", "Cushion Comfort"].map((item) => (
                <button key={item} className="flex w-full items-center justify-between px-5 py-4 text-start transition hover:bg-neutral-50">
                  <span>
                    <span className="block text-sm font-bold">{item}</span>
                    <span className="text-xs text-neutral-600">Choose your preference</span>
                  </span>
                  <SiteIcon name="chevron-right" className="size-4" />
                </button>
              ))}
            </div>
            <Link href="/customize-your-sofa"><AppButton className="mt-5 w-full">Start customizing on WhatsApp</AppButton></Link>
            <p className="mt-3 text-center text-xs text-neutral-600">Our team will assist you personally</p>
          </aside>
        </div>
      </AppSection>
      <section className="border-y border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 sm:px-6 lg:grid-cols-4 lg:px-8">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex items-center justify-center gap-3 text-center">
              <SiteIcon name={benefit.icon as SiteIconName} className="size-7" />
              <div>
                <p className="text-xs font-bold">{benefit.title}</p>
                <p className="text-[11px] text-neutral-600">{benefit.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-neutral-100">
        <AppSection className="grid items-center gap-6 py-8 lg:grid-cols-[1fr_260px]">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {fabricImages.map((image) => (
              <AppImage key={image} src={image} alt="Fabric option" className="aspect-square rounded-lg" sizes="16vw" />
            ))}
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold">Choose Your Fabric</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-700">Over 120 premium fabrics to choose from.</p>
            <Link href="/customize-your-sofa"><AppButton variant="outline" className="mt-4">View all fabrics</AppButton></Link>
          </div>
        </AppSection>
      </section>
      <AppSection>
        <h2 className="font-serif text-2xl font-bold">Complete the look</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {related.map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </div>
      </AppSection>
      <section className="bg-neutral-100">
        <AppSection className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <AppImage src="/images/showroom-consultation.png" alt="Custom sofa consultation" className="aspect-[1.9/1] rounded-lg" sizes="(max-width: 1024px) 100vw, 55vw" />
          <div>
            <h2 className="font-serif text-3xl font-bold">Custom Sofa, made for you</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-700">Choose your size, fabric, color and more. Our team is here to help you create the perfect sofa.</p>
            <Link href="/customize-your-sofa"><AppButton className="mt-6">Start customizing on WhatsApp</AppButton></Link>
          </div>
        </AppSection>
      </section>
    </>
  );
}
