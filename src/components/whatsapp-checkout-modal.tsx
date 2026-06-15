"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Truck, Building, MapPin, ShoppingCart, Gift, Clock, Shield, Check } from "lucide-react";
import { useLanguage } from "@/components/language-context";
import { useCartStore } from "@/lib/store";

const hargeisaDistricts = [
  { id: "new-hargeisa", label: "New Hargeisa", labelSo: "Hargeisa Cusub", deliveryFee: 3 },
  { id: "golis", label: "Golis", labelSo: "Golis", deliveryFee: 3 },
  { id: "26-june", label: "26 June", labelSo: "26 Juun", deliveryFee: 3 },
  { id: "mohamed-moge", label: "Mohamed Moge", labelSo: "Maxamed Mooge", deliveryFee: 4 },
  { id: "airport", label: "Airport Area", labelSo: "Agaasimada Diyaaradaha", deliveryFee: 4 },
  { id: "shaab", label: "Sha'ab Area", labelSo: "Sha'ab", deliveryFee: 3 },
  { id: "dabaruq", label: "Dabaruq", labelSo: "Dabaruq", deliveryFee: 5 },
  { id: "other", label: "Other Area", labelSo: "Meeso Kale", deliveryFee: 5 },
];

interface WhatsAppCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WhatsAppCheckoutModal({ isOpen, onClose }: WhatsAppCheckoutModalProps) {
  const { language } = useLanguage();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const district = hargeisaDistricts.find((d) => d.id === selectedDistrict);
  const subtotal = getTotalPrice();
  const deliveryFee = deliveryMethod === "pickup" ? 0 : (district?.deliveryFee || 0);
  const total = subtotal + deliveryFee;

  const generateWhatsAppMessage = () => {
    const storeName = "🛒 CARWO GOBSAN";
    const divider = "━━━━━━━━━━━━━━━━━━━";
    
    let message = `${storeName}\n${divider}\n\n`;
    message += `📋 ${language === "so" ? "DALABKAAGA" : "YOUR ORDER"}\n\n`;
    
    items.forEach((item, i) => {
      const itemName = language === "so" && item.nameSo ? item.nameSo : item.name;
      message += `${i + 1}. ${itemName}\n`;
      message += `   💰 $${item.price.toFixed(2)} × ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}\n\n`;
    });
    
    message += `${divider}\n`;
    message += `💵 ${language === "so" ? "Wadarta" : "Subtotal"}: $${subtotal.toFixed(2)}\n`;
    message += `🚚 ${language === "so" ? "Gudbinta" : "Delivery"}: $${deliveryFee.toFixed(2)}\n`;
    message += `${divider}\n`;
    message += `✨ ${language === "so" ? "WADARTA GUDAHA" : "TOTAL"}: $${total.toFixed(2)}\n\n`;
    
    if (deliveryMethod === "delivery" && district) {
      const districtName = language === "so" && district.labelSo ? district.labelSo : district.label;
      message += `📍 ${language === "so" ? "Goobta" : "Delivery to"}: ${districtName}\n`;
    } else {
      message += `🏪 ${language === "so" ? "Soo qaadasho" : "Pickup"}: Suuqa Hadhwanaag Mall, Hargeisa\n`;
    }
    
    message += `\n${divider}\n`;
    message += language === "so" ? "🙏 Mahadsanid! Si dhaqso ah baan kula soo xiriiri doonaa." : "🙏 Thank you! We'll contact you shortly to confirm your order.";
    
    return encodeURIComponent(message);
  };

