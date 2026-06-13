"use client";

import React from "react";
import { Award, Truck, Shield, Users } from "lucide-react";
import { useLanguage } from "@/components/language-context";
import { AnimatedSection, StaggerContainer, StaggerItem } from "./animated-section";

export default function TrustBadgesSection() {
  const { language } = useLanguage();

  const badges = [
    {
      icon: Award,
      title: language === "so" ? "Tayo Sare" : "Premium Quality",
      description: language === "so" ? "Alaab la soo koobay oo tayo sare leh" : "Handpicked products with guaranteed quality",
    },
    {
      icon: Truck,
      title: language === "so" ? "Gaarsiin Dhaqso Leh" : "Fast Delivery",
      description: language === "so" ? "Ku soo gudbinta Hargeisa oo dhaqso leh" : "Quick delivery across Hargeisa",
    },
    {
      icon: Shield,
      title: language === "so" ? "Dammaanad" : "Secure Payment",
      description: language === "so" ? "Lacag bixinta oo ammaan ah" : "Safe and secure payment options",
    },
    {
      icon: Users,
      title: language === "so" ? "Macaamiil Raalli ah" : "Happy Customers",
      description: language === "so" ? "Kumanaan macaamiil oo ku raalli ah" : "Thousands of satisfied customers",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F9F9F9]">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#E60000]/10 px-4 py-1.5 text-sm font-medium text-[#E60000] mb-4">
            <Shield className="h-4 w-4" />
            {language === "so" ? "Nagu Kalsoonow" : "Why Choose Us"}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] font-[family-name:var(--font-montserrat)]">
            {language === "so" ? "Sababta Naagu Dooran" : "Why Shop With Us"}
          </h2>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <StaggerItem key={index}>
              <div className="group text-center p-8 rounded-2xl bg-white border border-[#E5E5E5] hover:border-[#E60000]/30 transition-all duration-500 hover:shadow-xl hover:shadow-[#E60000]/5 hover:-translate-y-1">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E60000]/10 text-[#E60000] mb-6 group-hover:bg-[#E60000] group-hover:text-white transition-all duration-500">
                  <badge.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-[#111111] mb-2">
                  {badge.title}
                </h3>
                <p className="text-sm text-[#8A8A8A] leading-relaxed">
                  {badge.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
