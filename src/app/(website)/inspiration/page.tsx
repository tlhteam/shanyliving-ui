import Link from "next/link";
import { AppButton } from "@/components/app/AppButton";
import { AppImage } from "@/components/app/AppImage";
import { AppSection } from "@/components/app/AppSection";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { looks } from "@/lib/images";

const rooms = [
  { title: "Modern Elegance", text: "Soft neutrals, warm wood and a clean sofa profile.", image: looks[0].image },
  { title: "Warm Minimalism", text: "Calm layers, open spacing and tactile fabrics.", image: looks[1].image },
  { title: "Urban Luxury", text: "Bolder color, structured seating and rich texture.", image: looks[2].image }
];

export default function InspirationPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden text-white">
        <AppImage src="/images/look-warm-minimalism.png" alt="Living room inspiration" className="absolute inset-0" sizes="100vw" preload loading="eager" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative mx-auto flex min-h-80 max-w-7xl flex-col justify-end px-4 py-12 sm:min-h-96 sm:px-6 lg:px-8">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-white/80"><SiteIcon name="sparkle" className="size-4" /> Inspiration</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight sm:text-6xl">Shop complete rooms by feeling</h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/90 sm:text-base">Use these rooms as a starting point for sofas, fabrics, tables and finishing details.</p>
        </div>
      </section>
      <AppSection>
        <div className="grid gap-5 lg:grid-cols-3">
          {rooms.map((room) => (
            <article key={room.title} className="group overflow-hidden rounded-lg border border-neutral-200 bg-white text-neutral-950 shadow-sm transition duration-300 hover:shadow-xl sm:hover:-translate-y-1 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50">
              <AppImage src={room.image} alt={room.title} className="aspect-[1.4/1]" sizes="(max-width: 1024px) 100vw, 33vw" imageClassName="transition duration-700 group-hover:scale-[1.05]" />
              <div className="p-5">
                <h2 className="font-serif text-2xl font-bold">{room.title}</h2>
                <p className="mt-2 text-sm leading-6 text-neutral-700 dark:text-neutral-300">{room.text}</p>
                <Link href="/sofas" className="mt-5 inline-flex items-center gap-2 text-sm font-bold hover:underline">
                  Explore products <SiteIcon name="arrow-right" className="size-4 rtl:rotate-180" />
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-12 grid items-center gap-6 rounded-lg bg-neutral-100 p-6 text-neutral-950 sm:p-8 dark:bg-neutral-900 dark:text-neutral-50 lg:grid-cols-[auto_1fr_auto]">
          <SiteIcon name="grid" className="size-10" />
          <div>
            <h2 className="font-serif text-2xl font-bold">Build a room with us</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-700 dark:text-neutral-300">Share one inspiration room and the showroom team can match products, fabrics and colors for your space.</p>
          </div>
          <Link href="/showroom" className="block"><AppButton className="w-full lg:w-auto">Book a consultation</AppButton></Link>
        </div>
      </AppSection>
    </>
  );
}
