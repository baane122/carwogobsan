"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Upload, X, GripVertical, ImageIcon } from "lucide-react";

interface ProductVariant {
  id: string;
  name: string;
  nameSo: string;
  sku: string;
  priceUsd: number;
  priceSos: number;
  stock: number;
}

interface ProductMedia {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

interface ProductFormData {
  nameEn: string;
  nameSo: string;
  descriptionEn: string;
  descriptionSo: string;
  priceUsd: string;
  priceSos: string;
  category: string;
  stock: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

const categories = [
  "Electronics",
  "Clothing",
  "Food",
  "Home & Garden",
  "Sports",
  "Books",
];

export function ProductForm() {
  const [activeTab, setActiveTab] = useState<"general" | "variants" | "media" | "seo">("general");
  const [form, setForm] = useState<ProductFormData>({
    nameEn: "",
    nameSo: "",
    descriptionEn: "",
    descriptionSo: "",
    priceUsd: "",
    priceSos: "",
    category: "",
    stock: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });

  const [variants, setVariants] = useState<ProductVariant[]>([
    { id: "v1", name: "Small", nameSo: "Yar", sku: "PRD-001-S", priceUsd: 19.99, priceSos: 11594, stock: 25 },
    { id: "v2", name: "Medium", nameSo: "Dhexdhexaad", sku: "PRD-001-M", priceUsd: 24.99, priceSos: 14494, stock: 18 },
    { id: "v3", name: "Large", nameSo: "Weyn", sku: "PRD-001-L", priceUsd: 29.99, priceSos: 17394, stock: 12 },
  ]);

  const [media, setMedia] = useState<ProductMedia[]>([
    { id: "m1", url: "https://via.placeholder.com/200", alt: "Product image 1", isPrimary: true },
    { id: "m2", url: "https://via.placeholder.com/200", alt: "Product image 2", isPrimary: false },
    { id: "m3", url: "https://via.placeholder.com/200", alt: "Product image 3", isPrimary: false },
  ]);

  const [draggedMedia, setDraggedMedia] = useState<string | null>(null);

  const updateForm = (field: keyof ProductFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDragStart = (id: string) => {
    setDraggedMedia(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetId: string) => {
    if (!draggedMedia || draggedMedia === targetId) return;
    const items = [...media];
    const fromIndex = items.findIndex((m) => m.id === draggedMedia);
    const toIndex = items.findIndex((m) => m.id === targetId);
    const [removed] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, removed);
    setMedia(items);
    setDraggedMedia(null);
  };

  const removeMedia = (id: string) => {
    setMedia((prev) => prev.filter((m) => m.id !== id));
  };

  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: `v-${Date.now()}`,
      name: "",
      nameSo: "",
      sku: `PRD-XXX-${String(variants.length + 1).padStart(2, "0")}`,
      priceUsd: 0,
      priceSos: 0,
      stock: 0,
    };
    setVariants((prev) => [...prev, newVariant]);
  };

