"use client";

import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/language-context";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full text-center"
      >
        {/* 404 Illustration */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <span className="text-[120px] sm:text-[150px] font-black text-[#E60000]/10 leading-none font-[family-name:var(--font-montserrat)]">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="h-16 w-16 text-[#E60000]" />
            </div>
          </div>
        </motion.div>

        {/* Error Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#111111] mb-4 font-[family-name:var(--font-montserrat)]">
          {t.pageNotFound}
        </h1>

        {/* Error Description */}
        <p className="text-[#666666] mb-8 leading-relaxed max-w-md mx-auto">
          {t.pageNotFoundDesc}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E60000] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#B30000] active:scale-[0.98]"
          >
            <Home className="h-4 w-4" />
            {t.goHome}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#111111] bg-transparent px-6 py-3 text-sm font-semibold text-[#111111] transition-all hover:bg-[#111111] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.continueShopping}
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-10 pt-6 border-t border-[#E5E5E5]">
          <p className="text-sm text-[#666666] mb-4">
            {t.categories}:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              href="/products?category=electronics"
              className="px-3 py-1.5 text-xs font-medium bg-white border border-[#E5E5E5] rounded-lg text-[#666666] hover:border-[#E60000] hover:text-[#E60000] transition-colors"
            >
              {t.electronics}
            </Link>
            <Link
              href="/products?category=home-appliances"
              className="px-3 py-1.5 text-xs font-medium bg-white border border-[#E5E5E5] rounded-lg text-[#666666] hover:border-[#E60000] hover:text-[#E60000] transition-colors"
            >
              {t.homeAppliances}
            </Link>
            <Link
              href="/products?category=phones"
              className="px-3 py-1.5 text-xs font-medium bg-white border border-[#E5E5E5] rounded-lg text-[#666666] hover:border-[#E60000] hover:text-[#E60000] transition-colors"
            >
              {t.phones}
            </Link>
            <Link
              href="/products"
              className="px-3 py-1.5 text-xs font-medium bg-white border border-[#E5E5E5] rounded-lg text-[#666666] hover:border-[#E60000] hover:text-[#E60000] transition-colors"
            >
              {t.products}
            </Link>
          </div>
        </div>

        {/* Brand */}
        <div className="mt-8">
          <p className="text-xs text-[#999999]">
            CARWO GOBSAN - Premium E-Commerce in Hargeisa
          </p>
        </div>
      </motion.div>
    </div>
  );
}
