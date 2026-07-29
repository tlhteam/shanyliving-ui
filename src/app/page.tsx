import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";
import { HomeExperience } from "@/components/landing/HomeExperience";
import { getHomeCatalog } from "@/lib/catalog";

export default async function Home() {
  const catalog = await getHomeCatalog();

  return (
    <div className="bg-white text-neutral-950">
      <AppHeader />
      <main>
        <HomeExperience catalog={catalog} />
      </main>
      <AppFooter />
    </div>
  );
}
