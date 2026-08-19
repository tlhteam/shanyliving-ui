import { ProductGridPage } from "@/components/storefront/ProductGridPage";
import { getStorefrontPage } from "@/lib/storefront-catalog";

export const revalidate = 60;

export default async function DiningPage() {
  const page = await getStorefrontPage("dining");

  return <ProductGridPage page={page} />;
}
