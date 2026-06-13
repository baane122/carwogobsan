"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  MessageCircle,
  Share2,
  Link2,
  Minus,
  Plus,
  Check,
  ArrowLeft,
  Star,
  Loader2,
} from "lucide-react";
import { useLanguage } from "@/components/language-context";
import { useCartStore } from "@/lib/store";
import { ProductCard } from "@/components/product-card";
import { fetchProducts, fetchSettings } from "@/lib/insforge";
import type { Product } from "@/lib/insforge";

const DEFAULT_WHATSAPP_NUMBER = "252633800999";

interface ProductClientProps {
  product: Product;
}

export default function ProductClient({ product }: ProductClientProps) {
  const { language, t } = useLanguage();
  const addItem = useCartStore((state) => state.addItem);

  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState(DEFAULT_WHATSAPP_NUMBER);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch related products and WhatsApp number on mount
  useEffect(() => {
    async function loadData() {
      try {
        // Fetch all products for related products
        const allProducts = await fetchProducts();
        const related = allProducts
          .filter((p) => p.category_id === product.category_id && p.id !== product.id)
          .slice(0, 4);
        setRelatedProducts(related);

        // Fetch WhatsApp number from settings
        const settings = await fetchSettings();
        const whatsappSetting = settings.find((s) => s.key === "whatsapp_number");
        if (whatsappSetting && whatsappSetting.value && typeof whatsappSetting.value === "object" && "phone" in whatsappSetting.value && typeof whatsappSetting.value.phone === "string") {
          setWhatsappNumber(whatsappSetting.value.phone.replace(/^\+/, ""));
        } else if (whatsappSetting && typeof whatsappSetting.value === "string") {
          setWhatsappNumber(whatsappSetting.value.replace(/^\+/, ""));
        }
      } catch (error) {
        console.error("Error loading related products:", error);
      } finally {
        setLoadingRelated(false);
      }
    }
    loadData();
  }, [product.category_id, product.id]);

  const displayName = language === "so" && product.name_so ? product.name_so : product.name_en;
  const displayDescription =
    language === "so" && product.description_so ? product.description_so : product.description_en;

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  // Build images array
  const images = product.images && product.images.length > 0
    ? product.images
    : product.image
      ? [product.image]
      : [];

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    addItem({
      id: product.id,
      name: product.name_en,
      nameSo: product.name_so,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= product.stock) {
      setQuantity(newQty);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hi, I want to order: ${product.name_en} x${quantity} ($${(product.price * quantity).toFixed(2)})`
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = (platform: "facebook" | "twitter" | "copy") => {
    const text = encodeURIComponent(`Check out ${product.name_en} at Carwo Gobsan!`);
    if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, "_blank");
    } else if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(currentUrl)}`, "_blank");
    } else if (platform === "copy") {
      navigator.clipboard.writeText(currentUrl);
    }
    setShareOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#666666] mb-6">
          <Link href="/" className="hover:text-[#E60000] transition-colors">
            {t.home}
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#E60000] transition-colors">
            {t.products}
          </Link>
          <span>/</span>
          <span className="text-[#111111] truncate max-w-[200px]">{displayName}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white">
              {images.length > 0 ? (
                <Image
                  src={images[currentImageIndex]}
                  alt={displayName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-[#E60000] text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{discount}%
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      currentImageIndex === index
                        ? "border-[#E60000]"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${displayName} - ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-[#111111] font-[family-name:var(--font-montserrat)]">
                {displayName}
              </h1>
              <p className="text-sm text-[#666666] mt-2">{product.category}</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-[#E60000]">${product.price.toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-[#666666] line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < (product.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-[#666666]">
                ({product.reviewCount || 0} {language === "so" ? "faallo" : "reviews"})
              </span>
            </div>

            {/* Description */}
            {displayDescription && (
              <div className="bg-white rounded-xl p-4 border border-[#E5E5E5]">
                <h3 className="font-semibold text-[#111111] mb-2">{t.description}</h3>
                <p className="text-sm text-[#666666] leading-relaxed">{displayDescription}</p>
              </div>
            )}

            {/* Stock Status */}
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium w-fit ${
                product.stock > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {product.stock > 0 ? (
                <>
                  <Check className="w-4 h-4" />
                  {t.inStock} ({product.stock} {language === "so" ? "ku jira" : "available"})
                </>
              ) : (
                <>
                  <span className="w-4 h-4 rounded-full bg-red-500" />
                  {t.outOfStock}
                </>
              )}
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-[#111111]">{t.quantity}:</span>
                <div className="flex items-center border border-[#E5E5E5] rounded-lg bg-white">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="px-3 py-2 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 text-sm font-semibold min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="px-3 py-2 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Add to Cart Button */}
              <motion.button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                whileTap={{ scale: 0.97 }}
                className={`flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                  addedToCart
                    ? "bg-green-600 text-white"
                    : "bg-[#E60000] text-white hover:bg-[#cc0000]"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <AnimatePresence mode="wait">
                  {addedToCart ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2"
                    >
                      <Check className="h-5 w-5" />
                      {language === "so" ? "La Daray Gaariga" : "Added to Cart"}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      {t.addToCart}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* WhatsApp Order Button */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-3 bg-[#10B981] hover:bg-[#059669] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all"
              >
                <MessageCircle className="h-5 w-5" />
                {t.orderOnWhatsApp}
              </a>
            </div>

            {/* Share Buttons */}
            <div className="relative">
              <button
                onClick={() => setShareOpen(!shareOpen)}
                className="flex items-center gap-2 text-sm text-[#666666] hover:text-[#E60000] transition-colors"
              >
                <Share2 className="h-4 w-4" />
                {t.share}
              </button>

              <AnimatePresence>
                {shareOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 flex gap-2 bg-white rounded-lg shadow-lg border border-[#E5E5E5] p-2 z-10"
                  >
                    <button
                      onClick={() => handleShare("facebook")}
                      className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                      aria-label="Share on Facebook"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleShare("twitter")}
                      className="p-2 rounded-lg hover:bg-sky-50 text-sky-500 transition-colors"
                      aria-label="Share on Twitter"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleShare("copy")}
                      className="p-2 rounded-lg hover:bg-gray-50 text-[#666666] transition-colors"
                      aria-label="Copy link"
                    >
                      <Link2 className="h-5 w-5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Visit Store */}
            <div className="flex items-center gap-2 text-sm text-[#666666] bg-white rounded-lg p-3 border border-[#E5E5E5]">
              <span>📍</span>
              <span>
                {language === "so"
                  ? "Nagu soo booqo Suuqa Hadhwanaag Mall, Hargeisa"
                  : "Visit us at Suuqa Hadhwanaag Mall, Hargeisa"}
              </span>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-[#E5E5E5] pt-12">
            <h2 className="text-2xl font-bold text-[#111111] mb-8 font-[family-name:var(--font-montserrat)]">
              {t.relatedProducts}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name_en}
                  nameSo={p.name_so}
                  price={p.price}
                  originalPrice={p.originalPrice}
                  image={p.image}
                  category={p.category}
                  rating={p.rating}
                  reviewCount={p.reviewCount}
                  inStock={p.stock > 0}
                />
              ))}
            </div>
          </div>
        )}

        {/* Loading related products */}
        {loadingRelated && (
          <div className="border-t border-[#E5E5E5] pt-12">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-[#E60000]" />
            </div>
          </div>
        )}

        {/* Back to Products */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-[#666666] hover:text-[#E60000] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.continueShopping}
          </Link>
        </div>
      </div>
    </div>
  );
}
