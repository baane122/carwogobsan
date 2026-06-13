"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/language-context";

export default function PremiumHero() {
  const { language, t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/images/hero/hero-slide-1-kitchenware.png",
      title: language === "so" ? "Qalabka Cuntada Tayo Sare" : "Premium Kitchen Essentials",
      subtitle: language === "so" ? "Ugu Fiican Hargeisa" : "The Best in Hargeisa",
      description:
        language === "so"
          ? "Soo hel qalabka cuntada ee ugu fiican oo ku habboon gurigaaga. Tayo iyo qiimo jaban."
          : "Discover premium cookware, appliances & tableware crafted for the modern Somali home.",
    },
    {
      image: "/images/hero/hero-slide-2-appliances.png",
      title: language === "so" ? "Qalabka Elektarooniga" : "Modern Appliances",
      subtitle: language === "so" ? "Fududeyn Ku Soo Dhow" : "Convenience Delivered",
      description:
        language === "so"
          ? "Qalabka guriga ee casriga ah oo kuu fududeeya shaqada guriga."
          : "Smart home appliances that make cooking and living effortless.",
    },
    {
      image: "/images/hero/hero-slide-3-tableware.png",
      title: language === "so" ? "Safkeeda Quruxda Badan" : "Elegant Tableware",
      subtitle: language === "so" ? "Qurux Qoyskaaga" : "Elevate Your Dining",
      description:
        language === "so"
          ? "Safkeeda oo qurux badan oo ku habboon cuntada qoyska iyo martida."
          : "Beautiful dinner sets and table accessories for every occasion.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <Image
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111111]/90 via-[#111111]/60 to-[#111111]/30" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex items-center min-h-screen pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-[#E60000]/20 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-[#FF3333] mb-6 border border-[#E60000]/20">
                  <Sparkles className="h-4 w-4" />
                  {slides[currentSlide].subtitle}
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight font-[family-name:var(--font-montserrat)]">
                  {slides[currentSlide].title}
                </h1>
                <p className="mt-6 text-lg lg:text-xl text-white/70 max-w-lg leading-relaxed">
                  {slides[currentSlide].description}
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#E60000] px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#B30000] hover:shadow-lg hover:shadow-[#E60000]/20 active:scale-[0.98]"
                  >
                    {t.shopNow}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/5 backdrop-blur-sm px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10 hover:border-white/50"
                  >
                    {t.shopByCategory}
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === currentSlide
                ? "w-10 bg-[#E60000]"
                : "w-6 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 right-10 z-20 hidden lg:flex flex-col items-center gap-2"
      >
        <span className="text-xs text-white/50 tracking-widest uppercase rotate-90 origin-center translate-y-8">
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
