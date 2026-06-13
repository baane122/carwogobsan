"use client";

import { motion } from "framer-motion";
import { Layout, Globe } from "lucide-react";
import { TranslationManager } from "@/components/admin/translation-manager";

export default function AdminContentPage() {

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#111111]">Content Studio</h2>
          <p className="text-sm text-gray-500">Studio Nuxurka &mdash; Manage translations and content</p>
        </div>
      </div>

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
            <p className="text-sm text-[#666666]">Drag-and-drop homepage sections</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-[#E5E5E5] bg-[#F9F9F9]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#111111]">Hero Section</span>
              <input type="checkbox" checked className="h-4 w-4 rounded" />
            </div>
            <p className="text-xs text-[#666666]">Main banner with CTA</p>
          </div>
          <div className="p-4 rounded-lg border border-[#E5E5E5] bg-[#F9F9F9]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#111111]">Trust Bar</span>
              <input type="checkbox" checked className="h-4 w-4 rounded" />
            </div>
            <p className="text-xs text-[#666666]">Scrolling trust indicators</p>
          </div>
          <div className="p-4 rounded-lg border border-[#E5E5E5] bg-[#F9F9F9]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#111111]">Categories</span>
              <input type="checkbox" checked className="h-4 w-4 rounded" />
            </div>
            <p className="text-xs text-[#666666]">Bento grid layout</p>
          </div>
          <div className="p-4 rounded-lg border border-[#E5E5E5] bg-[#F9F9F9]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#111111]">Featured Products</span>
              <input type="checkbox" checked className="h-4 w-4 rounded" />
            </div>
            <p className="text-xs text-[#666666]">Product grid showcase</p>
          </div>
          <div className="p-4 rounded-lg border border-[#E5E5E5] bg-[#F9F9F9]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#111111]">Testimonials</span>
              <input type="checkbox" className="h-4 w-4 rounded" />
            </div>
            <p className="text-xs text-[#666666]">Customer reviews</p>
          </div>
          <div className="p-4 rounded-lg border border-[#E5E5E5] bg-[#F9F9F9]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#111111]">Newsletter</span>
              <input type="checkbox" className="h-4 w-4 rounded" />
            </div>
            <p className="text-xs text-[#666666]">Email signup form</p>
          </div>
        </div>
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
    </div>
  );
}