"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, MessageCircle, Eye, X, Check } from "lucide-react";
import { useLanguage } from "@/components/language-context";
import { useCartStore } from "@/lib/store";

interface ProductCardProps {
  id: string;
  name: string;
  nameSo?: string;
  price: number;
  originalPrice?: number;
  image: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
}

export function ProductCard({
  id,
  name,
  nameSo,
  price,
  originalPrice,
  image,
  category,
  rating = 4,
  reviewCount = 0,
  inStock = true,
}: ProductCardProps) {
  const { language, t } = useLanguage();
  const addItem = useCartStore((state) => state.addItem);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const displayName = language === "so" && nameSo ? nameSo : name;
  const whatsappLink = `https://wa.me/252633800999?text=I'm%20interested%20in%20${encodeURIComponent(name)}`;

  const handleAddToCart = () => {
    if (!inStock) return;
    addItem({
      id,
      name,
      nameSo,
      price,
      image,
      category,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  return (
    <>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex flex-col rounded-xl bg-white border border-[#E5E5E5] overflow-hidden transition-shadow duration-200 hover:shadow-lg hover:-translate-y-1"
      >
        {/* Image Container */}
        <Link href={`/products/${id}`} className="relative aspect-square overflow-hidden bg-[#F9F9F9]">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-[#E5E5E5] animate-pulse z-10" />
          )}
          <Image
            src={image}
            alt={displayName}
            fill
            className={`object-cover transition-transform duration-500 ${
              isHovered ? "scale-110" : "scale-100"
            } ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            unoptimized
          />
          {originalPrice && (
            <span className="absolute top-3 left-3 rounded-full bg-[#E60000] px-2.5 py-1 text-xs font-bold text-white z-20">
              -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
            </span>
          )}
          {!inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
              <span className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#111111]">
                {t.outOfStock}
              </span>
            </div>
          )}

          {/* Quick Actions Overlay */}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 p-3 opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 z-20">
            <button
              onClick={(e) => {
                e.preventDefault();
                setQuickViewOpen(true);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#111111] shadow-md hover:bg-[#E60000] hover:text-white transition-colors duration-200"
              aria-label={t.quickView}
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
              disabled={!inStock}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#111111] shadow-md hover:bg-[#E60000] hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={t.addToCart}
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#10B981] shadow-md hover:bg-[#10B981] hover:text-white transition-colors duration-200"
              aria-label={t.askOnWhatsApp}
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </Link>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          {category && (
            <span className="text-xs font-medium text-[#666666] uppercase tracking-wide mb-1">
              {category}
            </span>
          )}
          <Link href={`/products/${id}`}>
            <h3 className="text-sm font-semibold text-[#111111] line-clamp-2 mb-2 hover:text-[#E60000] transition-colors duration-200">
              {displayName}
            </h3>
          </Link>

          {/* Rating */}
          {reviewCount > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-[#666666]">({reviewCount})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-[#E60000]">
              ${price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-sm text-[#666666] line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Indicator */}
          <div className="flex items-center gap-1.5 mb-3">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                inStock ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-xs text-[#666666]">
              {inStock ? t.inStock : t.outOfStock}
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`mt-auto flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
              addedToCart
                ? "bg-green-600 text-white"
                : "bg-[#E60000] text-white hover:bg-[#cc0000]"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {addedToCart ? (
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4" />
                {language === "so" ? "La Daray" : "Added"}
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <ShoppingCart className="h-4 w-4" />
                {t.addToCart}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fadeIn"
          onClick={() => setQuickViewOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full rounded-2xl bg-white p-6 shadow-2xl animate-scaleIn"
          >
            <button
              onClick={() => setQuickViewOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-[#F9F9F9]">
                <Image
                  src={image}
                  alt={displayName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="flex flex-col">
                {category && (
                  <span className="text-xs font-medium text-[#666666] uppercase tracking-wide">
                    {category}
                  </span>
                )}
                <h2 className="text-xl font-bold text-[#111111] mt-1 mb-2">
                  {displayName}
                </h2>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-[#E60000]">
                    ${price.toFixed(2)}
                  </span>
                  {originalPrice && (
                    <span className="text-base text-[#666666] line-through">
                      ${originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#666666] mb-6">
                  {inStock ? t.inStock : t.outOfStock}
                </p>
                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={() => {
                      handleAddToCart();
                      setQuickViewOpen(false);
                    }}
                    disabled={!inStock}
                    className="flex-1 bg-[#E60000] text-white rounded-lg px-4 py-3 text-sm font-semibold hover:bg-[#cc0000] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {t.addToCart}
                  </button>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-lg border-2 border-[#10B981] px-4 py-3 text-sm font-semibold text-[#10B981] hover:bg-[#10B981] hover:text-white transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {t.askOnWhatsApp}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
