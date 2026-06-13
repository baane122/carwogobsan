import { products as staticProducts } from "@/lib/data";
import ProductClient from "./ProductClient";

// Generate static params for all products (required for static export)
// Uses only static data - no API calls during build
export async function generateStaticParams() {
  // Always use static data for static export to avoid build-time API failures
  return staticProducts.map((product) => ({
    id: product.id,
  }));
}

// Generate static metadata for each product
export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = staticProducts.find((p) => p.id === params.id);
  if (!product) {
    return {
      title: "Product Not Found | CARWO GOBSAN",
    };
  }
  return {
    title: `${product.name_en} | CARWO GOBSAN`,
    description: product.description_en,
  };
}

// Server component wrapper - uses static data for static export
export default function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  // Use static data for the initial render
  const product = staticProducts.find((p) => p.id === params.id);

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

  return <ProductClient product={product} />;
}
