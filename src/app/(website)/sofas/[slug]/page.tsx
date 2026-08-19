import Link from "next/link";
import { notFound } from "next/navigation";
import { AppButton } from "@/components/app/AppButton";
import { AppImage } from "@/components/app/AppImage";
import { AppSection } from "@/components/app/AppSection";
import { SiteIcon, SiteIconName } from "@/components/icons/SiteIcon";
import { ProductBuyActions } from "@/components/storefront/ProductBuyActions";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ProductDetailAccordion } from "@/components/storefront/ProductDetailAccordion";
import { ProductImageSwiper } from "@/components/storefront/ProductImageSwiper";
import { getCatalogProduct, type CatalogProduct } from "@/lib/catalog";
import { isUsableImagePath } from "@/lib/media";
import { getStorefrontProduct, storefrontProducts } from "@/lib/storefront-pages";
import type { StorefrontProduct } from "@/lib/storefront-pages";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const fallbackFabricImages = ["/images/category-sofas.png", "/images/look-warm-minimalism.png", "/images/sofa-noa.png", "/images/category-living-room.png", "/images/look-urban-luxury.png", "/images/showroom-interior.png"];

const benefits = [
  { title: "Premium Quality", text: "Crafted to last", icon: "shield" },
  { title: "Custom Made", text: "Just for you", icon: "fabric" },
  { title: "White Glove Delivery", text: "Delivery and assembly", icon: "truck" },
  { title: "Secure Payments", text: "Safe and encrypted", icon: "lock" }
];

