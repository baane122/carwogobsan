"use client";

import React from "react";
import { useLanguage } from "@/components/language-context";
import { StaggerContainer, StaggerItem } from "./animated-section";

export default function StatsSection() {
  const { language } = useLanguage();

  const stats = [
    { value: "5,000+", label: language === "so" ? "Alaabta" : "Products" },
    { value: "10,000+", label: language === "so" ? "Macaamiil" : "Customers" },
    { value: "99%", label: language === "so" ? "Raallinimada" : "Satisfaction" },
    { value: "24/7", label: language === "so" ? "Taageero" : "Support" },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F9F9F9]">
      <div className="mx-auto max-w-7xl">
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StaggerItem key={index}>
              <div className="text-center p-6 rounded-2xl bg-white border border-[#E5E5E5] hover:border-[#E60000]/30 transition-all duration-300 hover:shadow-lg">
                <p className="text-3xl sm:text-4xl font-bold text-[#E60000] font-[family-name:var(--font-montserrat)]">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-[#8A8A8A]">{stat.label}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
