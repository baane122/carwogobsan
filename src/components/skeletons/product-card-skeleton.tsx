"use client";

export function ProductCardSkeleton() {
  return (
    <div className="group relative flex flex-col rounded-xl bg-white border border-[#E5E5E5] overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="relative aspect-square overflow-hidden bg-[#E5E5E5]">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>
      {/* Content skeleton */}
      <div className="flex flex-1 flex-col p-4 space-y-3">
        <div className="h-3 w-16 bg-[#E5E5E5] rounded" />
        <div className="h-4 w-full bg-[#E5E5E5] rounded" />
        <div className="h-4 w-3/4 bg-[#E5E5E5] rounded" />
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-3.5 w-3.5 rounded-full bg-[#E5E5E5]" />
          ))}
        </div>
        <div className="h-5 w-20 bg-[#E5E5E5] rounded" />
        <div className="h-2 w-12 bg-[#E5E5E5] rounded" />
        <div className="mt-auto h-10 w-full bg-[#E5E5E5] rounded-lg" />
      </div>
    </div>
  );
}
