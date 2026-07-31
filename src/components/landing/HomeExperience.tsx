"use client";

import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Award, Gift, Heart, Lock, MapPin, MessageCircle, Palette, Ruler, Sofa, Sparkles, Star, Truck, Upload } from "lucide-react";
import { AppButton } from "@/components/app/AppButton";
import { AppImage } from "@/components/app/AppImage";
import { AppSection } from "@/components/app/AppSection";
import { WhatsappIcon } from "@/components/icons/WhatsappIcon";
import { categoryImage, looks, productImage, siteImages } from "@/lib/images";
import type { HomeCatalog, CatalogProduct } from "@/lib/catalog";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.45 }
};

const customizationSteps = [
  { title: "Choose Your Model", text: "Select the model and structure that fits your style.", icon: Sofa },
  { title: "Select Size, Fabric & Color", text: "Pick size, fabric, and color you love.", icon: Ruler },
  { title: "Send Your Selection to WhatsApp", text: "We will review your selection and guide you to complete the perfect fit.", icon: MessageCircle }
];

const clubPerks = [
  { text: "Exclusive Offers", icon: Gift },
  { text: "New Arrivals", icon: Star },
  { text: "Design Inspiration", icon: Sparkles }
];

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

function FeaturedCard({ product, index }: { product: CatalogProduct; index: number }) {
  return (
    <motion.div {...fadeUp}>
      <Link href="/sofas" className="group relative block overflow-hidden rounded-lg shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
        <AppImage
          src={productImage(product, index)}
          alt={product.name}
          className="aspect-4/5"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          imageClassName="transition duration-700 group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-black/5" />
        {product.is_customizable && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-neutral-950">Customizable</span>
        )}
        <div className="absolute inset-x-4 bottom-4 flex flex-col items-center text-center text-white">
          <p className="font-serif text-lg leading-tight sm:text-xl">{product.name}</p>
          <p className="mt-1 text-xs font-semibold sm:text-sm">From ₪ {formatPrice(product.price)}</p>
          <span className="mt-3 inline-flex h-9 items-center rounded-full border border-white/80 bg-white/10 px-6 text-[11px] font-bold uppercase tracking-[0.14em] backdrop-blur transition group-hover:bg-white group-hover:text-neutral-950">
            Explore
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

function BestSeller({ product, index }: { product: CatalogProduct; index: number }) {
  return (
    <motion.div {...fadeUp}>
      <Link href="/sofas" className="group block">
        <div className="relative overflow-hidden rounded-lg">
          <AppImage
            src={productImage(product, index)}
            alt={product.name}
            className="aspect-square"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
            imageClassName="transition duration-500 group-hover:scale-[1.05]"
          />
          <span aria-hidden className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-white/85 text-neutral-800 transition group-hover:bg-white">
            <Heart className="size-4" />
          </span>
        </div>
        <h3 className="mt-3 text-sm font-bold">{product.name}</h3>
        <p className="text-sm font-bold text-neutral-700">₪ {formatPrice(product.price)}</p>
      </Link>
    </motion.div>
  );
}

export function HomeExperience({ catalog }: { catalog: HomeCatalog }) {
  const [lookRef, lookApi] = useEmblaCarousel({ align: "start", loop: true, containScroll: "trimSnaps" });
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "/contact";

  return (
    <>
      <section className="relative isolate grid min-h-120 place-items-center overflow-hidden px-4 py-20 text-center text-white sm:min-h-140 lg:min-h-160">
        <AppImage src={siteImages.hero} alt="Shany Living showroom living space" className="absolute inset-0" sizes="100vw" preload loading="eager" />
        <div className="absolute inset-0 bg-linear-to-b from-black/45 via-black/25 to-black/50" />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="relative mx-auto max-w-3xl">
          <h1 className="font-serif text-4xl leading-[1.05] drop-shadow-md sm:text-6xl lg:text-7xl">Design Your Perfect Living Space</h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-white/90 sm:mt-6 sm:text-base">
            Premium furniture crafted for modern homes, with customizable sofas made to fit your style.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link href="/sofas"><AppButton size="lg" className="w-full sm:w-auto">Customize Your Sofa</AppButton></Link>
            <Link href="/sofas">
              <AppButton size="lg" variant="outline" className="w-full border-white bg-white/10 text-white backdrop-blur hover:bg-white hover:text-neutral-950 sm:w-auto">
                Explore Collection
              </AppButton>
            </Link>
          </div>
        </motion.div>
      </section>

      <AppSection>
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-serif text-2xl font-bold sm:text-3xl">Shop by Category</h2>
          <Link href="/sofas" className="inline-flex items-center gap-2 text-sm font-bold hover:underline">View all categories <ArrowRight className="size-4" /></Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {catalog.categories.map((category, index) => (
            <motion.div key={category.slug} {...fadeUp}>
              <Link href="/sofas" className="group block text-center">
                <AppImage
                  src={categoryImage(category, index)}
                  alt={category.name}
                  className="aspect-1.18/1 rounded-lg"
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 15vw"
                  imageClassName="transition duration-500 group-hover:scale-[1.06]"
                />
                <span className="mt-3 block text-sm font-bold group-hover:underline">{category.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </AppSection>

      <AppSection className="pt-0">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-serif text-2xl font-bold sm:text-3xl">Featured Collection</h2>
          <Link href="/sofas" className="inline-flex items-center gap-2 text-sm font-bold hover:underline">View all Collection <ArrowRight className="size-4" /></Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {catalog.featuredProducts.slice(0, 4).map((product, index) => (
            <FeaturedCard key={product.slug} product={product} index={index} />
          ))}
        </div>
      </AppSection>

      <section className="bg-neutral-100">
        <AppSection>
          <h2 className="text-center font-serif text-2xl font-bold sm:text-3xl">How Customization Works</h2>
          <div className="mt-10 grid gap-10 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-neutral-300">
            {customizationSteps.map((step, index) => (
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
        <AppSection className="grid items-center gap-6 py-10 lg:grid-cols-[1fr_360px] lg:py-12">
          <div className="flex items-center gap-4 sm:gap-5">
            <Sofa className="size-10 shrink-0 stroke-[1.5] sm:size-12" />
            <div>
              <h2 className="font-serif text-xl font-bold sm:text-2xl">Upload a Photo of Your Room</h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-neutral-700">Get personalized advice on the perfect sofa size, style and layout for your space.</p>
            </div>
          </div>
          <div className="text-center">
            <AppButton className="w-full gap-2"><Upload className="size-4" /> Upload Room Photo</AppButton>
            <p className="mt-3 text-xs text-neutral-600">Optional and secure</p>
          </div>
        </AppSection>
      </section>

      <AppSection className="grid gap-8 lg:grid-cols-[220px_1fr] lg:items-center">
        <div>
          <h2 className="font-serif text-2xl font-bold">Shop the Look</h2>
          <p className="mt-4 text-sm leading-6 text-neutral-700">Explore complete rooms and shop the look you love.</p>
          <Link href="/about"><AppButton className="mt-6 w-full sm:w-auto">Explore Inspiration</AppButton></Link>
        </div>
        <div className="relative">
          <div ref={lookRef} className="overflow-hidden">
            <div className="flex gap-4 lg:gap-5">
              {looks.map((look) => (
                <div key={look.title} className="min-w-0 shrink-0 grow-0 basis-[86%] sm:basis-1/2 lg:basis-1/3">
                  <Link href="/about" className="group relative block overflow-hidden rounded-lg">
                    <AppImage
                      src={look.image}
                      alt={look.title}
                      className="aspect-1.6/1"
                      sizes="(max-width: 640px) 86vw, (max-width: 1024px) 45vw, 30vw"
                      imageClassName="transition duration-500 group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/55 to-transparent" />
                    <span className="absolute bottom-3 left-3 text-xs font-bold text-white">{look.title}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <button
            aria-label="Previous looks"
            onClick={() => lookApi?.scrollPrev()}
            className="absolute -left-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white text-neutral-900 shadow-md transition hover:bg-neutral-900 hover:text-white"
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            aria-label="Next looks"
            onClick={() => lookApi?.scrollNext()}
            className="absolute -right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white text-neutral-900 shadow-md transition hover:bg-neutral-900 hover:text-white"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      </AppSection>

      <AppSection className="pt-0">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-serif text-2xl font-bold sm:text-3xl">Best Sellers</h2>
          <Link href="/sofas" className="inline-flex items-center gap-2 text-sm font-bold hover:underline">View all products <ArrowRight className="size-4" /></Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-5">
          {catalog.bestSellers.slice(0, 6).map((product, index) => (
            <BestSeller key={product.slug} product={product} index={index} />
          ))}
        </div>
      </AppSection>

      <section className="relative isolate overflow-hidden text-white">
        <AppImage
          src={siteImages.showroom}
          alt="Shany Living showroom consultation"
          className="absolute inset-0"
          sizes="100vw"
          objectPosition="30% center"
        />
        <div className="absolute inset-0 bg-black/55 lg:bg-linear-to-r lg:from-black/25 lg:via-black/40 lg:to-black/70" />
        <AppSection className="relative grid min-h-105 items-center lg:grid-cols-[1fr_480px]">
          <div className="hidden lg:block" />
          <motion.div className="text-center lg:text-left" {...fadeUp}>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl">Visit Our Showroom</h2>
            <p className="mt-5 flex items-center justify-center gap-2 text-sm lg:justify-start"><MapPin className="size-4" /> Herzl 34, Tel Aviv, Israel</p>
            <p className="mt-4 text-sm leading-6 text-white/90">Sun - Thu | 10:00 - 19:00<br />Fri | 10:00 - 14:00</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link href="/contact"><AppButton className="w-full sm:w-auto">Book a Consultation</AppButton></Link>
              <Link href="/contact">
                <AppButton variant="outline" className="w-full border-white bg-white/10 text-white backdrop-blur hover:bg-white hover:text-neutral-950 sm:w-auto">
                  Get Direction
                </AppButton>
              </Link>
            </div>
          </motion.div>
        </AppSection>
      </section>

      <section className="bg-white">
        <AppSection className="grid items-center gap-8 py-10 lg:grid-cols-[1.1fr_1fr_1.3fr]">
          <div>
            <h2 className="font-serif text-xl font-bold sm:text-2xl">Join the SHANY LIVING Club</h2>
            <p className="mt-2 text-sm text-neutral-700">Be the first to discover new collections, exclusive offers, and interior inspiration.</p>
          </div>
          <form className="flex w-full">
            <input aria-label="Email" placeholder="Enter your email" className="h-11 min-w-0 flex-1 rounded-l-md border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-900" />
            <button className="h-11 rounded-r-md bg-black px-5 text-sm font-semibold text-white transition hover:bg-neutral-800">Subscribe</button>
          </form>
          <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-3 sm:divide-x sm:divide-neutral-300">
            {clubPerks.map((perk) => (
              <span key={perk.text} className="flex items-center gap-2 sm:justify-center sm:px-3"><perk.icon className="size-5 shrink-0" /> {perk.text}</span>
            ))}
          </div>
        </AppSection>
      </section>

      <section className="border-y border-neutral-200 bg-neutral-100">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 sm:grid-cols-3 lg:grid-cols-6 lg:gap-0 lg:px-8">
          {features.map((feature, index) => (
            <div key={feature.title} className={`flex items-center gap-3 px-1 lg:px-3 ${index === features.length - 1 ? "" : "lg:border-r lg:border-neutral-300"}`}>
              <feature.icon className="size-6 shrink-0 stroke-[1.5]" />
              <div>
                <p className="text-xs font-bold">{feature.title}</p>
                <p className="text-[11px] text-neutral-600">{feature.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Link
        aria-label="WhatsApp consultation"
        href={whatsappHref}
        target={whatsappNumber ? "_blank" : undefined}
        className="fixed bottom-5 right-5 z-40 grid size-13 place-items-center rounded-full bg-[#25d366] text-white shadow-lg transition hover:scale-105 sm:bottom-6 sm:right-6 sm:size-14"
      >
        <WhatsappIcon className="size-7" />
      </Link>
    </>
  );
}
