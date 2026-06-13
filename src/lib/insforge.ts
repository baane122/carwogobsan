/**
 * Insforge API Client for CARWO GOBSAN
 * Backend integration with Insforge at https://m3tvc3y9.us-east.insforge.app/
 * Project ID: d2ea6873-871d-41ba-8555-bdf000b97bfc
 */

const INSFORGE_BASE_URL = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://m3tvc3y9.us-east.insforge.app';
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID || 'd2ea6873-871d-41ba-8555-bdf000b97bfc';

// Types
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
  category?: string; // Legacy field for backward compatibility
  stock: number;
  featured?: boolean;
  active?: boolean;
  specs?: Record<string, unknown>;
  rating?: number;
  reviewCount?: number;
  originalPrice?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name_en: string;
  name_so: string;
  slug: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  customer_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  items: OrderItem[];
  total: number;
  total_sos?: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  delivery_option?: string;
  district?: string;
  address?: string;
  notes?: string;
  whatsapp_sent?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  district?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Setting {
  id: string;
  key: string;
  value: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${INSFORGE_BASE_URL}/api/${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-project-id': PROJECT_ID,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// ===== CATEGORIES API =====
export async function fetchCategories(): Promise<Category[]> {
  try {
    const data = await apiRequest<{ data: Category[] }>('categories');
    return data.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// ===== PRODUCTS API =====
export async function fetchProducts(): Promise<Product[]> {
  try {
    const data = await apiRequest<{ data: Product[] }>('products');
    return data.data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const data = await apiRequest<{ data: Product }>(`products/${id}`);
    return data.data || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  try {
    const data = await apiRequest<{ data: Product[] }>('products?featured=eq.true');
    return data.data || [];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

export async function fetchProductsByCategory(categoryId: string): Promise<Product[]> {
  try {
    const data = await apiRequest<{ data: Product[] }>(`products?category_id=eq.${categoryId}`);
    return data.data || [];
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
  const data = await apiRequest<{ data: Product }>('products', {
    method: 'POST',
    body: JSON.stringify(product),
  });
  return data.data;
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  const data = await apiRequest<{ data: Product }>(`products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(product),
  });
  return data.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await apiRequest<void>(`products/${id}`, {
    method: 'DELETE',
  });
}

// ===== ORDERS API =====
export async function fetchOrders(): Promise<Order[]> {
  try {
    const data = await apiRequest<{ data: Order[] }>('orders');
    return data.data || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function fetchOrderById(id: string): Promise<Order | null> {
  try {
    const data = await apiRequest<{ data: Order }>(`orders/${id}`);
    return data.data || null;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

export async function createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order> {
  const data = await apiRequest<{ data: Order }>('orders', {
    method: 'POST',
    body: JSON.stringify(order),
  });
  return data.data;
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
  const data = await apiRequest<{ data: Order }>(`orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return data.data;
}

export async function updateOrder(id: string, order: Partial<Order>): Promise<Order> {
  const data = await apiRequest<{ data: Order }>(`orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(order),
  });
  return data.data;
}

// ===== CUSTOMERS API =====
export async function fetchCustomers(): Promise<Customer[]> {
  try {
    const data = await apiRequest<{ data: Customer[] }>('customers');
    return data.data || [];
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
}

export async function createCustomer(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<Customer> {
  const data = await apiRequest<{ data: Customer }>('customers', {
    method: 'POST',
    body: JSON.stringify(customer),
  });
  return data.data;
}

// ===== SETTINGS API =====
export async function fetchSettings(): Promise<Setting[]> {
  try {
    const data = await apiRequest<{ data: Setting[] }>('settings');
    return data.data || [];
  } catch (error) {
    console.error('Error fetching settings:', error);
    return [];
  }
}

export async function getSetting(key: string): Promise<Setting | null> {
  try {
    const data = await apiRequest<{ data: Setting[] }>(`settings?key=eq.${key}`);
    return data.data?.[0] || null;
  } catch (error) {
    console.error('Error fetching setting:', error);
    return null;
  }
}

// ===== WHATSAPP CLICKS API =====
export async function trackWhatsAppClick(productId?: string, page?: string): Promise<void> {
  try {
    await apiRequest<void>('whatsapp_clicks', {
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        page,
        created_at: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('Error tracking WhatsApp click:', error);
  }
}

export async function fetchWhatsAppClicks(): Promise<{ count: number }> {
  try {
    const data = await apiRequest<{ data: { count: number }[] }>('whatsapp_clicks?select=count(*)');
    return { count: data.data?.[0]?.count || 0 };
  } catch (error) {
    console.error('Error fetching WhatsApp clicks:', error);
    return { count: 0 };
  }
}

// ===== HEALTH CHECK =====
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${INSFORGE_BASE_URL}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
}