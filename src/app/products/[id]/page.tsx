import { products } from "@/lib/data";
import { getProductById } from "@/lib/api";
import ProductClient from "./ProductClient";

// Generate static params for all products (required for static export)
export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

// Server component wrapper
export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  // Try to fetch from API first, fallback to static data
  const product = await getProductById(params.id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#E60000]">Product Not Found</h1>
          <p className="text-[#666666] mt-2">The product you&apos;re looking for doesn&apos;t exist.</p>
          <a href="/products" className="mt-4 inline-block px-6 py-2 bg-[#E60000] text-white rounded-lg">
            Back to Products
          </a>
        </div>
      </div>
    );
  }

  // Related products (same category, excluding current)
  const relatedProducts = products
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 4);

  return <ProductClient product={product} relatedProducts={relatedProducts} />;
}
