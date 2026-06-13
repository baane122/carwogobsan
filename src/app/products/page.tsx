"use client";

import { useState, Suspense } from "react";
import { useLanguage } from "@/components/language-context";
import { ProductCard } from "@/components/product-card";
import { Filter } from "lucide-react";
import { products as staticProducts, categories as staticCategories } from "@/lib/data";
import type { Product } from "@/lib/insforge";

function ProductsPageContent({
  initialProducts,
  initialCategories,
}: {
  initialProducts: Product[];
  initialCategories: typeof staticCategories;
}) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Filter products
  const filteredProducts = initialProducts.filter((product) => {
    const matchesSearch =
      searchQuery === "" ||
      product.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.name_so.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = filteredProducts;

  return (
    <div className="min-h-screen bg-[#F9F9F9] pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111111] font-['Montserrat']">
            {t.products}
          </h1>
          <p className="text-[#666666] mt-2">
            {sortedProducts.length} products available
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-[#E5E5E5] hover:bg-gray-50"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === "all"
                ? "bg-red-600 text-white"
                : "bg-white text-[#666666] border border-[#E5E5E5] hover:bg-gray-50"
            }`}
          >
            All
          </button>
          {initialCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? "bg-red-600 text-white"
                  : "bg-white text-[#666666] border border-[#E5E5E5] hover:bg-gray-50"
              }`}
            >
              {cat.name_en}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name_en}
              nameSo={product.name_so}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.image}
              category={product.category}
              rating={product.rating}
              reviewCount={product.reviewCount}
              inStock={product.stock > 0}
            />
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#666666]">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Server component wrapper
export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-20 flex items-center justify-center">Loading products...</div>}>
      <ProductsPageContent
        initialProducts={staticProducts}
        initialCategories={staticCategories}
      />
    </Suspense>
  );
}
