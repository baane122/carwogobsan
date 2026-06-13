"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppFAB() {
  const whatsappLink = "https://wa.me/252633800999";

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#E60000] text-white shadow-lg transition-transform duration-200 hover:scale-110 hover:shadow-xl active:scale-95"
      aria-label="Chat on WhatsApp"
    >
      <span className="absolute inset-0 rounded-full bg-[#E60000] animate-ping opacity-20" />
      <MessageCircle className="h-6 w-6 relative z-10" />
    </a>
  );
}
