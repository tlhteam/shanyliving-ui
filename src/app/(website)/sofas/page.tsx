import { ProductGridPage } from "@/components/storefront/ProductGridPage";
import { getStorefrontPage } from "@/lib/storefront-catalog";

export const revalidate = 60;

export default async function SofasPage() {
  const page = await getStorefrontPage("sofas");

  return <ProductGridPage page={page} />;
}
