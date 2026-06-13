"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Home, FileText } from "lucide-react";
import Link from "next/link";

export default function TermsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Terms page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#E60000]/10">
          <FileText className="h-10 w-10 text-[#E60000]" />
        </div>

        <h1 className="text-2xl font-bold text-[#111111] mb-2 font-[family-name:var(--font-montserrat)]">
          Page Error
        </h1>

        <p className="text-[#666666] mb-6">
          Something went wrong while loading this page. Please try again.
        </p>

        {error.digest && (
          <p className="text-xs text-[#999999] mb-6">
            Error Code: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E60000] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#B30000] active:scale-[0.98]"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#111111] bg-transparent px-6 py-3 text-sm font-semibold text-[#111111] transition-all hover:bg-[#111111] hover:text-white"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-[#E5E5E5]">
          <p className="text-xs text-[#999999]">CARWO GOBSAN</p>
        </div>
      </motion.div>
    </div>
  );
}
