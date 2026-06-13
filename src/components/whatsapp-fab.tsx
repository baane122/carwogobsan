"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { getSetting } from "@/lib/insforge";

export function WhatsAppFAB() {
  const [phoneNumber, setPhoneNumber] = useState("+252633800999");

  useEffect(() => {
    async function loadWhatsAppNumber() {
      try {
        const setting = await getSetting("whatsapp_number");
        const value = setting?.value;
        if (value && typeof value === "object" && "number" in value && typeof value.number === "string") {
          setPhoneNumber(value.number);
        } else if (value && typeof value === "string") {
          setPhoneNumber(value);
        }
      } catch (error) {
        console.error("Error fetching WhatsApp number:", error);
      }
    }

    loadWhatsAppNumber();
  }, []);

  const whatsappLink = `https://wa.me/${phoneNumber.replace(/^\+/, "")}`;

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
