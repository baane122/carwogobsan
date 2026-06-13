"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/language-context";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[600px] md:min-h-[700px] lg:min-h-screen">
      {/* Desktop: Split Screen */}
      <div className="hidden md:flex h-full min-h-[700px] lg:min-h-screen">
        {/* Left: Content */}
        <div className="flex w-1/2 flex-col justify-center px-8 lg:px-16 xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-lg"
          >
            <span className="inline-block rounded-full bg-[#E60000]/10 px-4 py-1.5 text-sm font-medium text-[#E60000] mb-6">
              New Arrivals
            </span>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-[#111111] leading-tight font-[family-name:var(--font-montserrat)]">
              {t.heroTitle}
            </h1>
            <p className="mt-4 text-lg lg:text-xl text-[#666666]">
              {t.heroSubtitle}
            </p>
            <p className="mt-4 text-base text-[#666666]/80">
              {t.heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/products" className="btn-primary gap-2">
                {t.shopNow}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/products" className="btn-secondary">
                {t.shopByCategory}
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right: Image */}
        <div className="relative w-1/2 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9a6?w=1200&h=800&fit=crop"
            alt="Shopping"
            fill
            className="object-cover"
            priority
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#F9F9F9]/20" />
        </div>
      </div>

      {/* Mobile: Full Width */}
      <div className="md:hidden relative min-h-[500px]">
        <Image
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9a6?w=800&h=600&fit=crop"
          alt="Shopping"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block rounded-full bg-[#E60000]/20 px-3 py-1 text-xs font-medium text-white mb-4">
              New Arrivals
            </span>
            <h1 className="text-3xl font-bold text-white leading-tight font-[family-name:var(--font-montserrat)]">
              {t.heroTitle}
            </h1>
            <p className="mt-3 text-base text-white/80">
              {t.heroSubtitle}
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#E60000] px-6 py-3 text-sm font-semibold text-white"
            >
              {t.shopNow}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
