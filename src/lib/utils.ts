import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with conflict resolution
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a price number to a localized string
 * @param price - The price as a number
 * @returns Formatted price string (e.g., "1,234.56")
 */
export function formatPrice(price: number): string {
  return price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Format a price with currency symbol
 * @param price - The price as a number
 * @param currency - Currency code (default: USD)
 * @param locale - Locale for formatting (default: en-US)
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export function formatCurrency(
  price: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  // For Somali locale, show USD without the dollar symbol but with USD suffix
  if (locale === 'so' || locale.startsWith('so')) {
    return `${formatPrice(price)} USD`;
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Generate a WhatsApp message for order inquiries
 * @param customerName - Customer's name
 * @param orderItems - Array of order items with product details
 * @param total - Total order amount
 * @param language - Language for the message ('en' or 'so')
 * @returns WhatsApp message string with proper formatting
 */
export function generateWhatsAppMessage(
  customerName: string,
  orderItems: Array<{ product_name: string; quantity: number; price: number }>,
  total: number,
  language: 'en' | 'so' = 'en'
): string {
  const newline = '%0A'; // URL-encoded newline
  
  if (language === 'so') {
    // Somali message
    let message = `Salaan! Waxaan ahay ${customerName}.%0A`;
    message += `${newline}*DALAB CUSUB*${newline}${newline}`;
    message += `*Qalabka:*${newline}`;
    
    orderItems.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      message += `${index + 1}. ${item.product_name} - ${item.quantity} x $${formatPrice(item.price)} = $${formatPrice(itemTotal)}${newline}`;
    });
    
    message += `${newline}*WADARTO:* $${formatPrice(total)}${newline}`;
    message += `${newline}Fadlan xaqiiji dalabkayga. Mahadsanid!`;
    
    return message;
  }
  
  // English message (default)
  let message = `Hello! I'm ${customerName}.%0A`;
  message += `${newline}*NEW ORDER*${newline}${newline}`;
  message += `*Items:*${newline}`;
  
  orderItems.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    message += `${index + 1}. ${item.product_name} - ${item.quantity} x $${formatPrice(item.price)} = $${formatPrice(itemTotal)}${newline}`;
  });
  
  message += `${newline}*TOTAL:* $${formatPrice(total)}${newline}`;
  message += `${newline}Please confirm my order. Thank you!`;
  
  return message;
}

/**
 * Generate a WhatsApp URL for order inquiries
 * @param phoneNumber - WhatsApp business number (with country code, no + sign)
 * @param message - Pre-formatted message
 * @returns Full WhatsApp URL
 */
export function generateWhatsAppUrl(phoneNumber: string, message: string): string {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanNumber}?text=${message}`;
}

/**
 * Format a phone number for display
 * @param phone - Phone number string
 * @returns Formatted phone number (e.g., "+252 61 234 5678")
 */
export function formatPhoneNumber(phone: string): string {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format Somali numbers (+252)
  if (cleaned.startsWith('252') && cleaned.length === 12) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }
  
  // Format US numbers
  if (cleaned.startsWith('1') && cleaned.length === 11) {
    return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  // Return as-is for other formats
  if (cleaned.length > 10) {
    return `+${cleaned}`;
  }
  return cleaned;
}

/**
 * Slugify a string for URL-friendly paths
 * @param text - Text to slugify
 * @returns Slugified string (e.g., "non-stick-frying-pan")
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Truncate text to a specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncating
 * @param suffix - Suffix to add when truncated (default: "...")
 * @returns Truncated text
 */
export function truncate(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length).trim() + suffix;
}

/**
 * Get localized text based on language preference
 * @param obj - Object containing 'en' and 'so' keys
 * @param lang - Language preference ('en' or 'so')
 * @returns Localized text
 */
export function getLocalizedText(
  obj: { en?: string; so?: string },
  lang: 'en' | 'so' = 'en'
): string {
  return obj[lang] || obj.en || obj.so || '';
}

/**
 * Debounce function for search inputs
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Check if code is running on the client side
 * @returns Boolean indicating if running in browser
 */
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Check if code is running on the server side
 * @returns Boolean indicating if running on server
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * Get the base URL for the application
 * @returns Base URL string
 */
export function getBaseUrl(): string {
  if (isServer()) {
    return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  }
  return window.location.origin;
}