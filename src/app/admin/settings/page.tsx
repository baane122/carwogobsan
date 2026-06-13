"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, MapPin, Shield, Users, Plus, Trash2, Save } from "lucide-react";

const initialDistricts = [
  { id: "new-hargeisa", name: "New Hargeisa", fee: 3 },
  { id: "golis", name: "Golis", fee: 3 },
  { id: "26-june", name: "26 June", fee: 3 },
  { id: "mohamed-moge", name: "Mohamed Moge", fee: 4 },
  { id: "airport", name: "Airport Area", fee: 4 },
];

const initialRoles = [
  { id: "admin", name: "Admin", permissions: ["all"] },
  { id: "editor", name: "Editor", permissions: ["products", "content"] },
  { id: "support", name: "Support", permissions: ["orders"] },
];

export default function AdminSettingsPage() {
  const [currencyRate, setCurrencyRate] = useState("9200");
  const [districts] = useState(initialDistricts);
  const [roles] = useState(initialRoles);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#111111]">Settings</h2>
          <p className="text-sm text-gray-500">Settings &mdash; Configure your store</p>
        </div>
      </div>

      {/* Currency Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-[#E5E5E5] p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-[#E60000]/10">
            <DollarSign className="h-5 w-5 text-[#E60000]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#111111]">Currency Settings</h3>
            <p className="text-sm text-[#666666]">USD to SOS exchange rate</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-2">
              USD/SOS Rate
            </label>
            <input
              type="number"
              value={currencyRate}
              onChange={(e) => setCurrencyRate(e.target.value)}
              className="w-full rounded-lg border border-[#E5E5E5] px-3 py-2.5 text-sm focus:border-[#E60000] focus:outline-none"
            />
            <p className="text-xs text-[#666666] mt-1">
              Example: $25 = ~{Number(currencyRate) * 25} SOS
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-2">
              Primary Currency
            </label>
            <select className="w-full rounded-lg border border-[#E5E5E5] px-3 py-2.5 text-sm focus:border-[#E60000] focus:outline-none bg-white">
              <option value="USD">USD (US Dollar)</option>
              <option value="SOS">SOS (Somali Shilling)</option>
            </select>
          </div>
        </div>

        <button className="mt-4 btn-primary gap-2">
          <Save className="h-4 w-4" />
          Save Settings
        </button>
      </motion.div>

      {/* Delivery Zones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-[#E5E5E5] p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#10B981]/10">
              <MapPin className="h-5 w-5 text-[#10B981]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#111111]">Delivery Zones</h3>
              <p className="text-sm text-[#666666]">Hargeisa districts and fees</p>
            </div>
          </div>
          <button className="btn-secondary gap-2 text-sm">
            <Plus className="h-4 w-4" />
            Add Zone
          </button>
        </div>

        <div className="space-y-3">
          {districts.map((district) => (
            <div
              key={district.id}
              className="flex items-center justify-between p-3 rounded-lg border border-[#E5E5E5]"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-[#111111]">
                  {district.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#666666]">Fee:</span>
                  <input
                    type="number"
                    value={district.fee}
                    className="w-20 rounded border border-[#E5E5E5] px-2 py-1 text-sm text-center"
                  />
                  <span className="text-sm text-[#E60000]">USD</span>
                </div>
                <button className="p-1 text-[#666666] hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Staff Roles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-[#E5E5E5] p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-100">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-[#111111]">Staff Roles</h3>
            <p className="text-sm text-[#666666]">Role-based access control</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roles.map((role) => (
            <div
              key={role.id}
              className="p-4 rounded-xl border border-[#E5E5E5] bg-[#F9F9F9]"
            >
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-[#666666]" />
                <span className="font-medium text-[#111111]">{role.name}</span>
              </div>
              <div className="space-y-2">
                {["Products", "Orders", "Content", "Settings"].map((perm) => (
                  <label key={perm} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={role.permissions.includes("all") || role.permissions.includes(perm.toLowerCase())}
                      className="h-4 w-4 rounded"
                    />
                    <span className="text-sm text-[#666666]">{perm}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}