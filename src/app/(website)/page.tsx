import { HomeExperience } from "@/components/landing/HomeExperience";
import { getHomeCatalog } from "@/lib/catalog";

export default async function HomePage() {
  const catalog = await getHomeCatalog();

  return <HomeExperience catalog={catalog} />;
}
