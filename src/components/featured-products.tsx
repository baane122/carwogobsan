"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-context";
import { ProductCard } from "@/components/product-card";
import { ArrowRight } from "lucide-react";
import { products } from "@/lib/data";

export function FeaturedProducts() {
  const { t } = useLanguage();
  
  // Use real products from Insforge data, filter featured ones
  const featuredProducts = products
    .filter((p) => p.featured)
    .map((p) => ({
      id: p.id,
      name: p.name_en,
      nameSo: p.name_so,
      price: p.price,
      originalPrice: p.originalPrice,
      image: p.image,
      category: p.category || "General",
      rating: p.rating || 5,
      reviewCount: p.reviewCount || 0,
      inStock: p.stock > 0,
    }));

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-[#111111] font-[family-name:var(--font-montserrat)]">
              {t.featuredProducts}
            </h2>
            <p className="mt-2 text-[#666666]">
              Handpicked just for you
            </p>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-[#E60000] hover:underline"
          >
            {t.shopNow}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-lg bg-[#E60000] px-6 py-3 text-sm font-semibold text-white hover:bg-[#CC0000] transition-colors"
          >
            {t.shopNow}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}