/**
 * CARWO GOBSAN - Unified Data API
 * Fetches from Insforge backend with fallback to static data
 */

import {
  fetchCategories as fetchCategoriesFromApi,
  fetchProducts as fetchProductsFromApi,
  fetchFeaturedProducts as fetchFeaturedProductsFromApi,
  fetchProductById as fetchProductByIdFromApi,
} from "./insforge";
import { products as staticProducts, categories as staticCategories } from "./data";
import type { Product, Category } from "./insforge";

// Helper to enrich API products with static data fields (rating, reviewCount, originalPrice)
function enrichProduct(apiProduct: Product): Product {
  const staticProduct = staticProducts.find((p) => p.id === apiProduct.id);
  if (staticProduct) {
    return {
      ...apiProduct,
      rating: staticProduct.rating,
      reviewCount: staticProduct.reviewCount,
      originalPrice: staticProduct.originalPrice,
    };
  }
  return apiProduct;
}

// ===== CATEGORIES =====
export async function getCategories(): Promise<Category[]> {
  try {
    const apiCategories = await fetchCategoriesFromApi();
    if (apiCategories && apiCategories.length > 0) {
      return apiCategories;
    }
  } catch (error) {
    console.warn("[API] Failed to fetch categories from backend, using static data:", error);
  }
  return staticCategories;
}

// ===== PRODUCTS =====
export async function getProducts(): Promise<Product[]> {
  try {
    const apiProducts = await fetchProductsFromApi();
    if (apiProducts && apiProducts.length > 0) {
      return apiProducts.map(enrichProduct);
    }
  } catch (error) {
    console.warn("[API] Failed to fetch products from backend, using static data:", error);
  }
  return staticProducts;
}

// ===== FEATURED PRODUCTS =====
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const apiProducts = await fetchFeaturedProductsFromApi();
    if (apiProducts && apiProducts.length > 0) {
      return apiProducts.map(enrichProduct);
    }
  } catch (error) {
    console.warn("[API] Failed to fetch featured products from backend, using static data:", error);
  }
  return staticProducts.filter((p) => p.featured);
}

// ===== PRODUCT BY ID =====
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const apiProduct = await fetchProductByIdFromApi(id);
    if (apiProduct) {
      return enrichProduct(apiProduct);
    }
  } catch (error) {
    console.warn("[API] Failed to fetch product from backend, using static data:", error);
  }
  return staticProducts.find((p) => p.id === id) || null;
}

// ===== PRODUCTS BY CATEGORY =====
export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  try {
    const apiProducts = await fetchProductsFromApi();
    if (apiProducts && apiProducts.length > 0) {
      return apiProducts
        .filter((p) => p.category_id === categoryId)
        .map(enrichProduct);
    }
  } catch (error) {
    console.warn("[API] Failed to fetch products by category from backend, using static data:", error);
  }
  return staticProducts.filter((p) => p.category_id === categoryId);
}
