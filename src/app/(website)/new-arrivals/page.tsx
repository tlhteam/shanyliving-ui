import { ProductGridPage } from "@/components/storefront/ProductGridPage";
import { getStorefrontPage } from "@/lib/storefront-catalog";

export const revalidate = 60;

export default async function NewArrivalsPage() {
  const page = await getStorefrontPage("new-arrivals");

  return <ProductGridPage page={page} />;
}
