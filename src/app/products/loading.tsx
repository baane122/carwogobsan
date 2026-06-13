export default function ProductsLoading() {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-xl bg-white border border-[#E5E5E5] overflow-hidden">
              <div className="aspect-square bg-[#E5E5E5] animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 bg-[#E5E5E5] rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-[#E5E5E5] rounded animate-pulse" />
                <div className="h-8 w-full bg-[#E5E5E5] rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
