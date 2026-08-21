import Link from "next/link";
import { AppButton } from "@/components/app/AppButton";
import { AppImage } from "@/components/app/AppImage";
import { AppSection } from "@/components/app/AppSection";
import { SiteIcon, SiteIconName } from "@/components/icons/SiteIcon";

const stats = [
  { value: "15+", label: "Years Experience", icon: "check" },
  { value: "500+", label: "Custom Sofas Delivered", icon: "sofa" },
  { value: "120+", label: "Premium Fabrics", icon: "palette" },
  { value: "1:1", label: "Personal Design Consultation", icon: "users" }
];

const services = [
  { title: "Personal Consultation", text: "One-on-one guidance from our design experts.", icon: "users" },
  { title: "Fabric Selection", text: "Explore a wide range of premium fabrics.", icon: "palette" },
  { title: "Size Planning", text: "We help you choose the perfect size.", icon: "ruler" },
  { title: "Delivery Advice", text: "We guide you through delivery and installation.", icon: "truck" }
];

export default function ShowroomPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden text-white">
        <AppImage src="/images/showroom-interior.png" alt="Shany Living showroom" className="absolute inset-0" sizes="100vw" preload loading="eager" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto flex min-h-96 max-w-7xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="max-w-2xl font-serif text-4xl leading-tight sm:text-6xl">Experience Comfort Before You Decide</h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/90">Feel every fabric, compare finishes and customize your sofa live with our design specialists.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="#book"><AppButton className="gap-2"><SiteIcon name="message" className="size-4" /> Chat on WhatsApp</AppButton></Link>
            <Link href="#book"><AppButton variant="outline" className="border-white bg-white/10 text-white hover:bg-white hover:text-neutral-950">Book a Showroom Visit</AppButton></Link>
          </div>
        </div>
      </section>
      <section className="bg-neutral-100 text-neutral-950 dark:bg-neutral-900 dark:text-neutral-50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-7 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <SiteIcon name={stat.icon as SiteIconName} className="size-8" />
              <div>
                <p className="font-serif text-2xl font-bold">{stat.value}</p>
                <p className="text-xs font-bold text-neutral-600 dark:text-neutral-400">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <AppSection className="text-neutral-950 dark:text-neutral-50">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <section>
            <h2 className="font-serif text-2xl font-bold">Why visit our showroom?</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {["Feel the Fabrics", "Try Every Sofa", "Design Consultation", "Customize Everything"].map((title) => (
                <div key={title} className="rounded-lg bg-neutral-100 p-5 text-neutral-950 dark:bg-neutral-900 dark:text-neutral-50">
                  <h3 className="font-serif text-xl font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-700 dark:text-neutral-300">Touch, compare and plan details with the team before ordering.</p>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2 className="font-serif text-2xl font-bold">Explore our Showroom</h2>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {["/images/showroom-interior.png", "/images/showroom-consultation.png", "/images/look-modern-elegance.png", "/images/category-sofas.png"].map((image) => (
                <AppImage key={image} src={image} alt="Showroom gallery" className="aspect-[1.45/1] rounded-lg" sizes="(max-width: 1024px) 50vw, 25vw" />
              ))}
            </div>
          </section>
        </div>
        <div id="book" className="mt-12 grid gap-6 rounded-lg bg-neutral-100 p-6 text-neutral-950 sm:p-8 dark:bg-neutral-900 dark:text-neutral-50 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="font-serif text-2xl font-bold">Book Your Visit</h2>
            <div className="mt-5 space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
              <p className="flex gap-2"><SiteIcon name="map-pin" className="size-4" /> Herzl 34, Tel Aviv, Israel</p>
              <p>03-1234567</p>
              <p>info@shanyliving.com</p>
              <p>Sun - Thu | 10:00 - 19:00</p>
              <p>Fri | 10:00 - 14:00</p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <AppButton>Chat on WhatsApp</AppButton>
              <AppButton variant="outline">Book a Showroom Visit</AppButton>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-neutral-300 bg-white dark:border-white/15 dark:bg-neutral-950">
            <iframe
              title="Shany Living showroom map"
              src="https://www.google.com/maps?q=Herzl%2034%2C%20Tel%20Aviv%2C%20Israel&output=embed"
              className="h-80 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div key={service.title} className="rounded-lg border border-neutral-200 bg-white p-5 text-neutral-950 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50">
              <SiteIcon name={service.icon as SiteIconName} className="size-7" />
              <h3 className="mt-4 font-bold">{service.title}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-700 dark:text-neutral-300">{service.text}</p>
            </div>
          ))}
        </div>
      </AppSection>
    </>
  );
}
