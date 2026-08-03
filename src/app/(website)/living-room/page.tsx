import { ProductGridPage } from "@/components/storefront/ProductGridPage";
import { storefrontPages } from "@/lib/storefront-pages";

export default function LivingRoomPage() {
  return <ProductGridPage page={storefrontPages["living-room"]} />;
}
