"use client";

import { Suspense, lazy } from "react";
import { HeroSkeleton } from "./skeletons/hero-skeleton";

const PremiumHero = lazy(() => import("./home/hero-section"));

export function LazyHero() {
  return (
    <Suspense fallback={<HeroSkeleton />}>
      <PremiumHero />
    </Suspense>
  );
}
