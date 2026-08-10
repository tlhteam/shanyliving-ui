import { redirect } from "next/navigation";
import { HomeExperience } from "@/components/landing/HomeExperience";
import { getHomeCatalog } from "@/lib/catalog";

export default async function HomePage() {
  if (process.env.NEXT_PUBLIC_HIDE_LANDING_PAGE === "true") {
    redirect("/login");
  }

  const catalog = await getHomeCatalog();

  return <HomeExperience catalog={catalog} />;
}
