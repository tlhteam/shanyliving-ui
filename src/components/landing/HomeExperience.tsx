"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Award, Gift, Heart, Lock, MapPin, MessageCircle, Palette, Ruler, Sofa, Sparkles, Star, Truck, Upload } from "lucide-react";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppSection } from "@/components/app/AppSection";
import { ImagePlaceholder } from "@/components/landing/ImagePlaceholder";
import type { HomeCatalog, CatalogProduct } from "@/lib/catalog";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.45 }
};

const looks = ["Modern Elegance", "Warm Minimalism", "Urban Luxury"];

const features = [
  { title: "Premium Craftsmanship", text: "Built to last", icon: Award },
  { title: "Nationwide Delivery", text: "Fast & reliable", icon: Truck },
  { title: "Custom Sizes Available", text: "Made for your space", icon: Sofa },
  { title: "Premium fabrics", text: "Wide selection", icon: Palette },
  { title: "WhatsApp Consultation", text: "Personal guidance", icon: MessageCircle },
  { title: "Secure Payments", text: "Safe & encrypted", icon: Lock }
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("he-IL").format(price);
}

function ProductCard({ product }: { product: CatalogProduct }) {
  return (
    <motion.div {...fadeUp}>
      <AppCard className="group overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative">
          <ImagePlaceholder className="aspect-[4/2.75] rounded-none border-0" />
          {product.is_customizable && (
            <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wide">Customizable</span>
          )}
          <button aria-label={`Save ${product.name}`} className="absolute right-3 top-3 rounded-full bg-white/80 p-1.5 text-white transition hover:bg-white hover:text-neutral-900">
            <Heart className="size-4" />
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-bold">{product.name}</h3>
          <p className="mt-1 text-sm font-bold">From ₪ {formatPrice(product.price)}</p>
          {product.seat_range && <p className="mt-4 text-xs text-neutral-600">Available in {product.seat_range}</p>}
          <div className="mt-3 flex items-center gap-1.5">
            {(product.colors?.length ? product.colors : ["#eee9df", "#715b45", "#0b5b3e"]).map((color) => (
              <span key={color} className="size-4 rounded-full border border-neutral-200" style={{ backgroundColor: color }} />
            ))}
            <span className="grid size-4 place-items-center rounded-full border border-neutral-400 text-xs text-neutral-500">+</span>
          </div>
          <div className="mt-4 grid grid-cols-[1fr_54px] gap-3">
            <AppButton size="sm">Customize</AppButton>
            <button aria-label={`Ask about ${product.name} on WhatsApp`} className="grid h-9 place-items-center rounded-md border border-neutral-300 transition hover:bg-neutral-100">
              <MessageCircle className="size-4" />
            </button>
          </div>
        </div>
      </AppCard>
    </motion.div>
  );
}

function BestSeller({ product }: { product: CatalogProduct }) {
  return (
    <motion.div className="min-w-36" {...fadeUp}>
      <div className="group relative overflow-hidden rounded-lg">
        <ImagePlaceholder className="aspect-[1.25/1] transition duration-300 group-hover:scale-[1.02]" />
        <button aria-label={`Save ${product.name}`} className="absolute right-2 top-2 text-white">
          <Heart className="size-5" />
        </button>
      </div>
      <h3 className="mt-3 text-sm font-bold">{product.name}</h3>
      <p className="text-sm font-bold">₪ {formatPrice(product.price)}</p>
    </motion.div>
  );
}

