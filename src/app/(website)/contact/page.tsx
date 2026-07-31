import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { AppButton } from "@/components/app/AppButton";
import { AppImage } from "@/components/app/AppImage";
import { AppSection } from "@/components/app/AppSection";
import { WhatsappIcon } from "@/components/icons/WhatsappIcon";
import { siteImages } from "@/lib/images";

const details = [
  { label: "Showroom", value: "Herzl Street 34, Tel Aviv, Israel", icon: MapPin },
  { label: "Phone", value: "03-1234567", icon: Phone },
  { label: "Email", value: "info@shanyliving.com", icon: Mail },
  { label: "Opening hours", value: "Sun - Thu | 10:00 - 19:00 · Fri | 10:00 - 14:00", icon: Clock }
];

export default function ContactPage() {
  return (
    <>
      <section className="relative isolate grid min-h-70 place-items-center overflow-hidden px-4 py-16 text-center text-white sm:min-h-90">
        <AppImage src={siteImages.showroom} alt="Shany Living showroom consultation" className="absolute inset-0" sizes="100vw" preload loading="eager" objectPosition="30% center" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">Contact</p>
          <h1 className="mt-3 font-serif text-3xl sm:text-5xl">Visit our showroom</h1>
          <p className="mt-4 text-sm leading-6 text-white/90 sm:text-base">
            Sit on the models, feel the fabrics, and plan your sofa with a designer.
          </p>
        </div>
      </section>

      <AppSection className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
        <div>
          <h2 className="font-serif text-2xl font-bold">Talk to the team</h2>
          <div className="mt-7 flex flex-col gap-5">
            {details.map((detail) => (
              <div key={detail.label} className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-neutral-100">
                  <detail.icon className="size-5" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-500">{detail.label}</p>
                  <p className="mt-1 text-sm leading-6">{detail.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <AppButton className="w-full gap-2 sm:w-auto"><WhatsappIcon className="size-4" /> Chat on WhatsApp</AppButton>
            <Link href="/sofas"><AppButton variant="outline" className="w-full sm:w-auto">Browse sofas</AppButton></Link>
          </div>
        </div>
        <AppImage
          src={siteImages.showroomInterior}
          alt="Shany Living showroom interior"
          className="aspect-4/3 rounded-lg"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </AppSection>
    </>
  );
}
