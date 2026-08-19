import { ProductGridPage } from "@/components/storefront/ProductGridPage";
import { getStorefrontPage } from "@/lib/storefront-catalog";

export const revalidate = 60;

export default async function BedroomPage() {
  const page = await getStorefrontPage("bedroom");

  return <ProductGridPage page={page} />;
}
