"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Star,
  Percent,
  Heart,
  Eye,
  ShoppingCart,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/language-context";
import { useCartStore } from "@/lib/store";
import { AnimatedSection } from "./animated-section";
import type { Product } from "@/lib/insforge";

interface TrendingProductsProps {
  products: Product[];
}

export default function TrendingProductsCarousel({ products }: TrendingProductsProps) {
  const { language, t } = useLanguage();
  const addItem = useCartStore((state) => state.addItem);
  const [activeIndex, setActiveIndex] = useState(0);

  const trendingProducts = products.filter((p) => p.featured).slice(0, 8);

  const scrollTo = useCallback(
    (direction: "left" | "right") => {
      if (direction === "left") {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : trendingProducts.length - 1));
      } else {
        setActiveIndex((prev) => (prev < trendingProducts.length - 1 ? prev + 1 : 0));
      }
    },
    [trendingProducts.length]
  );

  const getVisibleProducts = () => {
    const visible = [];
    for (let i = 0; i < 4; i++) {
      const idx = (activeIndex + i) % trendingProducts.length;
      visible.push({ ...trendingProducts[idx], displayIndex: i });
    }
    return visible;
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection className="flex items-end justify-between mb-12">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#E60000]/10 px-4 py-1.5 text-sm font-medium text-[#E60000] mb-4">
              <TrendingUpIcon />
              {language === "so" ? "Ugu Caansan" : "Trending Now"}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] font-[family-name:var(--font-montserrat)]">
              {language === "so" ? "Alaab Ugu Fiican" : "Trending Products"}
            </h2>
          </div>
          <div className="hidden sm:flex gap-3">
            <button
              onClick={() => scrollTo("left")}
              className="p-3 rounded-full border border-[#E5E5E5] hover:border-[#E60000] hover:text-[#E60000] transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scrollTo("right")}
              className="p-3 rounded-full border border-[#E5E5E5] hover:border-[#E60000] hover:text-[#E60000] transition-all duration-300"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </AnimatedSection>

        <div className="relative overflow-hidden">
          <div className="flex gap-6 transition-transform duration-500 ease-out">
            {getVisibleProducts().map((product, idx) => (
              <motion.div
                key={`${product.id}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0"
              >
                <div className="group relative bg-[#F9F9F9] rounded-2xl overflow-hidden border border-[#E5E5E5] hover:border-[#E60000]/30 transition-all duration-500 hover:shadow-xl hover:shadow-[#E60000]/5 hover:-translate-y-1">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={language === "so" ? product.name_so : product.name_en}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-[#E60000] px-2 py-1 text-xs font-bold text-white">
                          <Percent className="h-3 w-3" />
                          {Math.round(
                            ((product.originalPrice - product.price) / product.originalPrice) * 100
                          )}%
                        </span>
                      )}
                      {product.featured && (
                        <span className="inline-flex items-center rounded-lg bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-semibold text-[#111111]">
                          <Star className="h-3 w-3 text-[#E60000] mr-1 fill-[#E60000]" />
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      <button className="p-2.5 rounded-full bg-white/90 backdrop-blur-sm text-[#111111] hover:text-[#E60000] hover:bg-white transition-all duration-300 shadow-sm">
                        <Heart className="h-4 w-4" />
                      </button>
                      <button className="p-2.5 rounded-full bg-white/90 backdrop-blur-sm text-[#111111] hover:text-[#E60000] hover:bg-white transition-all duration-300 shadow-sm">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < (product.rating || 5)
                              ? "text-[#E60000] fill-[#E60000]"
                              : "text-[#E5E5E5]"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-[#8A8A8A] ml-1">
                        ({product.reviewCount || 0})
                      </span>
                    </div>
                    <h3 className="font-semibold text-[#111111] group-hover:text-[#E60000] transition-colors duration-300 line-clamp-2 min-h-[48px]">
                      {language === "so" ? product.name_so : product.name_en}
                    </h3>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-lg font-bold text-[#E60000]">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-[#8A8A8A] line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        addItem({
                          id: product.id,
                          name: product.name_en,
                          nameSo: product.name_so,
                          price: product.price,
                          image: product.image,
                          category: product.category,
                        });
                      }}
                      className="mt-4 w-full py-2.5 rounded-xl bg-[#111111] text-white text-sm font-semibold hover:bg-[#E60000] transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {t.addToCart}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {trendingProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-8 bg-[#E60000]"
                  : "w-2 bg-[#E5E5E5] hover:bg-[#E60000]/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TrendingUpIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
