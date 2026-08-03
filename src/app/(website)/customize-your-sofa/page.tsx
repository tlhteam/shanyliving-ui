import Link from "next/link";
import { Armchair, Blocks, Check, Cuboid, MessageCircle, Palette, Ruler, Sofa } from "lucide-react";
import { AppButton } from "@/components/app/AppButton";
import { AppImage } from "@/components/app/AppImage";
import { AppSection } from "@/components/app/AppSection";

const steps = [
  { title: "Model", icon: Sofa },
  { title: "Size", icon: Ruler },
  { title: "Structure", icon: Blocks },
  { title: "Fabric", icon: Cuboid },
  { title: "Color", icon: Palette },
  { title: "Legs", icon: Armchair }
];

const models = ["Straight Sofa", "L-Shape Sofa", "U-Shape Sofa", "Corner Sofa", "Modular Sofa", "Chaise Sofa", "Armchair", "Ottoman"];

export default function CustomizeYourSofaPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden text-white">
        <AppImage src="/images/sofa-ella.png" alt="Customize your sofa" className="absolute inset-0" sizes="100vw" preload loading="eager" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative mx-auto flex min-h-80 max-w-7xl flex-col justify-center px-4 py-12 sm:min-h-105 sm:px-6 lg:px-8">
          <h1 className="max-w-lg font-serif text-4xl leading-tight sm:text-6xl">Customize Your Sofa</h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/90">Create a sofa that fits your space, style and comfort. Choose every detail and we will make it perfect for you.</p>
          <Link href="/showroom"><AppButton className="mt-6 w-fit">Book a Consultation</AppButton></Link>
        </div>
      </section>
      <AppSection>
        <h2 className="text-center font-serif text-2xl font-bold sm:text-3xl">Design your perfect sofa in 6 simple steps</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {steps.map((step, index) => (
            <div key={step.title} className="flex flex-col items-center rounded-lg border border-neutral-200 bg-white p-4 text-center shadow-sm">
              <span className="grid size-11 place-items-center rounded-full bg-neutral-100"><step.icon className="size-5" /></span>
              <p className="mt-3 text-xs font-bold">{index + 1}. {step.title}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-[360px_1fr]">
          <aside className="rounded-lg bg-neutral-100 p-5">
            <h2 className="font-serif text-2xl font-bold">1. Choose your model</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-700">Select the sofa shape that suits your space and lifestyle.</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {models.map((model, index) => (
                <button key={model} className="rounded-lg border border-neutral-200 bg-white p-4 text-center text-xs font-bold transition hover:border-neutral-950">
                  <Sofa className="mx-auto mb-2 size-8 stroke-[1.4]" />
                  {model}
                  {index === 0 ? <Check className="mx-auto mt-2 size-4" /> : null}
                </button>
              ))}
            </div>
            <AppButton className="mt-5 w-full">Next Step</AppButton>
            <AppButton variant="outline" className="mt-2 w-full">Save My Design</AppButton>
          </aside>
          <section className="rounded-lg bg-neutral-100 p-5">
            <div className="mb-5 flex items-center justify-between gap-4">
              <span className="rounded-full bg-white px-4 py-2 text-xs font-bold">Your design</span>
              <span className="rounded-full bg-white px-4 py-2 text-xs font-bold">360° View +</span>
            </div>
            <AppImage src="/images/sofa-cloud-modular.png" alt="Custom sofa preview" className="aspect-[1.9/1] rounded-lg bg-neutral-200" sizes="(max-width: 1024px) 100vw, 70vw" />
            <dl className="mt-6 grid gap-4 text-xs sm:grid-cols-5">
              {["Model Straight Sofa", "Size 280 cm", "Fabric Not selected", "Color Not selected", "Legs Not selected"].map((item) => {
                const [label, ...value] = item.split(" ");
                return (
                  <div key={item}>
                    <dt className="font-bold">{label}</dt>
                    <dd className="mt-1 text-neutral-600">{value.join(" ")}</dd>
                  </div>
                );
              })}
            </dl>
          </section>
        </div>
        <div className="mt-12 text-center">
          <h2 className="font-serif text-2xl font-bold">Need help in designing your sofa?</h2>
          <p className="mt-2 text-sm text-neutral-700">Book a free consultation with our design experts.</p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/showroom"><AppButton className="gap-2"><MessageCircle className="size-4" /> Chat on WhatsApp</AppButton></Link>
            <Link href="/showroom"><AppButton variant="outline">Book a Showroom Visit</AppButton></Link>
          </div>
        </div>
      </AppSection>
    </>
  );
}
