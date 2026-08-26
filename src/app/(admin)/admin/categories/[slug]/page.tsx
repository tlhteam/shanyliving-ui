import { CategoryEditor } from "@/components/admin/categories/CategoryEditor";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return <CategoryEditor slug={slug} />;
}