export function HomeExperience({ catalog }: { catalog: HomeCatalog }) {
  return (
    <>
      <section className="relative grid min-h-[620px] place-items-center overflow-hidden bg-neutral-200 px-4 text-center text-white">
        <ImagePlaceholder className="absolute inset-0 rounded-none border-0 opacity-90" />
        <div className="absolute inset-0 bg-black/25" />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="relative mx-auto max-w-3xl">
          <h1 className="font-serif text-5xl leading-[1.02] drop-shadow-md sm:text-6xl lg:text-7xl">Design Your Perfect Living Space</h1>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-6 sm:text-base">Premium furniture crafted for modern homes, with customizable sofas made to fit your style.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/sofas"><AppButton size="lg" className="w-full sm:w-auto">Customize Your Sofa</AppButton></Link>
            <Link href="/sofas"><AppButton size="lg" variant="outline" className="w-full border-white bg-white/5 text-white hover:bg-white hover:text-neutral-950 sm:w-auto">Explore Collection</AppButton></Link>
          </div>
        </motion.div>
      </section>

      <AppSection>
        <div className="mb-7 flex items-end justify-between gap-4">
          <h2 className="font-serif text-2xl font-bold sm:text-3xl">Shop by Category</h2>
          <Link href="/sofas" className="inline-flex items-center gap-2 text-sm font-bold">View all categories <ArrowRight className="size-4" /></Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {catalog.categories.map((category) => (
            <motion.div key={category.slug} {...fadeUp}>
              <Link href="/sofas" className="block text-center">
                <ImagePlaceholder className="aspect-[1.18/1]" />
                <span className="mt-3 block text-sm font-bold">{category.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </AppSection>

      <AppSection className="pt-4">
        <div className="mb-7 flex items-end justify-between gap-4">
          <h2 className="font-serif text-2xl font-bold sm:text-3xl">Featured Sofa Models</h2>
          <Link href="/sofas" className="inline-flex items-center gap-2 text-sm font-bold">View all sofas <ArrowRight className="size-4" /></Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {catalog.featuredProducts.map((product) => <ProductCard key={product.slug} product={product} />)}
        </div>
      </AppSection>

      <section className="bg-neutral-100">
        <AppSection>
          <h2 className="text-center font-serif text-2xl font-bold sm:text-3xl">How Customization Works</h2>
          <div className="mt-10 grid gap-8 lg:grid-cols-3 lg:divide-x lg:divide-neutral-400">
            {[
              { title: "Choose Your Model", text: "Select the model and structure that fits your style.", icon: Sofa },
              { title: "Select Size, Fabric & Color", text: "Pick size, fabric, and color you love.", icon: Ruler },
              { title: "Send Your Selection to WhatsApp", text: "We will review your selection and guide you to complete the perfect fit.", icon: MessageCircle }
            ].map((step, index) => (
              <motion.div key={step.title} className="px-4 text-center" {...fadeUp}>
                <div className="mx-auto flex max-w-xs flex-col items-center">
                  <span className="grid size-9 place-items-center rounded-full bg-black text-sm font-bold text-white">{index + 1}</span>
                  <step.icon className="mt-4 size-12 stroke-[1.5]" />
                  <h3 className="mt-6 font-bold">{step.title}</h3>
                  <p className="mt-3 text-xs leading-5 text-neutral-600">{step.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </AppSection>
      </section>

      <section className="bg-neutral-50">
        <AppSection className="grid items-center gap-8 lg:grid-cols-[1fr_360px]">
          <div className="flex items-center gap-5">
            <Sofa className="size-12 shrink-0 stroke-[1.5]" />
            <div>
              <h2 className="font-serif text-2xl font-bold">Upload a Photo of Your Room</h2>
              <p className="mt-2 max-w-lg text-sm leading-6">Get personalized advice on the perfect sofa size, style and layout for your space.</p>
            </div>
          </div>
          <div className="text-center">
            <AppButton className="w-full gap-2"><Upload className="size-4" /> Upload Room Photo</AppButton>
            <p className="mt-3 text-xs text-neutral-600">Optional and secure</p>
          </div>
        </AppSection>
      </section>

      <AppSection className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <div>
          <h2 className="font-serif text-2xl font-bold">Shop the Look</h2>
          <p className="mt-5 text-sm leading-6">Explore complete rooms and shop the look you love.</p>
          <Link href="/about"><AppButton className="mt-6">Explore Inspiration</AppButton></Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {looks.map((look) => (
            <motion.div key={look} className="relative overflow-hidden rounded-lg" {...fadeUp}>
              <ImagePlaceholder className="aspect-[1.75/1]" />
              <span className="absolute bottom-3 left-3 text-xs font-bold">{look}</span>
            </motion.div>
          ))}
        </div>
      </AppSection>

      <AppSection className="pt-4">
        <div className="mb-7 flex items-end justify-between gap-4">
          <h2 className="font-serif text-2xl font-bold sm:text-3xl">Best Sellers</h2>
          <Link href="/sofas" className="inline-flex items-center gap-2 text-sm font-bold">View all products <ArrowRight className="size-4" /></Link>
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {catalog.bestSellers.map((product) => <BestSeller key={product.slug} product={product} />)}
        </div>
      </AppSection>

      <section className="relative overflow-hidden text-white">
        <ImagePlaceholder className="absolute inset-0 rounded-none border-0" />
        <div className="absolute inset-0 bg-black/45" />
        <AppSection className="relative grid min-h-[360px] items-center lg:grid-cols-[1fr_480px]">
          <div />
          <motion.div {...fadeUp}>
            <h2 className="font-serif text-4xl sm:text-5xl">Visit Our Showroom</h2>
            <p className="mt-5 flex items-center gap-2 text-sm"><MapPin className="size-4" /> Herzl 34, Tel Aviv, Israel</p>
            <p className="mt-4 text-sm leading-6">Sun - Thu | 10:00 - 19:00<br />Fri | 10:00 - 14:00</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <AppButton>Book a Consultation</AppButton>
              <AppButton variant="outline" className="border-white bg-white/5 text-white hover:bg-white hover:text-neutral-950">Get Direction</AppButton>
            </div>
          </motion.div>
        </AppSection>
      </section>

      <section className="bg-white">
        <AppSection className="grid items-center gap-8 py-8 lg:grid-cols-[1.1fr_1fr_1.3fr]">
          <div>
            <h2 className="font-serif text-2xl font-bold">Join the SHANY LIVING Club</h2>
            <p className="mt-2 text-sm">Be the first to discover new collections, exclusive offers, and interior inspiration.</p>
          </div>
          <form className="flex">
            <input aria-label="Email" placeholder="Enter your email" className="h-10 min-w-0 flex-1 rounded-l-md border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-900" />
            <button className="h-10 rounded-r-md bg-black px-5 text-sm text-white transition hover:bg-neutral-800">Subscribe</button>
          </form>
          <div className="grid grid-cols-3 divide-x divide-neutral-300 text-xs">
            {[
              { text: "Exclusive Offers", icon: Gift },
              { text: "New Arrivals", icon: Star },
              { text: "Design Inspiration", icon: Sparkles }
            ].map((item) => (
              <span key={item.text} className="flex items-center justify-center gap-2 px-3"><item.icon className="size-5" /> {item.text}</span>
            ))}
          </div>
        </AppSection>
      </section>

      <section className="border-y border-neutral-200 bg-neutral-100">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 py-5 sm:grid-cols-3 lg:grid-cols-6 lg:px-8">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-center gap-3 border-neutral-400 px-2 lg:border-r">
              <feature.icon className="size-6 shrink-0 stroke-[1.5]" />
              <div>
                <p className="text-xs font-bold">{feature.title}</p>
                <p className="text-[11px] text-neutral-600">{feature.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Link aria-label="WhatsApp consultation" href="/contact" className="fixed bottom-6 right-6 z-40 grid size-14 place-items-center rounded-full bg-[#4cc45b] text-white shadow-lg transition hover:scale-105">
        <MessageCircle className="size-7" />
      </Link>
    </>
  );
}
