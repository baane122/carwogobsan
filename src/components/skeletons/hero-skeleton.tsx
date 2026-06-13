"use client";

export function HeroSkeleton() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#111111]">
      <div className="absolute inset-0 bg-gradient-to-r from-[#111111]/90 via-[#111111]/60 to-[#111111]/30" />
      <div className="relative z-10 flex items-center min-h-screen pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl space-y-6">
            <div className="h-6 w-32 bg-white/10 rounded-full animate-pulse" />
            <div className="h-16 w-full bg-white/10 rounded-lg animate-pulse" />
            <div className="h-16 w-3/4 bg-white/10 rounded-lg animate-pulse" />
            <div className="h-6 w-full bg-white/10 rounded-lg animate-pulse" />
            <div className="h-6 w-2/3 bg-white/10 rounded-lg animate-pulse" />
            <div className="flex flex-wrap gap-4 mt-10">
              <div className="h-12 w-40 bg-white/10 rounded-xl animate-pulse" />
              <div className="h-12 w-40 bg-white/10 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
