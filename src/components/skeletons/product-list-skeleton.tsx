"use client";

import { ProductCardSkeleton } from "./product-card-skeleton";

interface ProductListSkeletonProps {
  count?: number;
  columns?: number;
}

export function ProductListSkeleton({ count = 8, columns = 4 }: ProductListSkeletonProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-${columns} gap-6`}>
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
