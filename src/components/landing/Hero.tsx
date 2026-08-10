"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { AppButton } from "@/components/app/AppButton";
import { SiteIcon } from "@/components/icons/SiteIcon";

export function Hero() {
  return (
    <section className="relative min-h-[78vh] overflow-hidden bg-[#eee8df]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(255,255,255,.9),transparent_35%)]" />
      <div className="relative mx-auto grid min-h-[78vh] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-neutral-600">Furniture designed around you</p>
          <h1 className="max-w-xl text-5xl font-semibold leading-[1.05] tracking-tight text-neutral-950 sm:text-6xl">A sofa made for your home.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-600">Choose your model, size, structure, fabric and color. Our team will help you complete the perfect selection through WhatsApp.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/sofas"><AppButton size="lg">Customize Your Sofa <SiteIcon name="arrow-right" className="ml-2 size-4" /></AppButton></Link>
            <Link href="/sofas"><AppButton size="lg" variant="outline">Explore Collection</AppButton></Link>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="aspect-[4/5] rounded-[2rem] bg-gradient-to-br from-[#cdbba4] via-[#e6d8c7] to-[#a48d73] shadow-2xl" />
      </div>
    </section>
  );
}
