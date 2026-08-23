import { ProductGridPage } from "@/components/storefront/ProductGridPage";
import { getStorefrontPage } from "@/lib/storefront-catalog";

export const revalidate = 60;

export default async function LivingRoomPage() {
  const page = await getStorefrontPage("living-room");

  return <ProductGridPage page={page} slug="living-room" />;
}
