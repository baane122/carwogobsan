"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

// Note: Global error boundary must include its own html and body tags
// because it renders when the root layout is failing

// Simple translations for global error (can't use context if layout failed)
const errorTranslations = {
  en: {
    errorTitle: "Critical Error",
    errorDescription: "We apologize for the inconvenience. A critical error occurred. Please try again or return to the home page.",
    tryAgain: "Try Again",
    goHome: "Go Home",
    errorCode: "Error Code",
  },
  so: {
    errorTitle: "Khalad Muhiim ah",
    errorDescription: "Waan ka xumahay dhibaatada. Khalad muhiim ah ayaa dhacay. Fadlan isku day mar kale ama ku noqo bogga hore.",
    tryAgain: "Isku Day Mar Kale",
    goHome: "Ku Noqo Bogga Hore",
    errorCode: "Koodhka Khaladka",
  },
};

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  // Try to detect language from localStorage or default to English
  const getLanguage = (): "en" | "so" => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("carwo-language");
      if (stored === "so" || stored === "en") return stored;
      // Check document lang attribute
      if (document.documentElement.lang === "so") return "so";
    }
    return "en";
  };

  const lang = getLanguage();
  const t = errorTranslations[lang];

  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4 font-sans">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full text-center"
        >
          {/* Error Icon */}
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#E60000]/10">
            <AlertTriangle className="h-12 w-12 text-[#E60000]" />
          </div>

          {/* Error Title */}
          <h1 className="text-3xl font-bold text-[#111111] mb-3 font-[family-name:var(--font-montserrat)]">
            {t.errorTitle}
          </h1>

          {/* Error Description */}
          <p className="text-[#666666] mb-6 leading-relaxed">
            {t.errorDescription}
          </p>

          {/* Error Code (if available) */}
          {error.digest && (
            <p className="text-xs text-[#999999] mb-6 font-mono">
              {t.errorCode}: {error.digest}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E60000] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#B30000] active:scale-[0.98]"
            >
              <RefreshCw className="h-4 w-4" />
              {t.tryAgain}
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#111111] bg-transparent px-6 py-3 text-sm font-semibold text-[#111111] transition-all hover:bg-[#111111] hover:text-white"
            >
              <Home className="h-4 w-4" />
              {t.goHome}
            </Link>
          </div>

          {/* Brand Logo */}
          <div className="mt-10 pt-6 border-t border-[#E5E5E5]">
            <p className="text-sm font-semibold text-[#111111] font-[family-name:var(--font-montserrat)]">
              CARWO GOBSAN
            </p>
            <p className="text-xs text-[#999999] mt-1">
              Premium E-Commerce in Hargeisa
            </p>
          </div>
        </motion.div>
      </body>
    </html>
  );
}
