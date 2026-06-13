"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/language-context";
import { CookingPot, Coffee, Utensils, ChevronRight } from "lucide-react";
import { categories } from "@/lib/data";

const categoryIcons: Record<string, React.ElementType> = {
  cookware: CookingPot,
  "small-appliances": Coffee,
  tableware: Utensils,
  electronics: CookingPot,
  "home-appliances": Coffee,
  "phones-tablets": Utensils,
};

export function CategoryGrid() {
  const { language, t } = useLanguage();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-[#111111] font-[family-name:var(--font-montserrat)]">
            {t.categories}
          </h2>
          <p className="mt-2 text-[#666666]">
            {language === "so"
              ? "Dooro qaybta aad rabto"
              : "Browse our product categories"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.slug || ""] || CookingPot;
            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className="group relative overflow-hidden rounded-2xl transition-transform duration-300 hover:scale-[1.02] bg-white border border-[#E5E5E5] hover:shadow-lg"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={cat.image || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400"}
                    alt={language === "so" ? cat.name_so : cat.name_en}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <Icon className="h-5 w-5 text-[#E60000]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#111111]">
                      {language === "so" ? cat.name_so : cat.name_en}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-[#E60000] text-sm font-medium">
                    <span>{t.shopNow}</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
