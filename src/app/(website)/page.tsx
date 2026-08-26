import { redirect } from "next/navigation";
import { HomeExperience } from "@/components/landing/HomeExperience";
import { getHomeCatalog } from "@/lib/catalog";
import { mapCatalogProduct } from "@/lib/storefront-catalog";
import { getStorefrontProduct } from "@/lib/storefront-pages";
import { getCatalogProducts } from "@/lib/storefront-products";
import { isSocialArrival } from "@/lib/journey";

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  if (process.env.NEXT_PUBLIC_HIDE_LANDING_PAGE === "true") {
    redirect("/login");
  }

  const [catalog, query] = await Promise.all([getHomeCatalog(), searchParams]);
  const fromSocial = isSocialArrival(query.utm_source) || isSocialArrival(query.from) || isSocialArrival(query.source);
  const highlights = catalog.featuredProducts.length ? catalog.featuredProducts : catalog.bestSellers;
  const featured = highlights.length
    ? highlights.slice(0, 4).map((product) => mapCatalogProduct(product, getStorefrontProduct(product.slug)))
    : (await getCatalogProducts(4)).slice(0, 4);

  return <HomeExperience catalog={catalog} featured={featured} fromSocial={fromSocial} />;
}
