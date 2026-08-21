import Link from "next/link";
import { notFound } from "next/navigation";
import { AppButton } from "@/components/app/AppButton";
import { AppImage } from "@/components/app/AppImage";
import { AppSection } from "@/components/app/AppSection";
import { SiteIcon, SiteIconName } from "@/components/icons/SiteIcon";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ProductDetailHero } from "@/components/storefront/ProductDetailHero";
import { getCatalogProduct } from "@/lib/catalog";
import { mapCatalogProduct } from "@/lib/storefront-catalog";
import { isUsableImagePath } from "@/lib/media";
import { mobileOnlyClass, mobileVisibleSlug } from "@/lib/mobile-catalog";
import { getStorefrontProduct, storefrontProducts } from "@/lib/storefront-pages";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const fallbackFabricImages = [
  "/images/category-sofas.png",
  "/images/look-warm-minimalism.png",
  "/images/sofa-noa.png",
  "/images/category-living-room.png",
  "/images/look-urban-luxury.png",
  "/images/showroom-interior.png"
];

const benefits = [
  { title: "Premium Quality", text: "Crafted to last", icon: "shield" },
  { title: "Custom Made", text: "Just for you", icon: "fabric" },
  { title: "White Glove Delivery", text: "Delivery and assembly", icon: "truck" },
  { title: "Secure Payments", text: "Safe and encrypted", icon: "lock" }
];

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const fallbackProduct = getStorefrontProduct(slug);
  const apiProduct = await getCatalogProduct(slug);
  const product = apiProduct ? mapCatalogProduct(apiProduct, fallbackProduct) : fallbackProduct;

  if (!product) {
    notFound();
  }

  const related = storefrontProducts.filter((item) => item.slug !== product.slug).slice(0, 5);
  const relatedMobileSlug = mobileVisibleSlug(related);
  const galleryImages = (
    product.galleryImages?.length
      ? product.galleryImages
      : [product.image, "/images/sofa-luna.png", "/images/sofa-noa.png", "/images/sofa-ella.png", "/images/look-modern-elegance.png"]
  ).filter(isUsableImagePath);
  const fabricImages = product.fabricImages?.length ? product.fabricImages : fallbackFabricImages;

  return (
    <>
      <AppSection className="pt-6 pb-8 sm:pt-10 sm:pb-12">
        <ProductDetailHero product={product} images={galleryImages} />
      </AppSection>

      <section className="border-y border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-950">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 sm:px-6 lg:grid-cols-4 lg:px-8">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex items-center gap-3">
              <SiteIcon name={benefit.icon as SiteIconName} className="size-6 shrink-0 sm:size-7" />
              <div className="min-w-0">
                <p className="text-xs font-bold leading-tight">{benefit.title}</p>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400">{benefit.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-neutral-100 dark:bg-neutral-900">
        <AppSection className="grid items-center gap-6 py-8 lg:grid-cols-[1fr_260px]">
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6 sm:gap-3">
            {fabricImages.map((image) => (
              <AppImage key={image} src={image} alt="Fabric option" className="aspect-square rounded-lg" sizes="(max-width: 640px) 30vw, 16vw" />
            ))}
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold sm:text-2xl">Choose Your Fabric</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-700 dark:text-neutral-300">Over 120 premium fabrics to choose from.</p>
            <Link href="/customize-your-sofa" className="block">
              <AppButton variant="outline" className="mt-4 w-full sm:w-auto">View all fabrics</AppButton>
            </Link>
          </div>
        </AppSection>
      </section>

      <AppSection>
        <h2 className="font-serif text-xl font-bold sm:text-2xl">Complete the look</h2>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {related.map((item) => (
            <ProductCard key={item.slug} product={item} className={mobileOnlyClass(item.slug, relatedMobileSlug)} />
          ))}
        </div>
      </AppSection>

      <section className="bg-neutral-100 dark:bg-neutral-900">
        <AppSection className="grid items-center gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <AppImage src="/images/showroom-consultation.png" alt="Custom sofa consultation" className="aspect-[1.6/1] rounded-lg sm:aspect-[1.9/1]" sizes="(max-width: 1024px) 100vw, 55vw" />
          <div>
            <h2 className="font-serif text-2xl font-bold sm:text-3xl">Custom Sofa, made for you</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-700 dark:text-neutral-300">Choose your size, fabric, color and more. Our team is here to help you create the perfect sofa.</p>
            <Link href="/customize-your-sofa" className="block">
              <AppButton className="mt-6 w-full sm:w-auto">Open Customizer</AppButton>
            </Link>
          </div>
        </AppSection>
      </section>
    </>
  );
}
