import React, { Suspense } from "react";
import { getCategories, getFeaturedProducts } from "@/lib/api";
import PremiumHero from "@/components/home/hero-section";
import PremiumTrustBar from "@/components/home/trust-bar";
import PremiumCategoryGrid from "@/components/home/category-grid";
import TrendingProductsCarousel from "@/components/home/trending-products";
import FeaturedCollectionBanner from "@/components/home/featured-banner";
import TrustBadgesSection from "@/components/home/trust-badges";
import StatsSection from "@/components/home/stats-section";
import { products } from "@/lib/data";

// Loading fallback components
function HeroLoading() {
  return <div className="min-h-screen bg-[#111111] animate-pulse" />;
}

function CategoriesLoading() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F9F9F9]">
      <div className="mx-auto max-w-7xl">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-4" />
        <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mx-auto mb-16" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductsLoading() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-12" />
        <div className="flex gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-full sm:w-1/2 lg:w-1/4 h-80 bg-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Fetch data on the server
async function getHomeData() {
  try {
    const [categories, featuredProducts] = await Promise.all([
      getCategories(),
      getFeaturedProducts(),
    ]);

    return { categories, featuredProducts };
  } catch (error) {
    console.error("[Home] Failed to fetch data:", error);
    // Fallback to static data
    return {
      categories: [],
      featuredProducts: products.filter((p) => p.featured),
    };
  }
}

export default async function HomePage() {
  const { categories, featuredProducts } = await getHomeData();

  return (
    <main className="flex-1">
      <Suspense fallback={<HeroLoading />}>
        <PremiumHero />
      </Suspense>

      <PremiumTrustBar />

      <Suspense fallback={<CategoriesLoading />}>
        <PremiumCategoryGrid categories={categories} />
      </Suspense>

      <Suspense fallback={<ProductsLoading />}>
        <TrendingProductsCarousel products={featuredProducts} />
      </Suspense>

      <FeaturedCollectionBanner />

      <TrustBadgesSection />

      <StatsSection />
    </main>
  );
}
