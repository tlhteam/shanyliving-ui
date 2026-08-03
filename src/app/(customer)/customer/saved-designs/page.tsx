import Link from "next/link";
import { Headphones } from "lucide-react";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppImage } from "@/components/app/AppImage";
import { CustomerTopbar } from "@/components/customer/CustomerShell";
import { savedDesigns } from "@/lib/customer-panel";

export default function SavedDesignsPage() {
  return (
    <>
      <CustomerTopbar title="My Saved Designs" subtitle="Your custom sofa designs are saved here. Continue editing, share, or request a consultation." />
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-6 text-sm font-bold">
          {["All Designs (4)", "In Progress (2)", "Requested (1)", "Consulted (1)"].map((tab, index) => (
            <span key={tab} className={index === 0 ? "border-b-2 border-black pb-2" : "pb-2 text-neutral-500"}>{tab}</span>
          ))}
        </div>
        <input placeholder="Search design name..." className="h-10 rounded-md border border-neutral-300 px-3 text-sm lg:w-72" />
      </div>
      <div className="space-y-4">
        {savedDesigns.map((design) => (
          <AppCard key={design.id} className="grid gap-4 p-4 lg:grid-cols-[240px_1fr_180px] lg:items-center">
            <AppImage src={design.image} alt={design.title} className="aspect-[1.6/1] rounded-lg" sizes="240px" />
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-serif text-2xl font-bold">{design.title}</h2>
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold">{design.status}</span>
              </div>
              <p className="mt-1 text-xs text-neutral-600">Saved design #{design.id}</p>
              <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-4">
                <div><dt className="font-bold">Configuration</dt><dd>{design.configuration}</dd></div>
                <div><dt className="font-bold">Fabric</dt><dd>{design.fabric}</dd></div>
                <div><dt className="font-bold">Size</dt><dd>{design.size}</dd></div>
                <div><dt className="font-bold">Extras</dt><dd>{design.extras}</dd></div>
              </dl>
            </div>
            <div className="space-y-2">
              <Link href="/customize-your-sofa"><AppButton className="w-full" size="sm">Continue Editing</AppButton></Link>
              <AppButton variant="outline" className="w-full" size="sm">Request Consultation</AppButton>
              <AppButton variant="outline" className="w-full" size="sm">Share Design</AppButton>
            </div>
          </AppCard>
        ))}
      </div>
      <AppCard className="mt-5 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3"><Headphones className="size-8" /><div><p className="font-bold">Need help with your design?</p><p className="text-sm text-neutral-600">Our consultants are here to help you create the perfect sofa.</p></div></div>
        <Link href="/showroom"><AppButton>Book a Consultation</AppButton></Link>
      </AppCard>
    </>
  );
}
