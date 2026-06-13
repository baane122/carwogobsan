"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CookingPot,
  Coffee,
  Utensils,
  Smartphone,
  Tv,
  Refrigerator,
} from "lucide-react";
import { Sparkles, ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/language-context";
import { AnimatedSection, StaggerContainer, StaggerItem } from "./animated-section";
import type { Category } from "@/lib/insforge";

interface CategoryGridProps {
  categories: Category[];
}

export default function PremiumCategoryGrid({ categories }: CategoryGridProps) {
  const { language, t } = useLanguage();

  const categoryIcons: Record<string, React.ElementType> = {
    cookware: CookingPot,
    "small-appliances": Coffee,
    tableware: Utensils,
    electronics: Tv,
    "home-appliances": Refrigerator,
    "phones-tablets": Smartphone,
  };

  // Fallback image for categories without images
  const fallbackCategoryImage = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400";

  // Handle empty state
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F9F9F9]">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#E60000]/10 px-4 py-1.5 text-sm font-medium text-[#E60000] mb-4">
            <Sparkles className="h-4 w-4" />
            {language === "so" ? "Qaybaha Alaabta" : "Our Categories"}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] font-[family-name:var(--font-montserrat)]">
            {t.categories}
          </h2>
          <p className="mt-4 text-[#8A8A8A] max-w-xl mx-auto text-lg">
            {language === "so"
              ? "Dooro qaybta aad rabto oo soo koobayso alaab tayo sare leh"
              : "Browse our curated collection of premium kitchenware and home essentials"}
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.slug || ""] || CookingPot;
            return (
              <StaggerItem key={cat.id}>
                <Link
                  href={`/products?category=${cat.id}`}
                  className="group relative block overflow-hidden rounded-2xl bg-white border border-[#E5E5E5] hover:border-[#E60000]/30 transition-all duration-500 hover:shadow-xl hover:shadow-[#E60000]/5 hover:-translate-y-1"
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={cat.image || fallbackCategoryImage}
                      alt={language === "so" ? cat.name_so : cat.name_en}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-[#111111]/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                    <div className="absolute bottom-4 left-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm mb-2 group-hover:bg-[#E60000] transition-colors duration-300">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-[#111111] group-hover:text-[#E60000] transition-colors duration-300">
                      {language === "so" ? cat.name_so : cat.name_en}
                    </h3>
                    <div className="mt-2 flex items-center gap-1 text-[#E60000] text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0">
                      <span>{t.shopNow}</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
