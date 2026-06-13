"use client";

import React from "react";
import { Truck, Shield, CreditCard, Zap, Headphones } from "lucide-react";
import { useLanguage } from "@/components/language-context";

export default function PremiumTrustBar() {
  const { t } = useLanguage();

  const items = [
    { icon: Truck, label: t.freeDelivery, description: "In Hargeisa" },
    { icon: Shield, label: t.qualityGuarantee, description: "100% Verified" },
    { icon: CreditCard, label: t.cashOnDelivery, description: "Pay on Arrival" },
    { icon: Zap, label: t.fastShipping, description: "Same Day" },
    { icon: Headphones, label: t.customerSupport, description: "Always Available" },
  ];

  return (
    <div className="relative bg-[#111111] py-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#E60000]/10 via-transparent to-[#E60000]/10" />
      <div className="relative flex">
        <div className="animate-marquee flex shrink-0 gap-12 whitespace-nowrap">
          {[...items, ...items, ...items, ...items].map((item, index) => (
            <div key={index} className="flex items-center gap-3 text-white/90">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E60000]/20">
                <item.icon className="h-4 w-4 text-[#FF3333]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{item.label}</span>
                <span className="text-xs text-white/50">{item.description}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="animate-marquee flex shrink-0 gap-12 whitespace-nowrap" aria-hidden="true">
          {[...items, ...items, ...items, ...items].map((item, index) => (
            <div key={index} className="flex items-center gap-3 text-white/90">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E60000]/20">
                <item.icon className="h-4 w-4 text-[#FF3333]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{item.label}</span>
                <span className="text-xs text-white/50">{item.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
