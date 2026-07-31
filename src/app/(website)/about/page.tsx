import Link from "next/link";
import { Award, Palette, Ruler, Sofa } from "lucide-react";
import { AppButton } from "@/components/app/AppButton";
import { AppImage } from "@/components/app/AppImage";
import { AppSection } from "@/components/app/AppSection";
import { looks, siteImages } from "@/lib/images";

const values = [
  { title: "Made to measure", text: "Every sofa is built to the size and layout of your room.", icon: Ruler },
  { title: "Premium fabrics", text: "Performance linens, boucle and velvets selected in the showroom.", icon: Palette },
  { title: "Built to last", text: "Hardwood frames, high resilience foam and reinforced stitching.", icon: Award },
  { title: "Personal service", text: "One designer follows your order from selection to delivery.", icon: Sofa }
];

export default function AboutPage() {
  return (
    <>
      <section className="relative isolate grid min-h-70 place-items-center overflow-hidden px-4 py-16 text-center text-white sm:min-h-90">
        <AppImage src={siteImages.showroomInterior} alt="Shany Living showroom" className="absolute inset-0" sizes="100vw" preload loading="eager" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">Our story</p>
          <h1 className="mt-3 font-serif text-3xl sm:text-5xl">About SHANY Living</h1>
          <p className="mt-4 text-sm leading-6 text-white/90 sm:text-base">
            A premium Tel Aviv furniture showroom focused on customizable sofas, modern furniture and personal service.
          </p>
        </div>
      </section>

      <AppSection className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <AppImage
          src={siteImages.showroom}
          alt="Shany Living designers with clients"
          className="aspect-4/3 rounded-lg"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div>
          <h2 className="font-serif text-2xl font-bold sm:text-3xl">Furniture designed around your room</h2>
          <p className="mt-5 text-sm leading-7 text-neutral-700">
            We start with your space, not a catalog. Bring measurements or a photo of your room and our team maps the right
            model, structure, fabric and color combination for how you actually live.
          </p>
          <p className="mt-4 text-sm leading-7 text-neutral-700">
            Every selection is packaged into a single WhatsApp summary, so you can review comfort, delivery timing and final
            details with one person from first visit to installation.
          </p>
          <Link href="/contact"><AppButton className="mt-7 w-full sm:w-auto">Book a showroom visit</AppButton></Link>
        </div>
      </AppSection>

      <section className="bg-neutral-100">
        <AppSection>
          <h2 className="text-center font-serif text-2xl font-bold sm:text-3xl">What we stand for</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="rounded-lg bg-white p-6 shadow-sm">
                <value.icon className="size-8 stroke-[1.5]" />
                <h3 className="mt-5 font-bold">{value.title}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{value.text}</p>
              </div>
            ))}
          </div>
        </AppSection>
      </section>

      <AppSection>
        <h2 className="font-serif text-2xl font-bold sm:text-3xl">Inspiration</h2>
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {looks.map((look) => (
            <div key={look.title} className="group relative overflow-hidden rounded-lg">
              <AppImage
                src={look.image}
                alt={look.title}
                className="aspect-1.5/1"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                imageClassName="transition duration-500 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/55 to-transparent" />
              <span className="absolute bottom-3 left-3 text-xs font-bold text-white">{look.title}</span>
            </div>
          ))}
        </div>
      </AppSection>
    </>
  );
}
