import React, { Suspense } from "react";
import { products as staticProducts, categories as staticCategories } from "@/lib/data";
import PremiumTrustBar from "@/components/home/trust-bar";
import PremiumCategoryGrid from "@/components/home/category-grid";
import FeaturedCollectionBanner from "@/components/home/featured-banner";
import TrustBadgesSection from "@/components/home/trust-badges";
import StatsSection from "@/components/home/stats-section";
import { LazyHero } from "@/components/lazy-hero";
import { LazyTrendingProducts } from "@/components/lazy-trending-products";
import { HeroSkeleton } from "@/components/skeletons/hero-skeleton";
import { ProductListSkeleton } from "@/components/skeletons/product-list-skeleton";

// Loading fallback components
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

// For static export, we use static data directly at build time
// This ensures the page renders without API calls during build
export default function HomePage() {
  // Use static data directly for static export
  const displayCategories = staticCategories;
  const displayFeaturedProducts = staticProducts.filter((p) => p.featured);

  return (
    <main className="flex-1">
      <Suspense fallback={<HeroSkeleton />}>
        <LazyHero />
      </Suspense>

      <PremiumTrustBar />

      <Suspense fallback={<CategoriesLoading />}>
        <PremiumCategoryGrid categories={displayCategories} />
      </Suspense>

      <Suspense fallback={<ProductListSkeleton count={4} columns={4} />}>
        <LazyTrendingProducts products={displayFeaturedProducts} />
      </Suspense>

      <FeaturedCollectionBanner />

      <TrustBadgesSection />

      <StatsSection />
    </main>
  );
}
