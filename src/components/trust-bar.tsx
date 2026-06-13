"use client";

import { useLanguage } from "@/components/language-context";
import { Truck, Shield, CreditCard, Zap, Headphones } from "lucide-react";

export function TrustBar() {
  const { t } = useLanguage();

  const items = [
    { icon: Truck, label: t.freeDelivery },
    { icon: Shield, label: t.qualityGuarantee },
    { icon: CreditCard, label: t.cashOnDelivery },
    { icon: Zap, label: t.fastShipping },
    { icon: Headphones, label: t.customerSupport },
  ];

  return (
    <div className="w-full overflow-hidden bg-[#111111] py-3">
      <div className="relative flex">
        <div className="animate-marquee flex shrink-0 gap-8 whitespace-nowrap">
          {[...items, ...items, ...items, ...items].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-white/90"
            >
              <item.icon className="h-4 w-4 text-[#E60000]" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="animate-marquee flex shrink-0 gap-8 whitespace-nowrap" aria-hidden="true">
          {[...items, ...items, ...items, ...items].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-white/90"
            >
              <item.icon className="h-4 w-4 text-[#E60000]" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
