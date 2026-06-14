"use client";

import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/components/language-context";
import { ProductCard } from "@/components/product-card";
import { ProductListSkeleton } from "@/components/skeletons/product-list-skeleton";
import { Filter } from "lucide-react";
import { fetchProducts, fetchProductsByCategory, fetchCategories } from "@/lib/insforge";
import { products as staticProducts, categories as staticCategories } from "@/lib/data";
import type { Product, Category } from "@/lib/insforge";

export default function ProductsPage() {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch products and categories on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);
        // Use static data as fallback if API returns empty
        setProducts(productsData.length > 0 ? productsData.filter(p => p.active !== false) : staticProducts);
        setCategories(categoriesData.length > 0 ? categoriesData : staticCategories);
      } catch {
        // On error, use static data
        setProducts(staticProducts);
        setCategories(staticCategories);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Fetch products when category changes
  useEffect(() => {
    async function loadCategoryProducts() {
      if (selectedCategory === "all") {
        const allProducts = await fetchProducts();
        setProducts(allProducts.length > 0 ? allProducts.filter(p => p.active !== false) : staticProducts);
      } else {
        const categoryProducts = await fetchProductsByCategory(selectedCategory);
        setProducts(categoryProducts.length > 0 ? categoryProducts.filter(p => p.active !== false) : staticProducts.filter(p => p.category_id === selectedCategory));
      }
    }
    if (!loading) {
      loadCategoryProducts();
    }
  }, [selectedCategory, loading]);

  // Filter products by search query
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        searchQuery === "" ||
        product.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.name_so.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [products, searchQuery]);

  // Loading state with skeletons
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="h-10 w-48 bg-[#E5E5E5] rounded-lg animate-pulse mb-2" />
            <div className="h-5 w-32 bg-[#E5E5E5] rounded-lg animate-pulse" />
          </div>
          {/* Filters skeleton */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-9 w-24 bg-[#E5E5E5] rounded-full animate-pulse" />
            ))}
          </div>
          {/* Products grid skeleton */}
          <ProductListSkeleton count={8} columns={4} />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] pt-20 pb-16 flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <p className="text-red-600 text-lg font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-[#E60000] text-white rounded-lg hover:bg-[#cc0000] transition-colors"
          >
            {language === "so" ? "Isku day mar kale" : "Try Again"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111111] font-['Montserrat']">
            {t.products}
          </h1>
          <p className="text-[#666666] mt-2">
            {filteredProducts.length} {language === "so" ? "alaabood oo la heli karo" : "products available"}
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder={language === "so" ? "Raadi alaab..." : "Search products..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-[#E5E5E5] hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-5 h-5" />
            {language === "so" ? "Filtrada" : "Filters"}
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
            {language === "so" ? "Dhammaan" : "All"}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? "bg-red-600 text-white"
                  : "bg-white text-[#666666] border border-[#E5E5E5] hover:bg-gray-50"
              }`}
            >
              {language === "so" && cat.name_so ? cat.name_so : cat.name_en}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
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

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 animate-fadeIn">
            <p className="text-[#666666]">
              {language === "so" ? "Ma jiro alaab la mid ah" : "No products found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
