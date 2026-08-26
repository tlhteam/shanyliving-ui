import { notFound } from "next/navigation";
import { SofaStepConfigurator } from "@/components/sofa/SofaStepConfigurator";
import { getCatalogProducts } from "@/lib/storefront-products";

export default async function CustomizeYourSofaPage() {
  const catalog = await getCatalogProducts();
  const sofaProducts = catalog.filter((product) => product.category === "sofas").slice(0, 5);

  if (!sofaProducts.length) {
    notFound();
  }

  return <SofaStepConfigurator sofaProducts={sofaProducts} />;
}
