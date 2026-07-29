import Link from "next/link";
import { Camera } from "lucide-react";
import { AppLogo } from "@/components/layout/AppLogo";

const shopLinks = ["Sofas", "Living Room", "Dining Room", "Bedroom", "Coffee Tables", "Chairs", "New Arrivals"];
const serviceLinks = ["Contact", "FAQ", "Shipping", "Warranty"];
const companyLinks = ["About", "Showroom", "Privacy", "Terms"];

export function AppFooter() {
  return (
    <footer className="bg-neutral-950 text-neutral-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1fr_1fr_1.2fr_1.8fr] lg:px-8">
        <div>
          <h3 className="text-sm font-bold uppercase text-white">Shop</h3>
          <div className="mt-5 flex flex-col gap-3 text-sm">
            {shopLinks.map((item) => <Link key={item} href="/sofas" className="hover:text-white">{item}</Link>)}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase text-white">Customer Service</h3>
          <div className="mt-5 flex flex-col gap-3 text-sm">
            {serviceLinks.map((item) => <Link key={item} href="/contact" className="hover:text-white">{item}</Link>)}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase text-white">Company</h3>
          <div className="mt-5 flex flex-col gap-3 text-sm">
            {companyLinks.map((item) => <Link key={item} href="/about" className="hover:text-white">{item}</Link>)}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase text-white">Contact</h3>
          <p className="mt-5 text-sm leading-7">Herzl 34, Tel Aviv, Israel<br />03-1234567<br />WhatsApp Us<br />info@shanyliving.com<br />Sun - Thu | 10:00 - 19:00<br />Fri | 10:00 - 14:00</p>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase text-white">Follow @shanyliving.furniture</h3>
          <div className="mt-5 aspect-[3.9/1] rounded-lg border border-white/10 bg-[linear-gradient(135deg,#f7f3ec,#d8cec0,#f5f5f5)]" />
          <Link href="/contact" className="mt-5 inline-flex h-10 items-center gap-2 rounded-md border border-white px-4 text-sm text-white transition hover:bg-white hover:text-neutral-950">
            <Camera className="size-4" /> View Instagram
          </Link>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <AppLogo variant="light" imageClassName="w-36" />
          <p className="text-xs">©2026 Shany Living Furniture. All Rights Reserved.</p>
          <div className="flex flex-wrap gap-3 text-xs">
            <Link href="/about" className="hover:text-white">Privacy Policy</Link>
            <span>|</span>
            <Link href="/about" className="hover:text-white">Terms & Conditions</Link>
            <span>|</span>
            <Link href="/contact" className="hover:text-white">Accessibility</Link>
          </div>
          <div className="flex gap-2">
            {["VISA", "AMEX", "MC", "G Pay", "Apple Pay"].map((item) => (
              <span key={item} className="rounded bg-white px-2 py-1 text-[10px] font-bold text-neutral-900">{item}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
