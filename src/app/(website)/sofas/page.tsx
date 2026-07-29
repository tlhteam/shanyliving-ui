import { AppCard } from "@/components/app/AppCard";
import { AppSection } from "@/components/app/AppSection";

const products = ["SOHO", "NOVA", "MILANO", "LUNA", "MONACO", "ARCO"];

export default function SofasPage() {
  return <AppSection><div className="mb-10"><p className="text-sm font-semibold uppercase tracking-[0.24em] text-neutral-500">Collection</p><h1 className="mt-3 text-4xl font-semibold">Customizable sofas</h1><p className="mt-4 max-w-2xl text-neutral-600">Select a model and continue to size, structure, fabric, color and WhatsApp consultation.</p></div><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{products.map((name, index) => <AppCard key={name} className="overflow-hidden"><div className="aspect-[4/3] bg-gradient-to-br from-stone-200 to-stone-400" /><div className="p-5"><div className="flex items-center justify-between"><h2 className="text-xl font-semibold">{name}</h2><span className="text-sm text-neutral-500">From ₪{4990 + index * 350}</span></div><p className="mt-2 text-sm text-neutral-600">Custom sizes and multiple fabrics available.</p></div></AppCard>)}</div></AppSection>;
}
