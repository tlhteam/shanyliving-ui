import { ProductGridPage } from "@/components/storefront/ProductGridPage";
import { storefrontPages } from "@/lib/storefront-pages";

export default function BedroomPage() {
  return <ProductGridPage page={storefrontPages.bedroom} />;
}
