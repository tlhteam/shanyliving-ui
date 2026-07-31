import Image from "next/image";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { AppImage } from "@/components/app/AppImage";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { WhatsappIcon } from "@/components/icons/WhatsappIcon";
import { AppLogo } from "@/components/layout/AppLogo";
import { paymentMethods, siteImages } from "@/lib/images";

const shopLinks = ["Sofas", "Living Room", "Dining Room", "Bedroom", "Coffee Tables", "Chairs", "New Arrivals"];
const serviceLinks = ["Contact", "FAQ", "Shipping", "Warranty"];
const companyLinks = ["About", "Showroom", "Privacy", "Terms"];

const contactRows = [
  { text: "Herzl 34, Tel Aviv, Israel", icon: MapPin },
  { text: "03-1234567", icon: Phone },
  { text: "WhatsApp Us", icon: WhatsappIcon },
  { text: "info@shanyliving.com", icon: Mail },
  { text: "Sun - Thu | 10:00 - 19:00", icon: Clock },
  { text: "Fri | 10:00 - 14:00", icon: Clock }
];

export function AppFooter() {
  return (
    <footer className="bg-neutral-950 text-neutral-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1fr_1fr_1fr_1.2fr_1.8fr] lg:px-8">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">Shop</h3>
          <div className="mt-5 flex flex-col gap-3 text-sm">
            {shopLinks.map((item) => <Link key={item} href="/sofas" className="transition hover:text-white">{item}</Link>)}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">Customer Service</h3>
          <div className="mt-5 flex flex-col gap-3 text-sm">
            {serviceLinks.map((item) => <Link key={item} href="/contact" className="transition hover:text-white">{item}</Link>)}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">Company</h3>
          <div className="mt-5 flex flex-col gap-3 text-sm">
            {companyLinks.map((item) => <Link key={item} href="/about" className="transition hover:text-white">{item}</Link>)}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">Contact</h3>
          <div className="mt-5 flex flex-col gap-3 text-sm">
            {contactRows.map((row) => (
              <span key={row.text} className="flex items-start gap-2.5">
                <row.icon className="mt-0.5 size-4 shrink-0" />
                {row.text}
              </span>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2 lg:col-span-1">
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">Follow @shanyliving.furniture</h3>
          <Link href="/about" className="group mt-5 block overflow-hidden rounded-lg border border-white/10">
            <AppImage
              src={siteImages.showroomInterior}
              alt="Shany Living showroom interior"
              className="aspect-3.9/1"
              sizes="(max-width: 1024px) 100vw, 30vw"
              imageClassName="transition duration-500 group-hover:scale-[1.04]"
            />
          </Link>
          <Link href="/contact" className="mt-5 inline-flex h-10 items-center gap-2 rounded-md border border-white px-4 text-sm text-white transition hover:bg-white hover:text-neutral-950">
            <InstagramIcon className="size-4" /> View Instagram
          </Link>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-8 text-center sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:text-left">
          <AppLogo variant="light" imageClassName="w-32 sm:w-36" />
          <p className="text-xs">©2026 Shany Living Furniture. All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            <Link href="/about" className="transition hover:text-white">Privacy Policy</Link>
            <span aria-hidden>|</span>
            <Link href="/about" className="transition hover:text-white">Terms & Conditions</Link>
            <span aria-hidden>|</span>
            <Link href="/contact" className="transition hover:text-white">Accessibility</Link>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {paymentMethods.map((method) => (
              <span key={method.name} className="grid h-8 w-14 place-items-center rounded bg-white px-1.5">
                <Image src={method.image} alt={method.name} width={64} height={40} className="h-5 w-auto object-contain" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
