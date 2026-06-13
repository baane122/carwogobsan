"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Shield, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type UserRole = "admin" | "editor" | "support";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

const mockUser: User = {
  id: "1",
  name: "Admin User",
  email: "admin@carwogobsan.com",
  role: "admin",
  avatar: "",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user] = useState<User>(mockUser);

  // Role-based access control
  const hasAccess = (role: UserRole) => {
    const hierarchy: Record<UserRole, number> = {
      admin: 3,
      editor: 2,
      support: 1,
    };
    return hierarchy[user.role] >= hierarchy[role];
  };

  // Check if current path requires specific role
  const checkAccess = () => {
    if (typeof window === "undefined") return true;
    const path = window.location.pathname;
    if (path.includes("/admin/settings") && !hasAccess("admin")) {
      return false;
    }
    if (path.includes("/admin/content") && !hasAccess("editor")) {
      return false;
    }
    return true;
  };

  const accessGranted = checkAccess();

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <AdminSidebar />
      <main
        className={cn(
          "transition-all duration-300 min-h-screen",
          "ml-64" // Sidebar is always expanded in this layout
        )}
      >
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-[#111111]">
              Admin Dashboard
            </h1>
            <span className="text-sm text-gray-400">|</span>
            <span className="text-sm text-gray-500">CARWO GOBSAN</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
              <Shield className="h-4 w-4 text-[#E60000]" />
              <span className="text-xs font-medium text-gray-700 capitalize">
                {user.role}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E60000] flex items-center justify-center text-white text-sm font-medium">
                {user.name.charAt(0)}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-[#111111]">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {!accessGranted ? (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-[#E60000] mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-[#111111] mb-2">
                  Access Denied
                </h2>
                <p className="text-gray-500 mb-4">
                  You don&apos;t have permission to access this section.
                </p>
                <button
                  onClick={() => (window.location.href = "/admin")}
                  className="px-4 py-2 bg-[#E60000] text-white rounded-lg text-sm font-medium hover:bg-[#b30000] transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          ) : (
            children
          )}
        </div>
      </main>
    </div>
  );
}
