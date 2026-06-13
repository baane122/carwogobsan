"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { useLanguage } from "@/components/language-context";

export function Footer() {
  const { t } = useLanguage();

  const whatsappLink = "https://wa.me/252633800999";

  return (
    <footer className="bg-[#111111] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/images/logo.jpg"
                alt="CARWO GOBSAN"
                width={40}
                height={40}
                className="rounded-lg object-cover border border-[#E60000]/20"
              />
              <span className="text-xl font-bold tracking-tight">
                CARWO <span className="text-[#E60000]">GOBSAN</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-xs">
              Premium e-commerce experience for Hargeisa. Quality products,
              fast delivery, and excellent customer service.
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#10B981] hover:text-[#10B981]/80 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              {t.chatOnWhatsApp}
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              {t.customerService}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t.products}
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t.cart}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t.aboutUs}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t.terms}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t.privacy}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              {t.contact}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-[#E60000] shrink-0" />
                <span className="text-sm text-gray-400">
                  Suuqa Hadhwanaag Mall, Shop
                  <br />
                  Hargeisa, Somaliland
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#E60000] shrink-0" />
                <a
                  href="tel:+252633800999"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  +252 63 3800999
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#E60000] shrink-0" />
                <a
                  href="mailto:info@carwogobsan.com"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  info@carwogobsan.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            {new Date().getFullYear()} CARWO GOBSAN. {t.allRightsReserved}
          </p>
          <p className="text-xs text-gray-500">{t.currency}</p>
        </div>
      </div>
    </footer>
  );
}
