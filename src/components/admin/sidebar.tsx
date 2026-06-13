"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Store,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  {
    label: "Dashboard",
    labelSo: "Dashbaad",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    labelSo: "Alaabta",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Orders",
    labelSo: "Dalabada",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    label: "Content",
    labelSo: "Macluumaadka",
    href: "/admin/content",
    icon: FileText,
  },
  {
    label: "Settings",
    labelSo: "Dejinta",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-[#111111] text-white flex flex-col transition-all duration-300 z-50",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <Store className="h-6 w-6 text-[#E60000]" />
            <span className="font-bold text-lg tracking-tight">CARWO</span>
          </Link>
        )}
        {collapsed && <Store className="h-6 w-6 text-[#E60000] mx-auto" />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-white/10 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[#E60000] text-white shadow-lg shadow-[#E60000]/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <div className="flex flex-col leading-tight">
                  <span>{item.label}</span>
                  <span className="text-xs text-gray-500">{item.labelSo}</span>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Exit Admin</span>}
        </Link>
      </div>
    </aside>
  );
}
