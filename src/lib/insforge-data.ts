/**
 * CARWO GOBSAN - Insforge Data Fetcher
 * Fetches real data from Insforge using CLI
 */

import { execSync } from "child_process";

export interface Product {
  id: string;
  name_en: string;
  name_so: string;
  description_en?: string;
  description_so?: string;
  price: number;
  price_sos?: number;
  image: string;
  images?: string[];
  category_id?: string;
  category?: string;
  stock: number;
  featured?: boolean;
  active?: boolean;
  specs?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name_en: string;
  name_so: string;
  slug?: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  total: number;
  total_sos?: number;
  status: string;
  delivery_option?: string;
  district?: string;
  address?: string;
  notes?: string;
  created_at?: string;
}

// Fetch products using Insforge CLI
export async function fetchProducts(): Promise<Product[]> {
  try {
    const result = execSync(
      'npx @insforge/cli db query "SELECT id, name_en, name_so, description_en, description_so, price, price_sos, image, category_id, stock, featured, active, specs, created_at FROM products WHERE active = true;"',
      { encoding: "utf-8", cwd: "/Users/abdirahmanbaane/Desktop/carwogobsan" }
    );
    // Parse table output
    const lines = result.trim().split("\n");
    const products: Product[] = [];
    // Skip header lines and separator
    let dataStarted = false;
    for (const line of lines) {
      if (line.startsWith("│") && !line.includes("id") && dataStarted) {
        const parts = line.split("│").map((p) => p.trim()).filter(Boolean);
        if (parts.length >= 5) {
          products.push({
            id: parts[0],
            name_en: parts[1],
            name_so: parts[2] || parts[1],
            description_en: parts[3] || undefined,
            description_so: parts[4] || undefined,
            price: parseFloat(parts[5]) || 0,
            price_sos: parts[6] ? parseFloat(parts[6]) : undefined,
            image: parts[7] || "/products/placeholder.jpg",
            category_id: parts[8] || undefined,
            stock: parseInt(parts[9]) || 0,
            featured: parts[10] === "true",
            active: parts[11] === "true",
            specs: parts[12] ? JSON.parse(parts[12]) : undefined,
            created_at: parts[13] || undefined,
          });
        }
      }
      if (line.startsWith("├─")) dataStarted = true;
    }
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Fetch categories using Insforge CLI
export async function fetchCategories(): Promise<Category[]> {
  try {
    const result = execSync(
      'npx @insforge/cli db query "SELECT id, name_en, name_so FROM categories;"',
      { encoding: "utf-8", cwd: "/Users/abdirahmanbaane/Desktop/carwogobsan" }
    );
    const lines = result.trim().split("\n");
    const categories: Category[] = [];
    let dataStarted = false;
    for (const line of lines) {
      if (line.startsWith("│") && !line.includes("id") && dataStarted) {
        const parts = line.split("│").map((p) => p.trim()).filter(Boolean);
        if (parts.length >= 2) {
          categories.push({
            id: parts[0],
            name_en: parts[1],
            name_so: parts[2] || parts[1],
          });
        }
      }
      if (line.startsWith("├─")) dataStarted = true;
    }
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Fetch orders
export async function fetchOrders(): Promise<Order[]> {
  try {
    const result = execSync(
      'npx @insforge/cli db query "SELECT id, customer_name, customer_phone, total, status, delivery_option, district, created_at FROM orders ORDER BY created_at DESC;"',
      { encoding: "utf-8", cwd: "/Users/abdirahmanbaane/Desktop/carwogobsan" }
    );
    const lines = result.trim().split("\n");
    const orders: Order[] = [];
    let dataStarted = false;
    for (const line of lines) {
      if (line.startsWith("│") && !line.includes("id") && dataStarted) {
        const parts = line.split("│").map((p) => p.trim()).filter(Boolean);
        if (parts.length >= 4) {
          orders.push({
            id: parts[0],
            customer_name: parts[1],
            customer_phone: parts[2],
            total: parseFloat(parts[3]) || 0,
            status: parts[4] || "pending",
            delivery_option: parts[5] || undefined,
            district: parts[6] || undefined,
            created_at: parts[7] || undefined,
          });
        }
      }
      if (line.startsWith("├─")) dataStarted = true;
    }
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

// Get product by ID
export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const result = execSync(
      `npx @insforge/cli db query "SELECT * FROM products WHERE id = '${id}';"`,
      { encoding: "utf-8", cwd: "/Users/abdirahmanbaane/Desktop/carwogobsan" }
    );
    const lines = result.trim().split("\n");
    let dataStarted = false;
    for (const line of lines) {
      if (line.startsWith("│") && !line.includes("id") && dataStarted) {
        const parts = line.split("│").map((p) => p.trim()).filter(Boolean);
        if (parts.length >= 5) {
          return {
            id: parts[0],
            name_en: parts[1],
            name_so: parts[2] || parts[1],
            price: parseFloat(parts[5]) || 0,
            image: parts[7] || "/products/placeholder.jpg",
            category_id: parts[8] || undefined,
            stock: parseInt(parts[9]) || 0,
            featured: parts[10] === "true",
            active: parts[11] === "true",
          };
        }
      }
      if (line.startsWith("├─")) dataStarted = true;
    }
    return null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}
