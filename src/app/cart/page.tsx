"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, MessageCircle, MapPin, Truck, Building, ShoppingBag, ShoppingCart, ArrowRight, Gift, Clock, Shield, Package } from "lucide-react";
import { useLanguage } from "@/components/language-context";
import { useCartStore } from "@/lib/store";
import { WhatsAppCheckoutModal } from "@/components/whatsapp-checkout-modal";

const hargeisaDistricts = [
  { id: "new-hargeisa", label: "New Hargeisa", deliveryFee: 1.5 },
  { id: "golis", label: "Golis", deliveryFee: 1.5 },
  { id: "26-june", label: "26 June", deliveryFee: 1.5 },
  { id: "mohamed-moge", label: "Mohamed Moge", deliveryFee: 1.5 },
  { id: "airport", label: "Airport Area", deliveryFee: 1.5 },
  { id: "shaab", label: "Sha'ab Area", deliveryFee: 1.5 },
  { id: "dabaruq", label: "Dabaruq", deliveryFee: 1.5 },
  { id: "jig-jiga-yar", label: "Jig Jiga Yar", deliveryFee: 1.5 },
  { id: "ahmed-dhagah", label: "Ahmed Dhagah", deliveryFee: 1.5 },
  { id: "ibrahim-kodbuur", label: "Ibrahim Kodbuur", deliveryFee: 1.5 },
  { id: "mohamed-ali", label: "Mohamed Ali", deliveryFee: 1.5 },
  { id: "indho-deero", label: "Indho Deero", deliveryFee: 1.5 },
  { id: "sheikh-nur", label: "Sheikh Nur", deliveryFee: 1.5 },
  { id: "state-house", label: "State House", deliveryFee: 1.5 },
  { id: "mothers-and-children", label: "Mothers & Children", deliveryFee: 1.5 },
  { id: "other", label: "Other Area", deliveryFee: 1.5 },
];

