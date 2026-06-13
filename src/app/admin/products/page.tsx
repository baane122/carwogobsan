"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Plus,
  Search,
  ArrowUpDown,
  X,
  Trash2,
  Edit3,
  Loader2,
  AlertCircle,
  CheckCircle,
  Upload,
  ImageIcon,
  Download,
  FileUp,
  FileJson,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Square,
  SquareCheck,
  AlertTriangle,
} from "lucide-react";
import {
  Product,
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts,
  bulkCreateProducts,
  fetchCategories,
  Category,
} from "@/lib/insforge";
import { cn } from "@/lib/utils";

interface ProductFormData {
  name_en: string;
  name_so: string;
  description_en: string;
  description_so: string;
  price: string;
  category_id: string;
  stock: string;
  featured: boolean;
  image: string;
}

interface FormErrors {
  name_en?: string;
  name_so?: string;
  price?: string;
  stock?: string;
  category_id?: string;
  image?: string;
}

interface ImportError {
  row: number;
  message: string;
}

interface ImportResult {
  success: number;
  failed: number;
  errors: ImportError[];
}

// Validation function
function validateForm(data: ProductFormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name_en.trim()) {
    errors.name_en = "English name is required";
  }
  if (!data.name_so.trim()) {
    errors.name_so = "Somali name is required";
  }
  if (!data.price || parseFloat(data.price) <= 0) {
    errors.price = "Price must be greater than 0";
  }
  if (!data.stock || parseInt(data.stock) < 0) {
    errors.stock = "Stock must be 0 or greater";
  }
  if (!data.category_id.trim()) {
    errors.category_id = "Category is required";
  }

  return errors;
}

// Convert file to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Retry wrapper for async operations
async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | undefined;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  throw lastError;
}

// CSV parser
function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values: string[] = [];
    let current = "";
    let inQuotes = false;
    for (const char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx]?.replace(/^"|"$/g, "") || "";
    });
    rows.push(row);
  }
  return rows;
}

