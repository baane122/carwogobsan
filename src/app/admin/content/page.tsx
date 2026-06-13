"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout, Globe, Save, Loader2, AlertCircle, CheckCircle, Type, Image as ImageIcon } from "lucide-react";
import { TranslationManager } from "@/components/admin/translation-manager";
import { getSetting, updateSetting } from "@/lib/insforge";
import { cn } from "@/lib/utils";

// Types
interface SectionToggle {
  hero: boolean;
  trustBar: boolean;
  categories: boolean;
  featuredProducts: boolean;
  testimonials: boolean;
  newsletter: boolean;
}

interface HeroSlide {
  id: number;
  title_en: string;
  title_so: string;
  subtitle_en: string;
  subtitle_so: string;
  description_en: string;
  description_so: string;
  image: string;
}

interface HeroContent {
  slides: HeroSlide[];
}

const defaultSections: SectionToggle = {
  hero: true,
  trustBar: true,
  categories: true,
  featuredProducts: true,
  testimonials: false,
  newsletter: false,
};

const defaultHeroContent: HeroContent = {
  slides: [
    {
      id: 1,
      title_en: "Premium Kitchen Essentials",
      title_so: "Qalabka Cuntada Tayo Sare",
      subtitle_en: "The Best in Hargeisa",
      subtitle_so: "Ugu Fiican Hargeisa",
      description_en: "Discover premium cookware, appliances & tableware crafted for the modern Somali home.",
      description_so: "Soo hel qalabka cuntada ee ugu fiican oo ku habboon gurigaaga. Tayo iyo qiimo jaban.",
      image: "/images/hero/hero-slide-1-kitchenware.png",
    },
    {
      id: 2,
      title_en: "Modern Appliances",
      title_so: "Qalabka Elektarooniga",
      subtitle_en: "Convenience Delivered",
      subtitle_so: "Fududeyn Ku Soo Dhow",
      description_en: "Smart home appliances that make cooking and living effortless.",
      description_so: "Qalabka guriga ee casriga ah oo kuu fududeeya shaqada guriga.",
      image: "/images/hero/hero-slide-2-appliances.png",
    },
    {
      id: 3,
      title_en: "Elegant Tableware",
      title_so: "Safkeeda Quruxda Badan",
      subtitle_en: "Elevate Your Dining",
      subtitle_so: "Qurux Qoyskaaga",
      description_en: "Beautiful dinner sets and table accessories for every occasion.",
      description_so: "Safkeeda oo qurux badan oo ku habboon cuntada qoyska iyo martida.",
      image: "/images/hero/hero-slide-3-tableware.png",
    },
  ],
};

const sectionLabels: Record<keyof SectionToggle, { label: string; description: string }> = {
  hero: { label: "Hero Section", description: "Main banner with CTA" },
  trustBar: { label: "Trust Bar", description: "Scrolling trust indicators" },
  categories: { label: "Categories", description: "Bento grid layout" },
  featuredProducts: { label: "Featured Products", description: "Product grid showcase" },
  testimonials: { label: "Testimonials", description: "Customer reviews" },
  newsletter: { label: "Newsletter", description: "Email signup form" },
};

