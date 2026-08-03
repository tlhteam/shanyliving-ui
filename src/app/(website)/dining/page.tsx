import { ProductGridPage } from "@/components/storefront/ProductGridPage";
import { storefrontPages } from "@/lib/storefront-pages";

export default function DiningPage() {
  return <ProductGridPage page={storefrontPages.dining} />;
}
