"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  CheckCircle,
} from "lucide-react";
import { useLanguage } from "@/components/language-context";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const contactInfo = [
  {
    icon: MessageCircle,
    titleKey: "chatOnWhatsApp",
    value: "+252 63 3800999",
    href: "https://wa.me/252633800999",
    descKey: "quickResponse",
    color: "#25D366",
  },
  {
    icon: Mail,
    titleKey: "email",
    value: "info@carwogobsan.com",
    href: "mailto:info@carwogobsan.com",
    descKey: "replyWithin24h",
    color: "#E60000",
  },
  {
    icon: MapPin,
    titleKey: "storeLocation",
    value: "Suuqa Hadhwanaag Mall",
    href: null,
    descKey: "openDaily",
    color: "#E60000",
  },
];

export default function ContactPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", phone: "", message: "" });
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello CARWO GOBSAN!\n\nName: ${formData.name}\nPhone: ${formData.phone}\n\nMessage: ${formData.message}`
    );
    window.open(`https://wa.me/252633800999?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Hero */}
      <section className="relative bg-[#111111] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E60000] rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E60000] rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative container mx-auto px-4 py-20 md:py-28 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-4 tracking-tight"
          >
            {t.contactTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto"
          >
            {t.contactSubtitle}
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 md:py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto"
        >
          {/* Contact Info */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 space-y-6"
          >
            {/* Contact Cards */}
            <div className="space-y-4">
              {contactInfo.map((info, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="bg-white rounded-2xl border border-[#E5E5E5] p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${info.color}15` }}
                    >
                      <info.icon
                        className="w-6 h-6"
                        style={{ color: info.color }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#111111] mb-1">
                        {(t as Record<string, string>)[info.titleKey]}
                      </h3>
                      {info.href ? (
                        <a
                          href={info.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#E60000] hover:underline font-medium"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-[#333333] font-medium">
                          {info.value}
                        </p>
                      )}
                      <p className="text-sm text-[#666666] mt-1">
                        {(t as Record<string, string>)[info.descKey]}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Business Hours */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl border border-[#E5E5E5] p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#E60000]/10 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#E60000]" />
                </div>
                <h3 className="font-semibold text-[#111111]">
                  {t.businessHours}
                </h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#666666]">{t.weekdays}</span>
                  <span className="text-[#111111] font-medium">
                    8:00 AM - 8:00 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">{t.weekend}</span>
                  <span className="text-[#E60000] font-medium">{t.closed}</span>
                </div>
              </div>
            </motion.div>

            {/* Map Placeholder */}
            <motion.div
              variants={itemVariants}
              className="bg-[#F9F9F9] rounded-2xl border border-[#E5E5E5] flex items-center justify-center min-h-[160px]"
            >
              <div className="text-center p-6">
                <MapPin className="w-8 h-8 text-[#E60000] mx-auto mb-2" />
                <p className="text-[#111111] font-semibold text-sm">
                  {t.storeAddress}
                </p>
                <p className="text-xs text-[#999999] mt-1">
                  {t.mapPlaceholder}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-3 bg-white rounded-2xl border border-[#E5E5E5] p-8"
          >
            <h2 className="text-2xl font-bold text-[#111111] mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#E60000] rounded-full" />
              {t.sendMessage}
            </h2>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-20 h-20 bg-[#25D366]/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-10 h-10 text-[#25D366]" />
                </div>
                <h3 className="text-xl font-bold text-[#111111] mb-2">
                  {t.messageSent}
                </h3>
                <p className="text-[#666666]">{t.quickResponse}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-[#111111] mb-2"
                    >
                      {t.fullName}
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder={t.yourName}
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] bg-white focus:border-[#E60000] focus:ring-2 focus:ring-[#E60000]/20 outline-none transition-all text-[#111111] placeholder:text-[#999999]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-[#111111] mb-2"
                    >
                      {t.phoneNumber}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder={t.yourPhone}
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] bg-white focus:border-[#E60000] focus:ring-2 focus:ring-[#E60000]/20 outline-none transition-all text-[#111111] placeholder:text-[#999999]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#111111] mb-2"
                  >
                    {t.emailAddress}
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder={t.yourEmail}
                    className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] bg-white focus:border-[#E60000] focus:ring-2 focus:ring-[#E60000]/20 outline-none transition-all text-[#111111] placeholder:text-[#999999]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-[#111111] mb-2"
                  >
                    {t.message}
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder={t.howCanWeHelp}
                    className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] bg-white focus:border-[#E60000] focus:ring-2 focus:ring-[#E60000]/20 outline-none transition-all resize-none text-[#111111] placeholder:text-[#999999]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#E60000] text-white py-3.5 rounded-xl font-semibold hover:bg-[#C50000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#E60000]/20"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {t.send}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleWhatsApp}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 rounded-xl font-semibold hover:bg-[#20BD5A] transition-colors shadow-lg shadow-[#25D366]/20"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {t.chatOnWhatsApp}
                  </button>
                </div>

                <p className="text-center text-sm text-[#666666] pt-2">
                  {t.orMessageDirect}{" "}
                  <a
                    href="https://wa.me/252633800999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#25D366] font-medium hover:underline"
                  >
                    WhatsApp
                  </a>
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
