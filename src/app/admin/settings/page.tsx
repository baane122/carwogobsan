"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  Phone,
  Store,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  getSetting,
  updateSetting,
} from "@/lib/insforge";
import { cn } from "@/lib/utils";

interface SettingsFormData {
  whatsappNumber: string;
  storeName: string;
  storeAddress: string;
  currencyRate: string;
  primaryCurrency: string;
}

interface FormErrors {
  whatsappNumber?: string;
  storeName?: string;
  storeAddress?: string;
  currencyRate?: string;
}

function validateForm(data: SettingsFormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.whatsappNumber.trim()) {
    errors.whatsappNumber = "WhatsApp number is required";
  } else if (!/^\+?[\d\s-]+$/.test(data.whatsappNumber.trim())) {
    errors.whatsappNumber = "Enter a valid phone number";
  }

  if (!data.storeName.trim()) {
    errors.storeName = "Store name is required";
  }

  if (!data.storeAddress.trim()) {
    errors.storeAddress = "Store address is required";
  }

  if (!data.currencyRate || parseFloat(data.currencyRate) <= 0) {
    errors.currencyRate = "Exchange rate must be greater than 0";
  }

  return errors;
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<SettingsFormData>({
    whatsappNumber: "",
    storeName: "",
    storeAddress: "",
    currencyRate: "9200",
    primaryCurrency: "USD",
  });

  // Fetch settings on mount
  useEffect(() => {
    void loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      // Try to get individual settings first
      const [whatsappSetting, storeNameSetting, storeAddressSetting, currencySetting] =
        await Promise.all([
          getSetting("whatsapp_number"),
          getSetting("store_name"),
          getSetting("store_address"),
          getSetting("currency"),
        ]);

      setFormData((prev) => ({
        ...prev,
        whatsappNumber: (typeof whatsappSetting?.value === "object" && whatsappSetting?.value ? (whatsappSetting.value.number as string) : undefined) || prev.whatsappNumber,
        storeName: (typeof storeNameSetting?.value === "object" && storeNameSetting?.value ? (storeNameSetting.value.name as string) : undefined) || prev.storeName,
        storeAddress: (typeof storeAddressSetting?.value === "object" && storeAddressSetting?.value ? (storeAddressSetting.value.address as string) : undefined) || prev.storeAddress,
        currencyRate:
          String(typeof currencySetting?.value === "object" && currencySetting?.value ? (currencySetting.value.rate as string) : prev.currencyRate),
        primaryCurrency:
          (typeof currencySetting?.value === "object" && currencySetting?.value ? (currencySetting.value.primary as string) : undefined) || prev.primaryCurrency,
      }));
    } catch {
      showToast("error", "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const showToast = useCallback(
    (type: "success" | "error", message: string) => {
      setToast({ type, message });
      setTimeout(() => setToast(null), 3000);
    },
    []
  );

  const updateFormField = (
    field: keyof SettingsFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);

    try {
      // Save all settings in parallel
      await Promise.all([
        updateSetting("whatsapp_number", {
          number: formData.whatsappNumber.trim(),
        }),
        updateSetting("store_name", {
          name: formData.storeName.trim(),
        }),
        updateSetting("store_address", {
          address: formData.storeAddress.trim(),
        }),
        updateSetting("currency", {
          rate: parseFloat(formData.currencyRate),
          primary: formData.primaryCurrency,
        }),
      ]);

      showToast("success", "Settings saved successfully");
    } catch {
      showToast("error", "Failed to save settings");
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
          <h2 className="text-2xl font-bold text-[#111111]">Settings</h2>
          <p className="text-sm text-gray-500">
            Settings &mdash; Configure your store
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#E60000]" />
        </div>
      )}

      {/* Settings Form */}
      {!loading && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* WhatsApp Configuration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-[#E5E5E5] p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-emerald-100">
                <Phone className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-[#111111]">
                  WhatsApp Configuration
                </h3>
                <p className="text-sm text-[#666666]">
                  Business WhatsApp number for customer orders
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111111] mb-2">
                WhatsApp Phone Number
              </label>
              <input
                type="tel"
                value={formData.whatsappNumber}
                onChange={(e) =>
                  updateFormField("whatsappNumber", e.target.value)
                }
                placeholder="+252633800999"
                className={cn(
                  "w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-1",
                  formErrors.whatsappNumber
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-[#E5E5E5] focus:border-[#E60000] focus:ring-[#E60000]"
                )}
              />
              {formErrors.whatsappNumber && (
                <p className="text-xs text-red-500 mt-1">
                  {formErrors.whatsappNumber}
                </p>
              )}
              <p className="text-xs text-[#666666] mt-1">
                Include country code (e.g., +252 for Somalia)
              </p>
            </div>
          </motion.div>

          {/* Store Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-[#E5E5E5] p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-100">
                <Store className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-[#111111]">
                  Store Information
                </h3>
                <p className="text-sm text-[#666666]">
                  Display name and location
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-2">
                  Store Name
                </label>
                <input
                  type="text"
                  value={formData.storeName}
                  onChange={(e) =>
                    updateFormField("storeName", e.target.value)
                  }
                  placeholder="Carwo Gobsan"
                  className={cn(
                    "w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-1",
                    formErrors.storeName
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-[#E5E5E5] focus:border-[#E60000] focus:ring-[#E60000]"
                  )}
                />
                {formErrors.storeName && (
                  <p className="text-xs text-red-500 mt-1">
                    {formErrors.storeName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-2">
                  Store Address
                </label>
                <input
                  type="text"
                  value={formData.storeAddress}
                  onChange={(e) =>
                    updateFormField("storeAddress", e.target.value)
                  }
                  placeholder="Hargeisa, Somaliland"
                  className={cn(
                    "w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-1",
                    formErrors.storeAddress
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-[#E5E5E5] focus:border-[#E60000] focus:ring-[#E60000]"
                  )}
                />
                {formErrors.storeAddress && (
                  <p className="text-xs text-red-500 mt-1">
                    {formErrors.storeAddress}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Currency Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-[#E5E5E5] p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[#E60000]/10">
                <DollarSign className="h-5 w-5 text-[#E60000]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#111111]">
                  Currency Settings
                </h3>
                <p className="text-sm text-[#666666]">
                  USD to SOS exchange rate
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-2">
                  USD/SOS Rate
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.currencyRate}
                  onChange={(e) =>
                    updateFormField("currencyRate", e.target.value)
                  }
                  className={cn(
                    "w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-1",
                    formErrors.currencyRate
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-[#E5E5E5] focus:border-[#E60000] focus:ring-[#E60000]"
                  )}
                />
                {formErrors.currencyRate && (
                  <p className="text-xs text-red-500 mt-1">
                    {formErrors.currencyRate}
                  </p>
                )}
                <p className="text-xs text-[#666666] mt-1">
                  Example: $25 = ~{Math.round(
                    parseFloat(formData.currencyRate || "0") * 25
                  ).toLocaleString()}{" "}
                  SOS
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-2">
                  Primary Currency
                </label>
                <select
                  value={formData.primaryCurrency}
                  onChange={(e) =>
                    updateFormField("primaryCurrency", e.target.value)
                  }
                  className="w-full rounded-lg border border-[#E5E5E5] px-3 py-2.5 text-sm focus:border-[#E60000] focus:outline-none focus:ring-1 focus:ring-[#E60000] bg-white"
                >
                  <option value="USD">USD (US Dollar)</option>
                  <option value="SOS">SOS (Somali Shilling)</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-end"
          >
            <button
              type="submit"
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
                  Save Settings
                </>
              )}
            </button>
          </motion.div>
        </form>
      )}
    </div>
  );
}