  const handleCheckout = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowSuccess(true);
      setTimeout(() => {
        window.open(`https://wa.me/252633800999?text=${generateWhatsAppMessage()}`, "_blank");
        setShowSuccess(false);
        setIsAnimating(false);
        clearCart();
        onClose();
      }, 800);
    }, 500);
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (items.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* Header with gradient */}
            <div className="relative bg-gradient-to-r from-[#E60000] via-[#cc0000] to-[#990000] p-6 text-white">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                  <ShoppingCart className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {language === "so" ? "Dhamaystir Dalabka" : "Complete Your Order"}
                  </h2>
                  <p className="text-white/80 text-sm mt-1">
                    {items.length} {language === "so" ? "shay" : "items"} • ${subtotal.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Product Preview Grid */}
              <div className="p-6 bg-gradient-to-b from-gray-50 to-white">
                <h3 className="text-sm font-semibold text-[#111111] mb-4 flex items-center gap-2">
                  <Gift className="h-4 w-4 text-[#E60000]" />
                  {language === "so" ? "Alaabtaada" : "Your Items"}
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {items.slice(0, 4).map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative aspect-square rounded-xl overflow-hidden bg-[#F9F9F9] ring-2 ring-[#E5E5E5] hover:ring-[#E60000] transition-all"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="100px"
                      />
                      {item.quantity > 1 && (
                        <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#E60000] text-xs font-bold text-white shadow-lg">
                          {item.quantity}
                        </span>
                      )}
                    </motion.div>
                  ))}
                  {items.length > 4 && (
                    <div className="relative aspect-square rounded-xl bg-[#111111] flex items-center justify-center">
                      <span className="text-white font-bold text-lg">+{items.length - 4}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Method Selection */}
              <div className="p-6 border-t border-[#E5E5E5]">
                <h3 className="text-sm font-semibold text-[#111111] mb-4 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-[#E60000]" />
                  {language === "so" ? "Habka Gudbinta" : "Delivery Method"}
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setDeliveryMethod("delivery")}
                    className={`relative p-4 rounded-2xl border-2 transition-all duration-300 ${
                      deliveryMethod === "delivery"
                        ? "border-[#E60000] bg-[#E60000]/5 shadow-lg shadow-[#E60000]/10"
                        : "border-[#E5E5E5] hover:border-[#E60000]/50"
                    }`}
                  >
                    {deliveryMethod === "delivery" && (
                      <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-[#E60000] flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                    <Truck className={`h-6 w-6 mx-auto mb-2 ${deliveryMethod === "delivery" ? "text-[#E60000]" : "text-[#666666]"}`} />
                    <span className={`block text-sm font-medium ${deliveryMethod === "delivery" ? "text-[#E60000]" : "text-[#111111]"}`}>
                      {language === "so" ? "Gudbin" : "Delivery"}
                    </span>
                    <span className="text-xs text-[#666666]">
                      {deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : language === "so" ? "Dooro goob" : "Select area"}
                    </span>
                  </button>
                  
                  <button
                    onClick={() => setDeliveryMethod("pickup")}
                    className={`relative p-4 rounded-2xl border-2 transition-all duration-300 ${
                      deliveryMethod === "pickup"
                        ? "border-[#E60000] bg-[#E60000]/5 shadow-lg shadow-[#E60000]/10"
                        : "border-[#E5E5E5] hover:border-[#E60000]/50"
                    }`}
                  >
                    {deliveryMethod === "pickup" && (
                      <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-[#E60000] flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                    <Building className={`h-6 w-6 mx-auto mb-2 ${deliveryMethod === "pickup" ? "text-[#E60000]" : "text-[#666666]"}`} />
                    <span className={`block text-sm font-medium ${deliveryMethod === "pickup" ? "text-[#E60000]" : "text-[#111111]"}`}>
                      {language === "so" ? "Soo Qaadasho" : "Pickup"}
                    </span>
                    <span className="text-xs text-[#666666]">{language === "so" ? "Bilaash" : "Free"}</span>
                  </button>
                </div>
              </div>

              {/* Location Selection (only for delivery) */}
              {deliveryMethod === "delivery" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-6"
                >
                  <h3 className="text-sm font-semibold text-[#111111] mb-4 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#E60000]" />
                    {language === "so" ? "Goobta Gudbinta" : "Delivery Location"}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {hargeisaDistricts.map((d) => {
                      const isSelected = selectedDistrict === d.id;
                      const label = language === "so" && d.labelSo ? d.labelSo : d.label;
                      return (
                        <button
                          key={d.id}
                          onClick={() => setSelectedDistrict(d.id)}
                          className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                            isSelected
                              ? "border-[#E60000] bg-[#E60000]/5"
                              : "border-[#E5E5E5] hover:border-[#E60000]/50"
                          }`}
                        >
                          <span className={`block text-sm font-medium ${isSelected ? "text-[#E60000]" : "text-[#111111]"}`}>
                            {label}
                          </span>
                          <span className="text-xs text-[#666666]">+${d.deliveryFee}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Order Summary */}
              <div className="p-6 bg-gradient-to-b from-white to-gray-50 border-t border-[#E5E5E5]">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[#666666]">{language === "so" ? "Wadarta alaabta" : "Items subtotal"}</span>
                    <span className="font-medium text-[#111111]">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#666666]">{language === "so" ? "Kharashka gudbinta" : "Delivery fee"}</span>
                    <span className="font-medium text-[#111111]">
                      {deliveryFee === 0 ? (
                        <span className="text-green-600">{language === "so" ? "Bilaash" : "Free"}</span>
                      ) : (
                        `$${deliveryFee.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-[#E5E5E5] to-transparent" />
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#111111] text-lg">{language === "so" ? "Wadarta Guud" : "Total"}</span>
                    <motion.span
                      key={total}
                      initial={{ scale: 1.2, color: "#E60000" }}
                      animate={{ scale: 1, color: "#E60000" }}
                      className="text-2xl font-bold"
                    >
                      ${total.toFixed(2)}
                    </motion.span>
                  </div>
                </div>

                {/* Benefits */}
                <div className="flex items-center justify-center gap-6 mb-6 text-xs text-[#666666]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-[#E60000]" />
                    {language === "so" ? "Dhaqso" : "Fast Delivery"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Shield className="h-4 w-4 text-[#E60000]" />
                    {language === "so" ? "Ammiin" : "Secure Order"}
                  </span>
                </div>

                {/* Checkout Button */}
                <motion.button
                  onClick={handleCheckout}
                  disabled={deliveryMethod === "delivery" && !selectedDistrict}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full relative overflow-hidden rounded-2xl py-4 text-base font-bold text-white transition-all duration-300 ${
                    deliveryMethod === "delivery" && !selectedDistrict
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#10B981] via-[#059669] to-[#047857] hover:shadow-xl hover:shadow-green-500/30"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {showSuccess ? (
                      <motion.span
                        key="success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <Check className="h-5 w-5" />
                        {language === "so" ? "La diray!" : "Sent!"}
                      </motion.span>
                    ) : isAnimating ? (
                      <motion.span
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="default"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center gap-3"
                      >
                        <MessageCircle className="h-5 w-5" />
                        {language === "so" ? "Dalab adoo adeegsanaya WhatsApp" : "Order via WhatsApp"}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
                </motion.button>

                {deliveryMethod === "delivery" && !selectedDistrict && (
                  <p className="text-center text-xs text-[#666666] mt-3">
                    {language === "so" ? "Fadlan dooro goobta gudbinta" : "Please select a delivery location"}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