  const updateVariant = (id: string, field: keyof ProductVariant, value: string | number) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const removeVariant = (id: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  const tabs = [
    { id: "general" as const, label: "General", labelSo: "Guud" },
    { id: "variants" as const, label: "Variants", labelSo: "Noocyada" },
    { id: "media" as const, label: "Media", labelSo: "Sawirada" },
    { id: "seo" as const, label: "SEO", labelSo: "SEO" },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-[#E60000] text-[#E60000]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              <span>{tab.label}</span>
              <span className="block text-xs text-gray-400">{tab.labelSo}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* General Tab */}
        {activeTab === "general" && (
          <div className="space-y-6">
            {/* Product Name - Side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name <span className="text-[#E60000]">*</span>
                </label>
                <input
                  type="text"
                  value={form.nameEn}
                  onChange={(e) => updateForm("nameEn", e.target.value)}
                  placeholder="e.g. Premium Wireless Headphones"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#E60000] focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Magaca Alaabta <span className="text-[#E60000]">*</span>
                </label>
                <input
                  type="text"
                  value={form.nameSo}
                  onChange={(e) => updateForm("nameSo", e.target.value)}
                  placeholder="tusaale: Dhagaystayaal Wireless Premium"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#E60000] focus:border-transparent outline-none transition-all"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Description - Side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={form.descriptionEn}
                  onChange={(e) => updateForm("descriptionEn", e.target.value)}
                  rows={4}
                  placeholder="Describe your product..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#E60000] focus:border-transparent outline-none transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sharaxaad
                </label>
                <textarea
                  value={form.descriptionSo}
                  onChange={(e) => updateForm("descriptionSo", e.target.value)}
                  rows={4}
                  placeholder="Sharaxaad ku saabsan alaabta..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#E60000] focus:border-transparent outline-none transition-all resize-none"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (USD) <span className="text-[#E60000]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input
                    type="number"
                    value={form.priceUsd}
                    onChange={(e) => updateForm("priceUsd", e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#E60000] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (SOS) <span className="text-[#E60000]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">S</span>
                  <input
                    type="number"
                    value={form.priceSos}
                    onChange={(e) => updateForm("priceSos", e.target.value)}
                    placeholder="0"
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#E60000] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => updateForm("stock", e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#E60000] focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => updateForm("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#E60000] focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Variants Tab */}
        {activeTab === "variants" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-[#111111]">Product Variants</h4>
                <p className="text-xs text-gray-500">Noocyada Alaabta</p>
              </div>
              <button
                onClick={addVariant}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#E60000] rounded-lg hover:bg-[#b30000] transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Variant
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">Variant</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">SKU</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">Price (USD)</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">Price (SOS)</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">Stock</th>
                    <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {variants.map((variant) => (
                    <tr key={variant.id} className="hover:bg-gray-50/50">
                      <td className="px-3 py-2">
                        <div>
                          <input
                            type="text"
                            value={variant.name}
                            onChange={(e) => updateVariant(variant.id, "name", e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#E60000] focus:border-transparent outline-none"
                            placeholder="Variant name"
                          />
                          <input
                            type="text"
                            value={variant.nameSo}
                            onChange={(e) => updateVariant(variant.id, "nameSo", e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#E60000] focus:border-transparent outline-none mt-1"
                            placeholder="Magaca nooca"
                          />
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={variant.sku}
                          onChange={(e) => updateVariant(variant.id, "sku", e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#E60000] focus:border-transparent outline-none font-mono"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={variant.priceUsd}
                          onChange={(e) => updateVariant(variant.id, "priceUsd", parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#E60000] focus:border-transparent outline-none"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={variant.priceSos}
                          onChange={(e) => updateVariant(variant.id, "priceSos", parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#E60000] focus:border-transparent outline-none"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={variant.stock}
                          onChange={(e) => updateVariant(variant.id, "stock", parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#E60000] focus:border-transparent outline-none"
                        />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() => removeVariant(variant.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === "media" && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-[#111111]">Product Media</h4>
              <p className="text-xs text-gray-500">Sawirada Alaabta</p>
            </div>

            {/* Upload Area */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#E60000] transition-colors cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={(e) => {
                e.preventDefault();
                // Handle file drop
              }}
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium text-gray-700">
                Drag and drop images here
              </p>
              <p className="text-xs text-gray-500 mt-1">
                or click to browse (PNG, JPG, WEBP up to 5MB)
              </p>
            </div>

            {/* Media Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {media.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(item.id)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(item.id)}
                  className={cn(
                    "relative group rounded-lg border-2 overflow-hidden cursor-move",
                    item.isPrimary ? "border-[#E60000]" : "border-gray-200"
                  )}
                >
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    <ImageIcon className="h-10 w-10 text-gray-300" />
                  </div>
                  {item.isPrimary && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#E60000] text-white text-xs font-medium rounded">
                      Primary
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => removeMedia(item.id)}
                      className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-xs text-white truncate">{item.alt}</p>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="h-4 w-4 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === "seo" && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-[#111111]">Search Engine Optimization</h4>
              <p className="-xs text-gray-500">SEO</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SEO Title
                </label>
                <input
                  type="text"
                  value={form.seoTitle}
                  onChange={(e) => updateForm("seoTitle", e.target.value)}
                  placeholder="e.g. Premium Wireless Headphones - CARWO GOBSAN"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#E60000] focus:border-transparent outline-none transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 50-60 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  value={form.seoDescription}
                  onChange={(e) => updateForm("seoDescription", e.target.value)}
                  rows={3}
                  placeholder="Brief description for search engines..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#E60000] focus:border-transparent outline-none transition-all resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 150-160 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Keywords
                </label>
                <input
                  type="text"
                  value={form.seoKeywords}
                  onChange={(e) => updateForm("seoKeywords", e.target.value)}
                  placeholder="headphones, wireless, audio, premium"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#E60000] focus:border-transparent outline-none transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Comma-separated keywords
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { Plus, Trash2 } from "lucide-react";
