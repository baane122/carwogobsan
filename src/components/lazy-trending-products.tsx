"use client";

import { Suspense, lazy } from "react";
import { ProductListSkeleton } from "./skeletons/product-list-skeleton";
import type { Product } from "@/lib/insforge";

const TrendingProductsCarousel = lazy(() => import("./home/trending-products"));

interface LazyTrendingProductsProps {
  products: Product[];
}

export function LazyTrendingProducts({ products }: LazyTrendingProductsProps) {
  return (
    <Suspense fallback={<ProductListSkeleton count={4} columns={4} />}>
      <TrendingProductsCarousel products={products} />
    </Suspense>
  );
}
