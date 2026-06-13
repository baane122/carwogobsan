"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, MessageCircle, MapPin, Truck, Building, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/components/language-context";
import { useCartStore } from "@/lib/store";

const hargeisaDistricts = [
  { id: "new-hargeisa", label: "New Hargeisa", deliveryFee: 3 },
  { id: "golis", label: "Golis", deliveryFee: 3 },
  { id: "26-june", label: "26 June", deliveryFee: 3 },
  { id: "mohamed-moge", label: "Mohamed Moge", deliveryFee: 4 },
  { id: "airport", label: "Airport Area", deliveryFee: 4 },
  { id: "shaab", label: "Sha'ab Area", deliveryFee: 3 },
  { id: "dabaruq", label: "Dabaruq", deliveryFee: 5 },
  { id: "other", label: "Other Area", deliveryFee: 5 },
];

export default function CartPage() {
  const { t } = useLanguage();
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore();
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery");
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration to avoid SSR mismatch with persisted cart
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const district = hargeisaDistricts.find((d) => d.id === selectedDistrict);
  const subtotal = getTotalPrice();
  const deliveryFee = deliveryMethod === "pickup" ? 0 : (district?.deliveryFee || 0);
  const total = subtotal + deliveryFee;

  const generateWhatsAppMessage = () => {
    let message = "Hello! I'd like to place an order:\n\n";
    items.forEach((item, i) => {
      message += `${i + 1}. ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
    });
    message += `\nSubtotal: $${subtotal.toFixed(2)}`;
    message += `\nDelivery: $${deliveryFee.toFixed(2)}`;
    message += `\nTotal: $${total.toFixed(2)}`;
    if (deliveryMethod === "delivery" && district) {
      message += `\n\nDelivery to: ${district.label}`;
    } else {
      message += `\n\nPickup from: Suuqa Hadhwanaag Mall, Hargeisa`;
    }
    return encodeURIComponent(message);
  };

  // Loading state while hydrating
  if (!isHydrated) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E60000] mx-auto mb-4" />
          <p className="text-[#666666]">{t.loading}</p>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#E60000]/10">
            <ShoppingBag className="h-12 w-12 text-[#E60000]" />
          </div>
          <h1 className="text-2xl font-bold text-[#111111] mb-4">{t.yourCart}</h1>
          <p className="text-[#666666] mb-8">{t.emptyCart}</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-[#E60000] px-8 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#cc0000]"
          >
            {t.continueShopping}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-[#111111] mb-8 font-[family-name:var(--font-montserrat)]">
          {t.yourCart}
          <span className="ml-2 text-sm font-normal text-[#666666]">
            ({items.length} {t.itemsInCart})
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-4 p-4 bg-white rounded-xl border border-[#E5E5E5] hover:border-[#E60000]/20 transition-colors"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#F9F9F9] shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.id}`}
                      className="text-sm font-semibold text-[#111111] hover:text-[#E60000] line-clamp-2 transition-colors"
                    >
                      {item.name}
                    </Link>
                    {item.category && (
                      <p className="text-xs text-[#666666] mt-1">{item.category}</p>
                    )}
                    <p className="text-lg font-bold text-[#E60000] mt-1">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-[#666666] hover:text-[#E60000] transition-colors rounded-lg hover:bg-[#E60000]/5"
                      aria-label={t.remove}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="flex items-center border border-[#E5E5E5] rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 py-1 text-sm min-w-[40px] text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <button
              onClick={clearCart}
              className="text-sm text-[#666666] hover:text-[#E60000] transition-colors underline underline-offset-2"
            >
              {t.clearCart}
            </button>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Location Selector */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
              <h3 className="font-semibold text-[#111111] mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#E60000]" />
                {t.deliveryLocation}
              </h3>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full rounded-lg border border-[#E5E5E5] px-3 py-2.5 text-sm focus:border-[#E60000] focus:outline-none focus:ring-1 focus:ring-[#E60000] transition-colors"
              >
                <option value="">{t.selectLocation}</option>
                {hargeisaDistricts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label} (+${d.deliveryFee})
                  </option>
                ))}
              </select>
            </div>

            {/* Delivery Method */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
              <h3 className="font-semibold text-[#111111] mb-4 flex items-center gap-2">
                <Truck className="h-4 w-4 text-[#E60000]" />
                {t.deliveryMethod}
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setDeliveryMethod("delivery")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 ${
                    deliveryMethod === "delivery"
                      ? "border-[#E60000] bg-[#E60000]/5"
                      : "border-[#E5E5E5] hover:border-[#E60000]/50"
                  }`}
                >
                  <Truck className="h-5 w-5 text-[#E60000]" />
                  <div className="text-left">
                    <span className="block text-sm font-medium">{t.homeDelivery}</span>
                    <span className="text-xs text-[#666666]">${deliveryFee.toFixed(2)} {t.deliveryFee.toLowerCase()}</span>
                  </div>
                </button>
                <button
                  onClick={() => setDeliveryMethod("pickup")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 ${
                    deliveryMethod === "pickup"
                      ? "border-[#E60000] bg-[#E60000]/5"
                      : "border-[#E5E5E5] hover:border-[#E60000]/50"
                  }`}
                >
                  <Building className="h-5 w-5 text-[#E60000]" />
                  <div className="text-left">
                    <span className="block text-sm font-medium">{t.pickup}</span>
                    <span className="text-xs text-[#666666]">{t.pickupAddress}</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
              <h3 className="font-semibold text-[#111111] mb-4">{t.orderSummary}</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#666666]">{t.subtotal}</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">{t.deliveryFee}</span>
                  <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-[#E5E5E5] pt-3 flex justify-between">
                  <span className="font-semibold text-[#111111]">{t.total}</span>
                  <span className="font-bold text-lg text-[#E60000]">${total.toFixed(2)}</span>
                </div>
              </div>

              <a
                href={`https://wa.me/252633800999?text=${generateWhatsAppMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full flex items-center justify-center gap-2 rounded-lg bg-[#10B981] px-6 py-3 text-sm font-semibold text-white hover:bg-[#059669] transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                {t.checkoutViaWhatsApp}
              </a>

              <p className="mt-4 text-xs text-center text-[#666666]">
                {t.whatsappRedirect}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
