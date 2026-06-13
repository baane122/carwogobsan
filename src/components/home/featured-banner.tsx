"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Award, ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/language-context";
import { AnimatedSection } from "./animated-section";

export default function FeaturedCollectionBanner() {
  const { language } = useLanguage();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="relative overflow-hidden rounded-3xl bg-[#111111]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E60000]/20 via-transparent to-[#B30000]/10" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#E60000]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E60000]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 sm:p-12 lg:p-16 items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#E60000]/20 px-4 py-1.5 text-sm font-medium text-[#FF3333] mb-6">
                  <Award className="h-4 w-4" />
                  {language === "so" ? "Qayb Gaar ah" : "Featured Collection"}
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight font-[family-name:var(--font-montserrat)]">
                  {language === "so"
                    ? "Qalabka Cuntada Casriga ah"
                    : "Modern Kitchen Essentials"}
                </h2>
                <p className="mt-4 text-white/60 text-lg max-w-md">
                  {language === "so"
                    ? "Soo koobayso qalabka cuntada ee ugu fiican oo ku habboon gurigaaga casriga ah."
                    : "Curated selection of premium cookware and appliances for the modern Somali home."}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#E60000] px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#B30000] hover:shadow-lg hover:shadow-[#E60000]/20"
                  >
                    {language === "so" ? "Iibso Hadda" : "Shop Collection"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden">
                <Image
                  src="/images/featured/featured-collection-banner.png"
                  alt="Modern Kitchen"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/50 to-transparent" />
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
