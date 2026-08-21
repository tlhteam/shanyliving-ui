import { redirect } from "next/navigation";
import { HomeExperience } from "@/components/landing/HomeExperience";
import { getHomeCatalog } from "@/lib/catalog";
import { isSocialArrival } from "@/lib/journey";

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  if (process.env.NEXT_PUBLIC_HIDE_LANDING_PAGE === "true") {
    redirect("/login");
  }

  const [catalog, query] = await Promise.all([getHomeCatalog(), searchParams]);
  const fromSocial = isSocialArrival(query.utm_source) || isSocialArrival(query.from) || isSocialArrival(query.source);

  return <HomeExperience catalog={catalog} fromSocial={fromSocial} />;
}