export default function CartPage() {
  const { language, t } = useLanguage();
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore();
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery");
  const [isHydrated, setIsHydrated] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Handle hydration to avoid SSR mismatch with persisted cart
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const district = hargeisaDistricts.find((d) => d.id === selectedDistrict);
  const subtotal = getTotalPrice();
  const deliveryFee = deliveryMethod === "pickup" ? 0 : (district?.deliveryFee || 0);
  const total = subtotal + deliveryFee;

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
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#E60000]/20 to-[#E60000]/5">
            <ShoppingBag className="h-12 w-12 text-[#E60000]" />
          </div>
          <h1 className="text-2xl font-bold text-[#111111] mb-4">{t.yourCart}</h1>
          <p className="text-[#666666] mb-8">{t.emptyCart}</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#E60000] to-[#cc0000] px-8 py-3 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#E60000]/30"
          >
            {t.continueShopping}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gradient-to-b from-[#F9F9F9] via-white to-[#F9F9F9]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#E60000] to-[#cc0000]">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#111111] font-[family-name:var(--font-montserrat)]">
              {t.yourCart}
            </h1>
          </div>
          <p className="text-[#666666] ml-13 pl-13">
            {items.length} {t.itemsInCart} • ${subtotal.toFixed(2)}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group flex gap-4 p-4 bg-white rounded-2xl border border-[#E5E5E5] hover:border-[#E60000]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#E60000]/5"
                >
                  {/* Product Image */}
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-[#F9F9F9] shrink-0 ring-1 ring-[#E5E5E5] group-hover:ring-[#E60000]/30 transition-all">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="96px"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.id}`}
                      className="text-sm font-semibold text-[#111111] hover:text-[#E60000] line-clamp-2 transition-colors"
                    >
                      {item.name}
                    </Link>
                    {item.category && (
                      <p className="text-xs text-[#666666] mt-1 flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        {item.category}
                      </p>
                    )}
                    <p className="text-lg font-bold text-[#E60000] mt-2">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-[#666666] hover:text-[#E60000] transition-colors rounded-xl hover:bg-[#E60000]/5"
                      aria-label={t.remove}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="flex items-center bg-[#F9F9F9] rounded-xl overflow-hidden border border-[#E5E5E5]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-2 text-sm hover:bg-white transition-colors text-[#666666] hover:text-[#E60000]"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 py-1 text-sm min-w-[40px] text-center font-bold text-[#111111]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-2 text-sm hover:bg-white transition-colors text-[#666666] hover:text-[#E60000]"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Clear Cart */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={clearCart}
              className="text-sm text-[#666666] hover:text-[#E60000] transition-colors underline underline-offset-2"
            >
              {t.clearCart}
            </motion.button>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            {/* Delivery Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-[#E5E5E5] p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="font-semibold text-[#111111] mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#E60000]" />
                {t.deliveryLocation}
              </h3>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full rounded-xl border border-[#E5E5E5] px-4 py-3 text-sm focus:border-[#E60000] focus:outline-none focus:ring-2 focus:ring-[#E60000]/20 transition-all bg-[#F9F9F9]"
              >
                <option value="">{t.selectLocation}</option>
                {hargeisaDistricts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label} (+${d.deliveryFee})
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Delivery Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl border border-[#E5E5E5] p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="font-semibold text-[#111111] mb-4 flex items-center gap-2">
                <Truck className="h-4 w-4 text-[#E60000]" />
                {t.deliveryMethod}
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setDeliveryMethod("delivery")}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                    deliveryMethod === "delivery"
                      ? "border-[#E60000] bg-gradient-to-r from-[#E60000]/5 to-transparent shadow-md shadow-[#E60000]/10"
                      : "border-[#E5E5E5] hover:border-[#E60000]/50"
                  }`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${deliveryMethod === "delivery" ? "bg-[#E60000] text-white" : "bg-[#F9F9F9] text-[#666666]"}`}>
                    <Truck className="h-5 w-5" />
                  </div>
                  <div className="text-left flex-1">
                    <span className="block text-sm font-semibold">{t.homeDelivery}</span>
                    <span className="text-xs text-[#666666]">${deliveryFee.toFixed(2)} {t.deliveryFee.toLowerCase()}</span>
                  </div>
                  {deliveryMethod === "delivery" && (
                    <div className="h-5 w-5 rounded-full bg-[#E60000] flex items-center justify-center">
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
                <button
                  onClick={() => setDeliveryMethod("pickup")}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                    deliveryMethod === "pickup"
                      ? "border-[#E60000] bg-gradient-to-r from-[#E60000]/5 to-transparent shadow-md shadow-[#E60000]/10"
                      : "border-[#E5E5E5] hover:border-[#E60000]/50"
                  }`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${deliveryMethod === "pickup" ? "bg-[#E60000] text-white" : "bg-[#F9F9F9] text-[#666666]"}`}>
                    <Building className="h-5 w-5" />
                  </div>
                  <div className="text-left flex-1">
                    <span className="block text-sm font-semibold">{t.pickup}</span>
                    <span className="text-xs text-[#666666]">{t.pickupAddress}</span>
                  </div>
                  {deliveryMethod === "pickup" && (
                    <div className="h-5 w-5 rounded-full bg-[#E60000] flex items-center justify-center">
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-b from-white to-[#F9F9F9] rounded-2xl border border-[#E5E5E5] p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="font-semibold text-[#111111] mb-4 flex items-center gap-2">
                <Gift className="h-4 w-4 text-[#E60000]" />
                {t.orderSummary}
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-[#666666]">{t.subtotal}</span>
                  <span className="font-medium text-[#111111]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#666666]">{t.deliveryFee}</span>
                  <span className="font-medium text-[#111111]">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600 font-semibold">{language === "so" ? "Bilaash" : "Free"}</span>
                    ) : (
                      `$${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-[#E5E5E5] to-transparent" />
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#111111] text-lg">{t.total}</span>
                  <motion.span
                    key={total}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="text-2xl font-bold text-[#E60000]"
                  >
                    ${total.toFixed(2)}
                  </motion.span>
                </div>
              </div>

              {/* Benefits */}
              <div className="flex items-center justify-center gap-4 mb-6 text-xs text-[#666666]">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#E60000]" />
                  {language === "so" ? "Dhaqso" : "Fast"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-[#E60000]" />
                  {language === "so" ? "Ammiin" : "Secure"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5 text-[#E60000]" />
                  {language === "so" ? "La hubiyay" : "Verified"}
                </span>
              </div>

              {/* WhatsApp Checkout Button */}
              <motion.button
                onClick={() => setShowCheckoutModal(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full relative overflow-hidden rounded-xl py-4 text-base font-bold text-white transition-all duration-300 bg-gradient-to-r from-[#10B981] via-[#059669] to-[#047857] hover:shadow-xl hover:shadow-green-500/30"
              >
                <span className="flex items-center justify-center gap-3 relative z-10">
                  <MessageCircle className="h-5 w-5" />
                  {language === "so" ? "Dalab adoo adeegsanaya WhatsApp" : "Order via WhatsApp"}
                </span>
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
              </motion.button>

              <p className="mt-4 text-xs text-center text-[#666666]">
                {t.whatsappRedirect}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* WhatsApp Checkout Modal */}
      <WhatsAppCheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
      />
    </div>
  );
}
