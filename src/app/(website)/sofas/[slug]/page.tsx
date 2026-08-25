import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AppSection } from "@/components/app/AppSection";
import { SiteIcon, SiteIconName } from "@/components/icons/SiteIcon";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ProductDetailHero } from "@/components/storefront/ProductDetailHero";
import { Testimonials } from "@/components/storefront/Testimonials";
import { getCatalogProduct } from "@/lib/catalog";
import { mapCatalogProduct } from "@/lib/storefront-catalog";
import { isUsableImagePath } from "@/lib/media";
import { mobileOnlyClass, mobileVisibleSlug } from "@/lib/mobile-catalog";
import { getStorefrontProduct, storefrontProducts } from "@/lib/storefront-pages";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const benefits = [
  { key: "quality", icon: "shield" },
  { key: "custom", icon: "fabric" },
  { key: "delivery", icon: "truck" },
  { key: "payments", icon: "lock" }
];

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const t = await getTranslations("storefront.detailPage");
  const benefitCopy = await getTranslations("storefront.benefits");
  const fallbackProduct = getStorefrontProduct(slug);
  const apiProduct = await getCatalogProduct(slug);
  const product = apiProduct ? mapCatalogProduct(apiProduct, fallbackProduct) : fallbackProduct;

  if (!product) {
    notFound();
  }

  const related = storefrontProducts.filter((item) => item.slug !== product.slug && item.category === product.category).slice(0, 5);
  const relatedMobileSlug = mobileVisibleSlug(related);
  const galleryImages = (product.galleryImages?.length ? product.galleryImages : [product.image]).filter(isUsableImagePath);

  return (
    <>
      <AppSection className="pt-6 pb-8 sm:pt-10 sm:pb-12">
        <ProductDetailHero key={product.slug} product={product} images={galleryImages} />
      </AppSection>

      <section className="border-y border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-950">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 sm:px-6 lg:grid-cols-4 lg:px-8">
          {benefits.map((benefit) => (
            <div key={benefit.key} className="flex items-center gap-3">
              <SiteIcon name={benefit.icon as SiteIconName} className="size-6 shrink-0 sm:size-7" />
              <div className="min-w-0">
                <p className="text-xs font-bold leading-tight">{benefitCopy(`${benefit.key}.title`)}</p>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400">{benefitCopy(`${benefit.key}.text`)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Testimonials />

      {related.length > 0 ? (
        <AppSection>
          <h2 className="font-serif text-xl font-bold sm:text-2xl">{t("related")}</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} className={mobileOnlyClass(item.slug, relatedMobileSlug)} />
            ))}
          </div>
        </AppSection>
      ) : null}
    </>
  );
}
