import { ProductGridPage } from "@/components/storefront/ProductGridPage";
import { storefrontPages } from "@/lib/storefront-pages";

export default function NewArrivalsPage() {
  return <ProductGridPage page={storefrontPages["new-arrivals"]} />;
}
