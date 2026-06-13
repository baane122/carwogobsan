"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  Zap,
  Users,
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronRight,
  Award,
  Heart,
  Package,
  Truck,
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

const stats = [
  { icon: Package, value: "2,500+", key: "statsProducts" },
  { icon: Users, value: "10,000+", key: "statsCustomers" },
  { icon: Truck, value: "50,000+", key: "statsOrders" },
  { icon: Clock, value: "5+", key: "statsYears" },
];

const values = [
  {
    icon: Shield,
    titleKey: "valueQuality",
    descKey: "valueQualityDesc",
  },
  {
    icon: Award,
    titleKey: "valueTrust",
    descKey: "valueTrustDesc",
  },
  {
    icon: Heart,
    titleKey: "valueCommunity",
    descKey: "valueCommunityDesc",
  },
];

const team = [
  { name: "Mohamed A.", roleKey: "teamRole1" },
  { name: "Fatima H.", roleKey: "teamRole2" },
  { name: "Ahmed K.", roleKey: "teamRole3" },
  { name: "Amina S.", roleKey: "teamRole4" },
];

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Hero */}
      <section className="relative bg-[#111111] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#E60000] rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#E60000] rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative container mx-auto px-4 py-20 md:py-28 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-4 tracking-tight"
          >
            {t.aboutTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto"
          >
            {t.aboutSubtitle}
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 md:py-20">
        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="bg-white rounded-2xl border border-[#E5E5E5] p-6 text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-[#E60000]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-6 h-6 text-[#E60000]" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-[#111111] mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-[#666666]">
                {(t as Record<string, string>)[stat.key]}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Story + Mission */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 gap-6 mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl border border-[#E5E5E5] p-8 md:p-10"
          >
            <h2 className="text-2xl font-bold text-[#111111] mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#E60000] rounded-full" />
              {t.ourStory}
            </h2>
            <div className="space-y-4 text-[#333333] leading-relaxed">
              <p>{t.ourStoryText1}</p>
              <p>{t.ourStoryText2}</p>
              <p>{t.ourStoryText3}</p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-[#111111] rounded-2xl p-8 md:p-10 text-white flex flex-col justify-center"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#E60000] rounded-full" />
              {t.ourMission}
            </h2>
            <p className="text-white/80 leading-relaxed text-lg">
              {t.missionText}
            </p>
            <div className="mt-6 flex items-center gap-2 text-[#E60000]">
              <Zap className="w-5 h-5" />
              <span className="font-semibold">CARWO GOBSAN</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Values */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-2xl md:text-3xl font-bold text-[#111111] text-center mb-10"
          >
            {t.ourValues}
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-white rounded-2xl border border-[#E5E5E5] p-8 text-center hover:border-[#E60000]/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-[#E60000]/10 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-[#E60000] transition-colors duration-300">
                  <v.icon className="w-7 h-7 text-[#E60000] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-bold text-[#111111] mb-2">
                  {(t as Record<string, string>)[v.titleKey]}
                </h3>
                <p className="text-sm text-[#666666] leading-relaxed">
                  {(t as Record<string, string>)[v.descKey]}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-2xl md:text-3xl font-bold text-[#111111] text-center mb-10"
          >
            {t.ourTeam}
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {team.map((member, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-white rounded-2xl border border-[#E5E5E5] p-6 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="w-20 h-20 bg-[#111111] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-[#E60000]" />
                </div>
                <h3 className="font-bold text-[#111111] mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-[#E60000] font-medium">
                  {(t as Record<string, string>)[member.roleKey]}
                </p>
              </motion.div>
            ))}
          </div>
          <motion.p
            variants={itemVariants}
            className="text-center text-[#666666] mt-6 text-sm"
          >
            {t.teamDesc}
          </motion.p>
        </motion.div>

        {/* Location */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="bg-white rounded-2xl border border-[#E5E5E5] p-8 md:p-10 mb-12"
        >
          <motion.h2
            variants={itemVariants}
            className="text-2xl font-bold text-[#111111] mb-8 flex items-center gap-2"
          >
            <span className="w-1 h-6 bg-[#E60000] rounded-full" />
            {t.visitStore}
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#E60000]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#E60000]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#111111] mb-1">
                    {t.storeLocation}
                  </h3>
                  <p className="text-[#666666]">{t.storeAddress}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#E60000]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-[#E60000]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#111111] mb-1">
                    {t.phone}
                  </h3>
                  <a
                    href="https://wa.me/252633800999"
                    className="text-[#E60000] hover:underline font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    +252 63 3800999
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#E60000]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-[#E60000]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#111111] mb-1">
                    {t.email}
                  </h3>
                  <a
                    href="mailto:info@carwogobsan.com"
                    className="text-[#E60000] hover:underline"
                  >
                    info@carwogobsan.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#E60000]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-[#E60000]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#111111] mb-1">
                    {t.businessHours}
                  </h3>
                  <p className="text-[#666666]">
                    {t.weekdays}: 8:00 AM - 8:00 PM
                  </p>
                  <p className="text-[#666666]">
                    {t.weekend}: {t.closed}
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="bg-[#F9F9F9] rounded-xl border border-[#E5E5E5] flex items-center justify-center min-h-[240px]"
            >
              <div className="text-center p-6">
                <MapPin className="w-10 h-10 text-[#E60000] mx-auto mb-3" />
                <p className="text-[#111111] font-semibold mb-1">
                  {t.storeLocation}
                </p>
                <p className="text-[#666666] text-sm">{t.storeAddress}</p>
                <p className="text-xs text-[#999999] mt-2">
                  {t.mapPlaceholder}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-[#E60000] text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-[#C50000] transition-colors shadow-lg shadow-[#E60000]/20"
          >
            {t.shopNow}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