export default function AdminContentPage() {
  const [sections, setSections] = useState<SectionToggle>(defaultSections);
  const [heroContent, setHeroContent] = useState<HeroContent>(defaultHeroContent);
  const [activeTab, setActiveTab] = useState<"sections" | "hero">("sections");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Load settings on mount
  useEffect(() => {
    void loadContentSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = useCallback((type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const loadContentSettings = async () => {
    setLoading(true);
    try {
      const [sectionsSetting, heroSetting] = await Promise.all([
        getSetting("homepage_sections"),
        getSetting("hero_content"),
      ]);

      if (sectionsSetting && typeof sectionsSetting.value === "object" && sectionsSetting.value) {
        const data = sectionsSetting.value as unknown as SectionToggle;
        setSections({
          hero: data.hero ?? defaultSections.hero,
          trustBar: data.trustBar ?? defaultSections.trustBar,
          categories: data.categories ?? defaultSections.categories,
          featuredProducts: data.featuredProducts ?? defaultSections.featuredProducts,
          testimonials: data.testimonials ?? defaultSections.testimonials,
          newsletter: data.newsletter ?? defaultSections.newsletter,
        });
      }

      if (heroSetting && typeof heroSetting.value === "object" && heroSetting.value) {
        const data = heroSetting.value as unknown as HeroContent;
        if (data.slides && Array.isArray(data.slides) && data.slides.length > 0) {
          setHeroContent(data);
        }
      }
    } catch (error) {
      console.error("Error loading content settings:", error);
      showToast("error", "Failed to load content settings");
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = async (key: keyof SectionToggle) => {
    const updated = { ...sections, [key]: !sections[key] };
    setSections(updated);
    setSaving(true);
    try {
      await updateSetting("homepage_sections", updated);
      showToast("success", `${sectionLabels[key].label} ${updated[key] ? "enabled" : "disabled"}`);
    } catch (error) {
      console.error("Error saving section toggle:", error);
      // Revert on error
      setSections(sections);
      showToast("error", "Failed to save section toggle");
    } finally {
      setSaving(false);
    }
  };

  const updateHeroSlide = (slideId: number, field: keyof HeroSlide, value: string) => {
    setHeroContent((prev) => ({
      ...prev,
      slides: prev.slides.map((slide) =>
        slide.id === slideId ? { ...slide, [field]: value } : slide
      ),
    }));
  };

  const saveHeroContent = async () => {
    setSaving(true);
    try {
      await updateSetting("hero_content", { ...heroContent });
      showToast("success", "Hero content saved successfully");
    } catch (error) {
      console.error("Error saving hero content:", error);
      showToast("error", "Failed to save hero content");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50"
          >
            <div
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg",
                toast.type === "success"
                  ? "bg-emerald-500 text-white"
                  : "bg-red-500 text-white"
              )}
            >
              {toast.type === "success" ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#111111]">Content Studio</h2>
          <p className="text-sm text-gray-500">Studio Nuxurka &mdash; Manage translations and content</p>
        </div>
        {saving && (
          <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin text-[#E60000]" />
            Saving...
          </span>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#E60000]" />
        </div>
      )}

      {!loading && (
        <>
          {/* Homepage Builder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-[#E5E5E5] p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[#E60000]/10">
                <Layout className="h-5 w-5 text-[#E60000]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#111111]">Homepage Builder</h3>
                <p className="text-sm text-[#666666]">Configure homepage sections and hero content</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 mb-6 border-b border-[#E5E5E5]">
              <button
                onClick={() => setActiveTab("sections")}
                className={cn(
                  "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
                  activeTab === "sections"
                    ? "border-[#E60000] text-[#E60000]"
                    : "border-transparent text-gray-500 hover:text-[#111111]"
                )}
              >
                <span className="flex items-center gap-2">
                  <Layout className="h-4 w-4" />
                  Sections
                </span>
              </button>
              <button
                onClick={() => setActiveTab("hero")}
                className={cn(
                  "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
                  activeTab === "hero"
                    ? "border-[#E60000] text-[#E60000]"
                    : "border-transparent text-gray-500 hover:text-[#111111]"
                )}
              >
                <span className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Hero Content
                </span>
              </button>
            </div>

            {/* Sections Tab */}
            {activeTab === "sections" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(Object.keys(sectionLabels) as Array<keyof SectionToggle>).map((key) => (
                  <div
                    key={key}
                    className={cn(
                      "p-4 rounded-lg border transition-all duration-200",
                      sections[key]
                        ? "border-[#E60000]/30 bg-[#E60000]/5"
                        : "border-[#E5E5E5] bg-[#F9F9F9]"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#111111]">
                        {sectionLabels[key].label}
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sections[key]}
                          onChange={() => toggleSection(key)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#E60000]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#E60000]" />
                      </label>
                    </div>
                    <p className="text-xs text-[#666666]">{sectionLabels[key].description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Hero Content Tab */}
            {activeTab === "hero" && (
              <div className="space-y-6">
                {heroContent.slides.map((slide, index) => (
                  <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-5 rounded-xl border border-[#E5E5E5] bg-[#F9F9F9]"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-1.5 rounded-lg bg-[#E60000]/10">
                        <ImageIcon className="h-4 w-4 text-[#E60000]" aria-hidden="true" />
                      </div>
                      <h4 className="text-sm font-semibold text-[#111111]">
                        Slide {index + 1}
                      </h4>
                      <span className="text-xs text-gray-400 ml-auto">
                        {slide.image}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* English Fields */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">English</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-600 font-medium">EN</span>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#111111] mb-1">Title</label>
                          <input
                            type="text"
                            value={slide.title_en}
                            onChange={(e) => updateHeroSlide(slide.id, "title_en", e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded-lg focus:ring-2 focus:ring-[#E60000] focus:border-transparent outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#111111] mb-1">Subtitle</label>
                          <input
                            type="text"
                            value={slide.subtitle_en}
                            onChange={(e) => updateHeroSlide(slide.id, "subtitle_en", e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded-lg focus:ring-2 focus:ring-[#E60000] focus:border-transparent outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#111111] mb-1">Description</label>
                          <textarea
                            value={slide.description_en}
                            onChange={(e) => updateHeroSlide(slide.id, "description_en", e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded-lg focus:ring-2 focus:ring-[#E60000] focus:border-transparent outline-none transition-all resize-none"
                          />
                        </div>
                      </div>

                      {/* Somali Fields */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Somali</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-600 font-medium">SO</span>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#111111] mb-1">Title</label>
                          <input
                            type="text"
                            value={slide.title_so}
                            onChange={(e) => updateHeroSlide(slide.id, "title_so", e.target.value)}
                            dir="rtl"
                            className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded-lg focus:ring-2 focus:ring-[#E60000] focus:border-transparent outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#111111] mb-1">Subtitle</label>
                          <input
                            type="text"
                            value={slide.subtitle_so}
                            onChange={(e) => updateHeroSlide(slide.id, "subtitle_so", e.target.value)}
                            dir="rtl"
                            className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded-lg focus:ring-2 focus:ring-[#E60000] focus:border-transparent outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#111111] mb-1">Description</label>
                          <textarea
                            value={slide.description_so}
                            onChange={(e) => updateHeroSlide(slide.id, "description_so", e.target.value)}
                            rows={2}
                            dir="rtl"
                            className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded-lg focus:ring-2 focus:ring-[#E60000] focus:border-transparent outline-none transition-all resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Save Hero Button */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={saveHeroContent}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#E60000] text-white rounded-lg text-sm font-medium hover:bg-[#b30000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Hero Content
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Translation Manager */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-[#E5E5E5] p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[#10B981]/10">
                <Globe className="h-5 w-5 text-[#10B981]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#111111]">Translation Manager</h3>
                <p className="text-sm text-[#666666]">Edit UI strings for English and Somali</p>
              </div>
            </div>

            <TranslationManager />
          </motion.div>
        </>
      )}
    </div>
  );
}
