import { ProductEditor } from "@/components/admin/products/ProductEditor";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return <ProductEditor slug={slug} />;
}