function apiProductToStorefrontProduct(product: CatalogProduct, fallback?: StorefrontProduct): StorefrontProduct {
  const categorySlug = typeof product.category === "object" && product.category ? product.category.slug : "sofas";
  const category: StorefrontProduct["category"] = categorySlug === "living-room"
    ? "living-room"
    : categorySlug === "dining-room"
      ? "dining"
      : categorySlug === "bedroom"
        ? "bedroom"
        : "sofas";
  const galleryImages = product.images
    ?.slice()
    .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))
    .map((image) => image.path ?? image.url ?? "")
    .filter(isUsableImagePath);
  const primaryImage = isUsableImagePath(product.image) ? String(product.image) : galleryImages?.[0] ?? fallback?.image ?? "";

  const optionGroups = (product.options ?? [])
    .filter((option) => (option.values ?? []).length > 0)
    .map((option) => ({
      name: option.name,
      values: (option.values ?? []).map((value) => ({
        label: value.value,
        swatch: value.swatch ?? null,
        image: value.media_url ?? null
      }))
    }));

  const colorGroup = optionGroups.find((group) => group.name.toLowerCase() === "color");
  const fabricGroup = optionGroups.find((group) => group.name.toLowerCase() === "fabric");

  return {
    name: product.name,
    slug: product.slug,
    category,
    subcategory: product.subcategory ?? fallback?.subcategory ?? "Showroom product",
    price: Number(product.price ?? fallback?.price ?? 0),
    image: primaryImage,
    badge: product.is_best_seller ? "Best Seller" : product.is_featured ? "Featured" : fallback?.badge,
    description: product.description ?? fallback?.description,
    seatRange: product.seat_range ?? fallback?.seatRange,
    dimensions: fallback?.dimensions,
    variants: fabricGroup?.values.map((value) => value.label) ?? fallback?.variants,
    colors: colorGroup?.values.map((value) => value.swatch).filter((swatch): swatch is string => Boolean(swatch))
      ?? (product.colors?.length ? product.colors : fallback?.colors),
    colorNames: colorGroup?.values.map((value) => value.label) ?? fallback?.colorNames,
    galleryImages: galleryImages?.length ? galleryImages : fallback?.galleryImages,
    fabricImages: fabricGroup?.values.map((value) => value.image).filter((image): image is string => Boolean(image))
      ?? fallback?.fabricImages,
    optionGroups: optionGroups.length ? optionGroups : undefined
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const fallbackProduct = getStorefrontProduct(slug);
  const apiProduct = await getCatalogProduct(slug);
  const product = apiProduct ? apiProductToStorefrontProduct(apiProduct, fallbackProduct) : fallbackProduct;

  if (!product) {
    notFound();
  }

  const related = storefrontProducts.filter((item) => item.slug !== product.slug).slice(0, 5);
  const hasPrice = product.price > 0;
  const galleryImages = (product.galleryImages?.length ? product.galleryImages : [product.image, "/images/sofa-luna.png", "/images/sofa-noa.png", "/images/sofa-ella.png", "/images/look-modern-elegance.png"]).filter(isUsableImagePath);
  const fabricImages = product.fabricImages?.length ? product.fabricImages : fallbackFabricImages;

  return (
    <>
      <AppSection className="pt-8 sm:pt-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <ProductImageSwiper images={galleryImages} productName={product.name} badge={product.badge} />
          <aside>
            <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs font-bold text-neutral-600 dark:text-neutral-400">
              <Link href="/">Home</Link>
              <SiteIcon name="chevron-right" className="size-3" />
              <Link href="/sofas">Sofas</Link>
              <SiteIcon name="chevron-right" className="size-3" />
              <span className="text-neutral-950 dark:text-neutral-50">{product.name}</span>
            </nav>
            <h1 className="font-serif text-4xl font-bold sm:text-5xl">{product.name}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-950 dark:bg-white/10 dark:text-white">{product.badge ?? "Ready to order"}</span>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-950 dark:bg-white/10 dark:text-white">Trusted showroom pick</span>
              <span>4.8 (36 reviews)</span>
            </div>
            <p className="mt-5 max-w-md text-sm leading-6 text-neutral-700 dark:text-neutral-300">{product.description ?? "A modern furniture piece with refined proportions and made-to-order comfort for everyday living."}</p>
            <p className="mt-7 text-sm font-bold">
              {hasPrice ? (
                <>From <span className="text-3xl">NIS {new Intl.NumberFormat("en").format(product.price)}</span></>
              ) : (
                <span className="text-3xl">Price on request</span>
              )}
            </p>
            <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
              {hasPrice ? "Price varies by size and configuration" : "Available by showroom quote"}
            </p>
            {product.dimensions || product.variants?.length ? (
              <div className="mt-5 grid gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm dark:border-white/10 dark:bg-white/10">
                {product.dimensions ? (
                  <p><span className="font-bold">Dimensions:</span> {product.dimensions}</p>
                ) : null}
                {product.variants?.length ? (
                  <p><span className="font-bold">Variations:</span> {product.variants.join(", ")}</p>
                ) : null}
              </div>
            ) : null}
            <ProductDetailAccordion product={product} />
            <div className="mt-5">
              <ProductBuyActions product={product} />
            </div>
            {hasPrice ? (
              <>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Link href={`/customize-your-sofa?product=${product.slug}&step=model`}>
                    <AppButton variant="outline" className="w-full">Customize Your Sofa</AppButton>
                  </Link>
                  <Link href={`/customize-your-sofa?product=${product.slug}&step=room`}>
                    <AppButton variant="outline" className="w-full">See It In My Room (AI)</AppButton>
                  </Link>
                </div>
                <p className="mt-3 text-center text-xs text-neutral-600 dark:text-neutral-400">Add to cart for checkout, customize in 4 steps, or preview the sofa in your room.</p>
              </>
            ) : (
              <Link href="/showroom" className="mt-3 block">
                <AppButton variant="outline" className="w-full">Ask Showroom Team</AppButton>
              </Link>
            )}
          </aside>
        </div>
      </AppSection>
      <section className="border-y border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-950">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 sm:px-6 lg:grid-cols-4 lg:px-8">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex items-center justify-center gap-3 text-center">
              <SiteIcon name={benefit.icon as SiteIconName} className="size-7" />
              <div>
                <p className="text-xs font-bold">{benefit.title}</p>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400">{benefit.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-neutral-100 dark:bg-neutral-900">
        <AppSection className="grid items-center gap-6 py-8 lg:grid-cols-[1fr_260px]">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {fabricImages.map((image) => (
              <AppImage key={image} src={image} alt="Fabric option" className="aspect-square rounded-lg" sizes="16vw" />
            ))}
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold">Choose Your Fabric</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-700 dark:text-neutral-300">Over 120 premium fabrics to choose from.</p>
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
      <section className="bg-neutral-100 dark:bg-neutral-900">
        <AppSection className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <AppImage src="/images/showroom-consultation.png" alt="Custom sofa consultation" className="aspect-[1.9/1] rounded-lg" sizes="(max-width: 1024px) 100vw, 55vw" />
          <div>
            <h2 className="font-serif text-3xl font-bold">Custom Sofa, made for you</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-700 dark:text-neutral-300">Choose your size, fabric, color and more. Our team is here to help you create the perfect sofa.</p>
            <Link href="/customize-your-sofa"><AppButton className="mt-6">Open Customizer</AppButton></Link>
          </div>
        </AppSection>
      </section>
    </>
  );
}
