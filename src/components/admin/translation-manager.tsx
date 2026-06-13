"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Save, Plus, Trash2, X, Pencil, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { getSetting, updateSetting } from "@/lib/insforge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface TranslationEntry {
  id: string;
  key: string;
  en: string;
  so: string;
  context: string;
  lastEdited: string;
}

interface TranslationsData {
  entries: TranslationEntry[];
}

const defaultTranslations: TranslationEntry[] = [
  { id: "1", key: "nav.home", en: "Home", so: "Bogga Hore", context: "Navigation", lastEdited: "2024-06-10" },
  { id: "2", key: "nav.products", en: "Products", so: "Alaabta", context: "Navigation", lastEdited: "2024-06-10" },
  { id: "3", key: "nav.cart", en: "Cart", so: "Gaariga", context: "Navigation", lastEdited: "2024-06-09" },
  { id: "4", key: "product.addToCart", en: "Add to Cart", so: "Ku dar Gaariga", context: "Product", lastEdited: "2024-06-08" },
  { id: "5", key: "product.outOfStock", en: "Out of Stock", so: "Dhammaaday", context: "Product", lastEdited: "2024-06-08" },
  { id: "6", key: "checkout.title", en: "Checkout", so: "Lacag Bixinta", context: "Checkout", lastEdited: "2024-06-07" },
  { id: "7", key: "checkout.shipping", en: "Shipping", so: "Gaadinta", context: "Checkout", lastEdited: "2024-06-07" },
  { id: "8", key: "footer.contact", en: "Contact Us", so: "Nagu La Xidhiidh", context: "Footer", lastEdited: "2024-06-06" },
  { id: "9", key: "footer.about", en: "About Us", so: "Ku Saabsan", context: "Footer", lastEdited: "2024-06-06" },
  { id: "10", key: "auth.login", en: "Login", so: "Soo Gal", context: "Auth", lastEdited: "2024-06-05" },
];

export function TranslationManager() {
  const [translations, setTranslations] = useState<TranslationEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterContext, setFilterContext] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<TranslationEntry>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Load translations from settings API on mount
  useEffect(() => {
    void loadTranslations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = useCallback((type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const loadTranslations = async () => {
    setLoading(true);
    try {
      const setting = await getSetting("translations");
      if (setting && typeof setting.value === "object" && setting.value) {
        const data = setting.value as unknown as TranslationsData;
        if (data.entries && Array.isArray(data.entries) && data.entries.length > 0) {
          setTranslations(data.entries);
        } else {
          setTranslations(defaultTranslations);
        }
      } else {
        setTranslations(defaultTranslations);
      }
    } catch (error) {
      console.error("Error loading translations:", error);
      setTranslations(defaultTranslations);
      showToast("error", "Failed to load translations from server");
    } finally {
      setLoading(false);
    }
  };

  const saveTranslationsToServer = async (entries: TranslationEntry[]) => {
    setSaving(true);
    try {
      await updateSetting("translations", { entries });
      showToast("success", "Translations saved successfully");
    } catch (error) {
      console.error("Error saving translations:", error);
      showToast("error", "Failed to save translations");
    } finally {
      setSaving(false);
    }
  };

  const contexts = ["all", ...Array.from(new Set(translations.map((t) => t.context)))];

  const filtered = translations.filter((t) => {
    const matchesSearch =
      t.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.so.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesContext = filterContext === "all" || t.context === filterContext;
    return matchesSearch && matchesContext;
  });

  const startEdit = (entry: TranslationEntry) => {
    setEditingId(entry.id);
    setEditForm({ ...entry });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const updated = translations.map((t) =>
      t.id === editingId
        ? { ...t, ...editForm, lastEdited: new Date().toISOString().split("T")[0] }
        : t
    );
    setTranslations(updated);
    setEditingId(null);
    setEditForm({});
    await saveTranslationsToServer(updated);
  };

  const cancelEdit = () => {
    // Remove newly created entries that were cancelled
    if (editingId?.startsWith("new-")) {
      setTranslations((prev) => prev.filter((t) => t.id !== editingId));
    }
    setEditingId(null);
    setEditForm({});
  };

  const addNew = () => {
    const newEntry: TranslationEntry = {
      id: `new-${Date.now()}`,
      key: "new.key",
      en: "",
      so: "",
      context: "General",
      lastEdited: new Date().toISOString().split("T")[0],
    };
    setTranslations((prev) => [newEntry, ...prev]);
    startEdit(newEntry);
  };

  const deleteEntry = async (id: string) => {
    const updated = translations.filter((t) => t.id !== id);
    setTranslations(updated);
    await saveTranslationsToServer(updated);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
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
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-[#111111]">
              Translation Manager
            </h3>
            <p className="text-sm text-gray-500">Maamulka Turjumaadda</p>
          </div>
          <div className="flex items-center gap-2">
            {saving && (
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving...
              </span>
            )}
            <button
              onClick={addNew}
              disabled={saving || !!editingId}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#E60000] rounded-lg hover:bg-[#b30000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
              Add String
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search keys or translations..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#E60000] focus:border-transparent outline-none transition-all"
            />
          </div>
          <select
            value={filterContext}
            onChange={(e) => setFilterContext(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#E60000] focus:border-transparent outline-none bg-white"
          >
            {contexts.map((ctx) => (
              <option key={ctx} value={ctx}>
                {ctx === "all" ? "All Contexts" : ctx}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#E60000]" />
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 w-48">
                  Key
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  English (EN)
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Somali (SO)
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 w-32">
                  Context
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 w-28">
                  Last Edited
                </th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 w-24">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    {editingId === entry.id ? (
                      <input
                        type="text"
                        value={editForm.key || ""}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, key: e.target.value }))
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#E60000] focus:border-transparent outline-none"
                      />
                    ) : (
                      <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-[#111111]">
                        {entry.key}
                      </code>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === entry.id ? (
                      <input
                        type="text"
                        value={editForm.en || ""}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, en: e.target.value }))
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#E60000] focus:border-transparent outline-none"
                      />
                    ) : (
                      <span className="text-sm text-gray-700">{entry.en}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === entry.id ? (
                      <input
                        type="text"
                        value={editForm.so || ""}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, so: e.target.value }))
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#E60000] focus:border-transparent outline-none"
                        dir="rtl"
                      />
                    ) : (
                      <span className="text-sm text-gray-700">{entry.so}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === entry.id ? (
                      <input
                        type="text"
                        value={editForm.context || ""}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, context: e.target.value }))
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#E60000] focus:border-transparent outline-none"
                      />
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        {entry.context}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-500">{entry.lastEdited}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {editingId === entry.id ? (
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={saveEdit}
                          disabled={saving}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors disabled:opacity-50"
                          title="Save"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          disabled={saving}
                          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                          title="Cancel"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => startEdit(entry)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <Search className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">No translations found</p>
        </div>
      )}
    </div>
  );
}
