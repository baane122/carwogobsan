"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200",
        className
      )}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl bg-white border border-[#E5E5E5] overflow-hidden">
      {/* Image skeleton */}
      <Skeleton className="aspect-square w-full" />
      
      {/* Content skeleton */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category */}
        <Skeleton className="h-3 w-20 mb-2" />
        
        {/* Title */}
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        
        {/* Rating */}
        <Skeleton className="h-3 w-24 mb-3" />
        
        {/* Price */}
        <Skeleton className="h-6 w-20 mb-3" />
        
        {/* Stock indicator */}
        <Skeleton className="h-3 w-16 mb-3" />
        
        {/* Button */}
        <Skeleton className="h-10 w-full mt-auto" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Skeleton className="w-20 h-20 rounded-full" />
      <Skeleton className="h-4 w-16" />
    </div>
  );
}

export function OrderRowSkeleton() {
  return (
    <tr className="border-b border-[#E5E5E5]">
      <td className="py-4 px-4"><Skeleton className="h-4 w-8" /></td>
      <td className="py-4 px-4"><Skeleton className="h-4 w-32" /></td>
      <td className="py-4 px-4"><Skeleton className="h-4 w-24" /></td>
      <td className="py-4 px-4"><Skeleton className="h-4 w-20" /></td>
      <td className="py-4 px-4"><Skeleton className="h-4 w-16" /></td>
      <td className="py-4 px-4"><Skeleton className="h-4 w-20" /></td>
      <td className="py-4 px-4"><Skeleton className="h-8 w-24" /></td>
    </tr>
  );
}

export function ProductRowSkeleton() {
  return (
    <tr className="border-b border-[#E5E5E5]">
      <td className="py-4 px-4"><Skeleton className="h-4 w-8" /></td>
      <td className="py-4 px-4"><Skeleton className="h-12 w-12 rounded" /></td>
      <td className="py-4 px-4"><Skeleton className="h-4 w-32" /></td>
      <td className="py-4 px-4"><Skeleton className="h-4 w-20" /></td>
      <td className="py-4 px-4"><Skeleton className="h-4 w-16" /></td>
      <td className="py-4 px-4"><Skeleton className="h-4 w-16" /></td>
      <td className="py-4 px-4"><Skeleton className="h-8 w-20" /></td>
      <td className="py-4 px-4"><Skeleton className="h-8 w-24" /></td>
    </tr>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[600px] bg-[#F9F9F9]">
      <Skeleton className="absolute inset-0" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="max-w-xl">
          <Skeleton className="h-16 w-full mb-4" />
          <Skeleton className="h-6 w-3/4 mb-6" />
          <Skeleton className="h-12 w-40" />
        </div>
      </div>
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="flex gap-4 p-4 border border-[#E5E5E5] rounded-xl">
      <Skeleton className="w-24 h-24 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
      <Skeleton className="h-8 w-20" />
    </div>
  );
}

export function SettingsFormSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div>
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div>
        <Skeleton className="h-4 w-28 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  );
}