// CSV exporter
function exportToCSV(products: Product[]): string {
  const headers = [
    "id",
    "name_en",
    "name_so",
    "description_en",
    "description_so",
    "price",
    "stock",
    "category_id",
    "category",
    "featured",
    "active",
    "image",
  ];
  const rows = products.map((p) =>
    [
      p.id,
      `"${(p.name_en || "").replace(/"/g, '""')}"`,
      `"${(p.name_so || "").replace(/"/g, '""')}"`,
      `"${(p.description_en || "").replace(/"/g, '""')}"`,
      `"${(p.description_so || "").replace(/"/g, '""')}"`,
      p.price,
      p.stock,
      p.category_id || "",
      p.category || "",
      p.featured ? "true" : "false",
      p.active !== false ? "true" : "false",
      p.image || "",
    ].join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

// JSON exporter
function exportToJSON(products: Product[]): string {
  return JSON.stringify(products, null, 2);
}

// Download helper
function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const ITEMS_PER_PAGE = 20;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortField, setSortField] = useState<"name" | "price" | "stock">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Selection
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Import state
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<Product[]>([]);
  const [importErrors, setImportErrors] = useState<ImportError[]>([]);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const importFileRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    name_en: "",
    name_so: "",
    description_en: "",
    description_so: "",
    price: "",
    category_id: "",
    stock: "0",
    featured: false,
    image: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch products and categories on mount
  useEffect(() => {
    void loadProducts();
    void loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await withRetry(() => fetchProducts());
      setProducts(data);
      setCurrentPage(1);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to load products";
      setLoadError(msg);
      showToast("error", "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await withRetry(() => fetchCategories());
      setCategories(data);
    } catch {
      // Silently fail for categories
    }
  };

  // Show toast notification
  const showToast = useCallback((type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== "all" && (p.category_id || "") !== selectedCategory) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          return (
            p.name_en.toLowerCase().includes(q) ||
            p.name_so?.toLowerCase().includes(q) ||
            (p.category || "").toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        const modifier = sortDirection === "asc" ? 1 : -1;
        if (sortField === "price") return (a.price - b.price) * modifier;
        if (sortField === "stock") return (a.stock - b.stock) * modifier;
        return a.name_en.localeCompare(b.name_en) * modifier;
      });
  }, [products, selectedCategory, searchQuery, sortField, sortDirection]);

  // Paginated products
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Selection handlers
  const toggleSelectProduct = (id: string) => {
    setSelectedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    const pageIds = paginatedProducts.map((p) => p.id);
    const allSelected = pageIds.every((id) => selectedProducts.has(id));
    setSelectedProducts((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedProducts(new Set());
  };

  // Open modal for adding new product
  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name_en: "",
      name_so: "",
      description_en: "",
      description_so: "",
      price: "",
      category_id: "",
      stock: "0",
      featured: false,
      image: "",
    });
    setImagePreview("");
    setFormErrors({});
    setShowModal(true);
  };

  // Open modal for editing product
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name_en: product.name_en,
      name_so: product.name_so,
      description_en: product.description_en || "",
      description_so: product.description_so || "",
      price: product.price.toString(),
      category_id: product.category_id || "",
      stock: product.stock.toString(),
      featured: product.featured || false,
      image: product.image || "",
    });
    setImagePreview(product.image || "");
    setFormErrors({});
    setShowModal(true);
  };

  // Update form field
  const updateFormField = (field: keyof ProductFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle image upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await fileToBase64(file);
      setImagePreview(base64);
      setFormData((prev) => ({ ...prev, image: base64 }));
    } catch {
      showToast("error", "Failed to process image");
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);

    try {
      const category = categories.find((c) => c.id === formData.category_id);
      const productData = {
        name_en: formData.name_en,
        name_so: formData.name_so,
        description_en: formData.description_en,
        description_so: formData.description_so,
        price: parseFloat(formData.price),
        image: formData.image || "/products/placeholder.jpg",
        category_id: formData.category_id,
        category: category?.name_en || "",
        stock: parseInt(formData.stock),
        featured: formData.featured,
        active: true,
      };

      if (editingProduct) {
        await withRetry(() => updateProduct(editingProduct.id, productData));
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id
              ? { ...p, ...productData, id: editingProduct.id }
              : p
          )
        );
        showToast("success", "Product updated successfully");
      } else {
        const newProduct = await withRetry(() => createProduct(productData));
        setProducts((prev) => [newProduct, ...prev]);
        showToast("success", "Product added successfully");
      }

      setShowModal(false);
      await loadProducts();
    } catch {
      showToast("error", "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle single delete
  const handleDelete = async (productId: string) => {
    setSubmitting(true);

    try {
      await withRetry(() => deleteProduct(productId));
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setSelectedProducts((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
      setShowDeleteConfirm(null);
      showToast("success", "Product deleted successfully");
    } catch {
      showToast("error", "Failed to delete product");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) return;
    setSubmitting(true);

    try {
      const ids = Array.from(selectedProducts);
      await withRetry(() => bulkDeleteProducts(ids));
      setProducts((prev) => prev.filter((p) => !selectedProducts.has(p.id)));
      showToast("success", `${ids.length} products deleted successfully`);
      setSelectedProducts(new Set());
      setShowBulkDeleteConfirm(false);
    } catch {
      showToast("error", "Failed to delete selected products");
    } finally {
      setSubmitting(false);
    }
  };

  // Export handlers
  const handleExportCSV = () => {
    const csv = exportToCSV(filteredProducts);
    downloadFile(csv, `products-${new Date().toISOString().split("T")[0]}.csv`, "text/csv");
    showToast("success", `${filteredProducts.length} products exported to CSV`);
  };

  const handleExportJSON = () => {
    const json = exportToJSON(filteredProducts);
    downloadFile(json, `products-${new Date().toISOString().split("T")[0]}.json`, "application/json");
    showToast("success", `${filteredProducts.length} products exported to JSON`);
  };

  // Import handlers
  const handleImportFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFile(file);
    setImportResult(null);

    try {
      const text = await file.text();
      let parsed: Record<string, string>[] = [];
      const errors: ImportError[] = [];

      if (file.name.endsWith(".json")) {
        const json = JSON.parse(text);
        if (Array.isArray(json)) {
          parsed = json.map((item) => {
            const row: Record<string, string> = {};
            Object.keys(item).forEach((k) => {
              row[k] = String(item[k] ?? "");
            });
            return row;
          });
        } else {
          errors.push({ row: 0, message: "JSON must be an array of objects" });
        }
      } else {
        parsed = parseCSV(text);
      }

      // Validate and build preview
      const preview: Product[] = [];
      parsed.forEach((row, idx) => {
        const price = parseFloat(row.price || "0");
        const stock = parseInt(row.stock || "0");
        if (!row.name_en || !row.name_so || price <= 0) {
          errors.push({ row: idx + 1, message: `Missing required fields or invalid price at row ${idx + 1}` });
          return;
        }
        preview.push({
          id: `preview-${idx}`,
          name_en: row.name_en,
          name_so: row.name_so,
          description_en: row.description_en || "",
          description_so: row.description_so || "",
          price,
          image: row.image || "/products/placeholder.jpg",
          category_id: row.category_id || "",
          category: row.category || "",
          stock,
          featured: row.featured === "true" || row.featured === "1",
          active: true,
        });
      });

      setImportPreview(preview);
      setImportErrors(errors);
    } catch {
      setImportErrors([{ row: 0, message: "Failed to parse file" }]);
      setImportPreview([]);
    }
  };

  const handleImportSubmit = async () => {
    if (importPreview.length === 0) return;
    setImporting(true);
    setImportResult(null);

    const productsToCreate = importPreview.map((p) => ({
      name_en: p.name_en,
      name_so: p.name_so,
      description_en: p.description_en,
      description_so: p.description_so,
      price: p.price,
      image: p.image,
      category_id: p.category_id,
      category: p.category,
      stock: p.stock,
      featured: p.featured,
      active: true,
    }));

    try {
      await withRetry(() => bulkCreateProducts(productsToCreate));
      setImportResult({ success: productsToCreate.length, failed: 0, errors: [] });
      showToast("success", `${productsToCreate.length} products imported successfully`);
      await loadProducts();
      setImportFile(null);
      setImportPreview([]);
      setImportErrors([]);
      setTimeout(() => setShowImportModal(false), 1500);
    } catch {
      setImportResult({ success: 0, failed: productsToCreate.length, errors: [{ row: 0, message: "Failed to create products" }] });
      showToast("error", "Failed to import products");
    } finally {
      setImporting(false);
    }
  };

  // Get stock status
  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-700" };
    if (stock <= 10) return { label: "Low Stock", color: "bg-yellow-100 text-yellow-700" };
    return { label: "In Stock", color: "bg-emerald-100 text-emerald-700" };
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50"
          >
            <div
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg",
                toast.type === "success"
                  ? "bg-emerald-500 text-white"
                  : "bg-red-500 text-white"
              )}
            >
              {toast.type === "success" ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#111111]">Products</h2>
          <p className="text-sm text-gray-500">Alaabta &mdash; Manage your inventory</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#E5E5E5] bg-white text-[#111111] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <FileUp className="h-4 w-4" />
            Import
          </button>
          <div className="relative group">
            <button
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#E5E5E5] bg-white text-[#111111] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
            <div className="absolute right-0 top-full mt-1 hidden group-hover:flex flex-col bg-white border border-[#E5E5E5] rounded-lg shadow-lg overflow-hidden z-10 min-w-[140px]">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#111111] hover:bg-[#F9F9F9] transition-colors"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                Export CSV
              </button>
              <button
                onClick={handleExportJSON}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#111111] hover:bg-[#F9F9F9] transition-colors"
              >
                <FileJson className="h-4 w-4 text-blue-600" />
                Export JSON
              </button>
            </div>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E60000] text-white rounded-lg text-sm font-medium hover:bg-[#b30000] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666666]" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-[#E5E5E5] bg-white py-2.5 pl-10 pr-4 text-sm focus:border-[#E60000] focus:outline-none focus:ring-1 focus:ring-[#E60000]"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => {
              setSelectedCategory("all");
              setCurrentPage(1);
            }}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              selectedCategory === "all"
                ? "bg-[#E60000] text-white"
                : "bg-white border border-[#E5E5E5] text-[#111111] hover:border-[#E60000]"
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setCurrentPage(1);
              }}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                selectedCategory === cat.id
                  ? "bg-[#E60000] text-white"
                  : "bg-white border border-[#E5E5E5] text-[#111111] hover:border-[#E60000]"
              )}
            >
              {cat.name_en}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedProducts.size > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-between gap-4 px-4 py-3 bg-[#111111] text-white rounded-lg"
          >
            <div className="flex items-center gap-3">
              <SquareCheck className="h-5 w-5 text-[#E60000]" />
              <span className="text-sm font-medium">
                {selectedProducts.size} product{selectedProducts.size !== 1 ? "s" : ""} selected
              </span>
              <button
                onClick={clearSelection}
                className="text-xs text-gray-400 hover:text-white underline"
              >
                Clear
              </button>
            </div>
            <button
              onClick={() => setShowBulkDeleteConfirm(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State with Retry */}
      {loadError && !loading && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <AlertCircle className="h-12 w-12 text-red-400" />
          <div className="text-center">
            <p className="text-sm font-medium text-[#111111]">Failed to load products</p>
            <p className="text-xs text-gray-500 mt-1">{loadError}</p>
          </div>
          <button
            onClick={loadProducts}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E60000] text-white rounded-lg text-sm font-medium hover:bg-[#b30000] transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#E60000]" />
        </div>
      )}

      {/* Products Table */}
      {!loading && !loadError && (
        <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E5E5] bg-[#F9F9F9]">
                  <th className="px-4 py-3">
                    <button
                      onClick={toggleSelectAll}
                      className="p-1 rounded hover:bg-gray-200 transition-colors"
                      title="Select all on page"
                    >
                      {paginatedProducts.every((p) => selectedProducts.has(p.id)) ? (
                        <SquareCheck className="h-5 w-5 text-[#E60000]" />
                      ) : (
                        <Square className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </th>
                  <th className="text-left px-2 py-3 text-sm font-semibold text-[#111111]">Product</th>
                  <th
                    onClick={() => toggleSort("name")}
                    className="text-left px-6 py-3 text-sm font-semibold text-[#111111] cursor-pointer hover:text-[#E60000]"
                  >
                    <span className="flex items-center gap-1">
                      Name
                      <ArrowUpDown className="h-3 w-3" />
                    </span>
                  </th>
                  <th
                    onClick={() => toggleSort("price")}
                    className="text-left px-6 py-3 text-sm font-semibold text-[#111111] cursor-pointer hover:text-[#E60000]"
                  >
                    <span className="flex items-center gap-1">
                      Price
                      <ArrowUpDown className="h-3 w-3" />
                    </span>
                  </th>
                  <th
                    onClick={() => toggleSort("stock")}
                    className="text-left px-6 py-3 text-sm font-semibold text-[#111111] cursor-pointer hover:text-[#E60000]"
                  >
                    <span className="flex items-center gap-1">
                      Stock
                      <ArrowUpDown className="h-3 w-3" />
                    </span>
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-[#111111]">Status</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-[#111111]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock);
                  const isSelected = selectedProducts.has(product.id);
                  return (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={cn(
                        "border-b border-[#E5E5E5] hover:bg-[#F9F9F9] transition-colors",
                        isSelected && "bg-red-50"
                      )}
                    >
                      <td className="px-4 py-4">
                        <button
                          onClick={() => toggleSelectProduct(product.id)}
                          className="p-1 rounded hover:bg-gray-200 transition-colors"
                        >
                          {isSelected ? (
                            <SquareCheck className="h-5 w-5 text-[#E60000]" />
                          ) : (
                            <Square className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </td>
                      <td className="px-2 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-[#F9F9F9] flex items-center justify-center overflow-hidden">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name_en}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <Package className="h-5 w-5 text-[#666666]" />
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-[#111111]">{product.name_en}</p>
                          <p className="text-xs text-[#666666]">{product.name_so}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-[#E60000]">
                          ${product.price.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[#111111]">{product.stock}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                            stockStatus.color
                          )}
                        >
                          {stockStatus.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-2 rounded-lg hover:bg-gray-100 text-[#E60000] transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(product.id)}
                            className="p-2 rounded-lg hover:bg-red-50 text-[#666666] hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No products found</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E5E5] bg-[#F9F9F9]">
              <p className="text-sm text-gray-500">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of{" "}
                {filteredProducts.length} products
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-[#E5E5E5] bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition-colors",
                      currentPage === page
                        ? "bg-[#E60000] text-white"
                        : "border border-[#E5E5E5] bg-white text-[#111111] hover:bg-gray-50"
                    )}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-[#E5E5E5] bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => !submitting && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-[#111111]">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <button
                  onClick={() => !submitting && setShowModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-[#111111] mb-2">
                    Product Image
                  </label>
                  <div className="flex items-center gap-4">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "relative flex items-center justify-center w-32 h-32 rounded-lg border-2 border-dashed cursor-pointer transition-colors",
                        imagePreview
                          ? "border-[#E60000] bg-[#F9F9F9]"
                          : "border-gray-300 hover:border-[#E60000] bg-gray-50"
                      )}
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-gray-400">
                          <ImageIcon className="h-8 w-8 mb-1" />
                          <span className="text-xs">Click to upload</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-[#E5E5E5] rounded-lg text-sm text-[#111111] hover:bg-gray-50 transition-colors"
                      >
                        <Upload className="h-4 w-4" />
                        {imagePreview ? "Change Image" : "Upload Image"}
                      </button>
                      {imagePreview && (
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview("");
                            setFormData((prev) => ({ ...prev, image: "" }));
                          }}
                          className="ml-2 inline-flex items-center gap-2 px-4 py-2 border border-red-200 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Supported formats: JPG, PNG, GIF. Max size: 5MB.
                      </p>
                    </div>
                  </div>
                  {formErrors.image && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.image}</p>
                  )}
                </div>

                {/* Product Names */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-2">
                      Product Name (English) <span className="text-[#E60000]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name_en}
                      onChange={(e) => updateFormField("name_en", e.target.value)}
                      className={cn(
                        "w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-1",
                        formErrors.name_en
                          ? "border-red-500 focus:ring-red-500"
                          : "border-[#E5E5E5] focus:border-[#E60000] focus:ring-[#E60000]"
                      )}
                      placeholder="e.g. Non-Stick Frying Pan"
                    />
                    {formErrors.name_en && (
                      <p className="text-xs text-red-500 mt-1">{formErrors.name_en}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-2">
                      Product Name (Somali) <span className="text-[#E60000]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name_so}
                      onChange={(e) => updateFormField("name_so", e.target.value)}
                      className={cn(
                        "w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-1",
                        formErrors.name_so
                          ? "border-red-500 focus:ring-red-500"
                          : "border-[#E5E5E5] focus:border-[#E60000] focus:ring-[#E60000]"
                      )}
                      placeholder="e.g. Dhiso Albaabada Ah"
                      dir="rtl"
                    />
                    {formErrors.name_so && (
                      <p className="text-xs text-red-500 mt-1">{formErrors.name_so}</p>
                    )}
                  </div>
                </div>

                {/* Descriptions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-2">
                      Description (English)
                    </label>
                    <textarea
                      value={formData.description_en}
                      onChange={(e) => updateFormField("description_en", e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-[#E5E5E5] px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:border-[#E60000] focus:ring-[#E60000] resize-none"
                      placeholder="Product description in English..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-2">
                      Description (Somali)
                    </label>
                    <textarea
                      value={formData.description_so}
                      onChange={(e) => updateFormField("description_so", e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-[#E5E5E5] px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:border-[#E60000] focus:ring-[#E60000] resize-none"
                      placeholder="Sharaxaad alaabta..."
                      dir="rtl"
                    />
                  </div>
                </div>

                {/* Price, Category, Stock */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-2">
                      Price (USD) <span className="text-[#E60000]">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => updateFormField("price", e.target.value)}
                        className={cn(
                          "w-full rounded-lg border px-3 py-2.5 pl-7 text-sm focus:outline-none focus:ring-1",
                          formErrors.price
                            ? "border-red-500 focus:ring-red-500"
                            : "border-[#E5E5E5] focus:border-[#E60000] focus:ring-[#E60000]"
                        )}
                        placeholder="0.00"
                      />
                    </div>
                    {formErrors.price && (
                      <p className="text-xs text-red-500 mt-1">{formErrors.price}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-2">
                      Category <span className="text-[#E60000]">*</span>
                    </label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => updateFormField("category_id", e.target.value)}
                      className={cn(
                        "w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-1 bg-white",
                        !formData.category_id
                          ? "border-red-500 focus:ring-red-500"
                          : "border-[#E5E5E5] focus:border-[#E60000] focus:ring-[#E60000]"
                      )}
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name_en} ({cat.name_so})
                        </option>
                      ))}
                    </select>
                    {!formData.category_id && (
                      <p className="text-xs text-red-500 mt-1">Please select a category</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-2">
                      Stock Quantity <span className="text-[#E60000]">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => updateFormField("stock", e.target.value)}
                      className={cn(
                        "w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-1",
                        formErrors.stock
                          ? "border-red-500 focus:ring-red-500"
                          : "border-[#E5E5E5] focus:border-[#E60000] focus:ring-[#E60000]"
                      )}
                      placeholder="0"
                    />
                    {formErrors.stock && (
                      <p className="text-xs text-red-500 mt-1">{formErrors.stock}</p>
                    )}
                  </div>
                </div>

                {/* Featured */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => updateFormField("featured", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#E60000] focus:ring-[#E60000]"
                  />
                  <label htmlFor="featured" className="text-sm text-[#111111]">
                    Mark as featured product
                  </label>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => !submitting && setShowModal(false)}
                    disabled={submitting}
                    className="px-4 py-2.5 rounded-lg border border-[#E5E5E5] text-sm font-medium text-[#111111] hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E60000] text-white rounded-lg text-sm font-medium hover:bg-[#b30000] transition-colors disabled:opacity-50"
                  >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {editingProduct ? "Update Product" : " Add Product"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => !submitting && setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-red-100">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#111111]">Delete Product</h3>
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete this product? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  disabled={submitting}
                  className="px-4 py-2.5 rounded-lg border border-[#E5E5E5] text-sm font-medium text-[#111111] hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Delete Confirmation Modal */}
      <AnimatePresence>
        {showBulkDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => !submitting && setShowBulkDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#111111]">Delete Selected Products</h3>
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete {selectedProducts.size} selected product{selectedProducts.size !== 1 ? "s" : ""}? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowBulkDeleteConfirm(false)}
                  disabled={submitting}
                  className="px-4 py-2.5 rounded-lg border border-[#E5E5E5] text-sm font-medium text-[#111111] hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Delete {selectedProducts.size}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Import Modal */}
      <AnimatePresence>
        {showImportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => !importing && setShowImportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-[#111111]">Import Products</h3>
                <button
                  onClick={() => !importing && setShowImportModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-[#111111] mb-2">
                    Upload CSV or JSON file
                  </label>
                  <div
                    onClick={() => importFileRef.current?.click()}
                    className={cn(
                      "flex flex-col items-center justify-center w-full h-40 rounded-lg border-2 border-dashed cursor-pointer transition-colors",
                      importFile
                        ? "border-[#E60000] bg-[#F9F9F9]"
                        : "border-gray-300 hover:border-[#E60000] bg-gray-50"
                    )}
                  >
                    {importFile ? (
                      <div className="text-center">
                        <FileUp className="h-8 w-8 text-[#E60000] mx-auto mb-2" />
                        <p className="text-sm font-medium text-[#111111]">{importFile.name}</p>
                        <p className="text-xs text-gray-500">
                          {importPreview.length} product{importPreview.length !== 1 ? "s" : ""} found
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Click to upload CSV or JSON</p>
                        <p className="text-xs text-gray-400 mt-1">
                          CSV columns: name_en, name_so, description_en, description_so, price, stock, category_id, category, featured, image
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={importFileRef}
                    type="file"
                    accept=".csv,.json"
                    onChange={handleImportFileChange}
                    className="hidden"
                  />
                </div>

                {/* Import Errors */}
                {importErrors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <p className="text-sm font-medium text-red-700">Validation Errors</p>
                    </div>
                    <ul className="space-y-1 max-h-32 overflow-y-auto">
                      {importErrors.map((err, idx) => (
                        <li key={idx} className="text-xs text-red-600">
                          Row {err.row}: {err.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Import Preview */}
                {importPreview.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-[#111111] mb-2">
                      Preview ({importPreview.length} products)
                    </p>
                    <div className="max-h-60 overflow-y-auto border border-[#E5E5E5] rounded-lg">
                      <table className="w-full text-sm">
                        <thead className="bg-[#F9F9F9] sticky top-0">
                          <tr>
                            <th className="text-left px-3 py-2 font-medium">Name (EN)</th>
                            <th className="text-left px-3 py-2 font-medium">Price</th>
                            <th className="text-left px-3 py-2 font-medium">Stock</th>
                            <th className="text-left px-3 py-2 font-medium">Category</th>
                          </tr>
                        </thead>
                        <tbody>
                          {importPreview.map((p, idx) => (
                            <tr key={idx} className="border-t border-[#E5E5E5]">
                              <td className="px-3 py-2 text-[#111111]">{p.name_en}</td>
                              <td className="px-3 py-2 text-[#E60000]">${p.price.toFixed(2)}</td>
                              <td className="px-3 py-2">{p.stock}</td>
                              <td className="px-3 py-2 text-gray-500">{p.category || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Import Result */}
                {importResult && (
                  <div
                    className={cn(
                      "rounded-lg p-4",
                      importResult.failed === 0
                        ? "bg-emerald-50 border border-emerald-200"
                        : "bg-red-50 border border-red-200"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {importResult.failed === 0 ? (
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                      <p className="text-sm font-medium">
                        {importResult.success} imported, {importResult.failed} failed
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowImportModal(false);
                      setImportFile(null);
                      setImportPreview([]);
                      setImportErrors([]);
                      setImportResult(null);
                    }}
                    disabled={importing}
                    className="px-4 py-2.5 rounded-lg border border-[#E5E5E5] text-sm font-medium text-[#111111] hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImportSubmit}
                    disabled={importing || importPreview.length === 0}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E60000] text-white rounded-lg text-sm font-medium hover:bg-[#b30000] transition-colors disabled:opacity-50"
                  >
                    {importing && <Loader2 className="h-4 w-4 animate-spin" />}
                    Import {importPreview.length > 0 ? `${importPreview.length} Products` : "Products"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
