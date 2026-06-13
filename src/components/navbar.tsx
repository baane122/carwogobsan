"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart, Menu, X, Globe } from "lucide-react";
import { useLanguage } from "@/components/language-context";
import { useCartStore } from "@/lib/store";

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const totalItems = useCartStore((state) => state.getTotalItems());

  const navLinks = [
    { href: "/", label: t.home },
    { href: "/products", label: t.products },
    { href: "/about", label: t.about },
    { href: "/contact", label: t.contact },
  ];

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "so" : "en");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <Image
                src="/images/logo.jpg"
                alt="CARWO GOBSAN"
                width={40}
                height={40}
                className="rounded-lg object-cover border border-[#E60000]/20"
              />
              <span className="text-xl font-bold tracking-tight text-[#111111] font-[family-name:var(--font-montserrat)]">
                CARWO <span className="text-[#E60000]">GOBSAN</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    pathname === link.href
                      ? "text-[#E60000]"
                      : "text-[#111111] hover:text-[#E60000]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg text-[#111111] hover:bg-black/5 transition-colors"
                aria-label={t.search}
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 rounded-lg text-[#111111] hover:bg-black/5 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#E60000] text-[10px] font-bold text-white">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[#111111] hover:bg-black/5 transition-colors border border-[#111111]/10"
              >
                <Globe className="h-4 w-4" />
                <span className="uppercase">{language}</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-[#111111] hover:bg-black/5 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="overflow-hidden border-t border-black/5 animate-fadeIn">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666666]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.search}
                  className="w-full rounded-lg border border-[#E5E5E5] bg-white py-2.5 pl-10 pr-4 text-sm text-[#111111] placeholder:text-[#666666] focus:border-[#E60000] focus:outline-none focus:ring-1 focus:ring-[#E60000]"
                />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 z-40 glass border-b border-white/20 md:hidden animate-fadeIn">
          <div className="mx-auto max-w-7xl px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-[#E60000]/10 text-[#E60000]"
                    : "text-[#111111] hover:bg-black/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                toggleLanguage();
                setMobileMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-[#111111] hover:bg-black/5"
            >
              <Globe className="h-4 w-4" />
              {language === "en" ? "Switch to Somali" : "U beddel Ingiriisi"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
