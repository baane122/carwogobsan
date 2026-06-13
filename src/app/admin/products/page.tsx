"use client";

import { useState, useCallback } from "react";
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
} from "lucide-react";
import { Product } from "@/lib/insforge";
import { mockProducts } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface ProductFormData {
  name_en: string;
  name_so: string;
  description_en: string;
  description_so: string;
  price: string;
  category: string;
  stock: string;
  featured: boolean;
}

interface FormErrors {
  name_en?: string;
  name_so?: string;
  price?: string;
  stock?: string;
}

const categories = ["Cookware", "Small Appliances", "Tableware"];

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
  
  return errors;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortField, setSortField] = useState<"name" | "price" | "stock">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    name_en: "",
    name_so: "",
    description_en: "",
    description_so: "",
    price: "",
    category: "Cookware",
    stock: "0",
    featured: false,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Show toast notification
  const showToast = useCallback((type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Filter and sort products
  const filteredProducts = products
    .filter((p) => {
      if (selectedCategory !== "all" && (p.category || "") !== selectedCategory) return false;
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

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
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
      category: "Cookware",
      stock: "0",
      featured: false,
    });
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
      category: product.category || "Cookware",
      stock: product.stock.toString(),
      featured: product.featured || false,
    });
    setFormErrors({});
    setShowModal(true);
  };

  // Update form field
  const updateFormField = (field: keyof ProductFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (editingProduct) {
        // Update existing product
        const updatedProduct: Product = {
          ...editingProduct,
          name_en: formData.name_en,
          name_so: formData.name_so,
          description_en: formData.description_en,
          description_so: formData.description_so,
          price: parseFloat(formData.price),
          category: formData.category,
          stock: parseInt(formData.stock),
          featured: formData.featured,
        };
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? updatedProduct : p))
        );
        showToast("success", "Product updated successfully");
      } else {
        // Add new product
        const newProduct: Product = {
          id: `prod-${Date.now()}`,
          name_en: formData.name_en,
          name_so: formData.name_so,
          description_en: formData.description_en,
          description_so: formData.description_so,
          price: parseFloat(formData.price),
          image: "/products/placeholder.jpg",
          category: formData.category,
          stock: parseInt(formData.stock),
          featured: formData.featured,
        };
        setProducts((prev) => [newProduct, ...prev]);
        showToast("success", "Product added successfully");
      }
      
      setShowModal(false);
    } catch {
      showToast("error", "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (productId: string) => {
    setSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setShowDeleteConfirm(null);
      showToast("success", "Product deleted successfully");
    } catch {
      showToast("error", "Failed to delete product");
    } finally {
      setSubmitting(false);
    }
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
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E60000] text-white rounded-lg text-sm font-medium hover:bg-[#b30000] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666666]" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[#E5E5E5] bg-white py-2.5 pl-10 pr-4 text-sm focus:border-[#E60000] focus:outline-none focus:ring-1 focus:ring-[#E60000]"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                selectedCategory === cat
                  ? "bg-[#E60000] text-white"
                  : "bg-white border border-[#E5E5E5] text-[#111111] hover:border-[#E60000]"
              )}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E5E5] bg-[#F9F9F9]">
                <th className="text-left px-6 py-3 text-sm font-semibold text-[#111111]">Product</th>
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
              {filteredProducts.map((product) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-[#E5E5E5] hover:bg-[#F9F9F9] transition-colors"
                >
                  <td className="px-6 py-4">
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
                        product.stock > 20
                          ? "bg-[#10B981]/10 text-[#10B981]"
                          : product.stock > 0
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      )}
                    >
                      {product.stock > 20 ? "In Stock" : product.stock > 0 ? "Low Stock" : "Out of Stock"}
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
              ))}
            </tbody>
          </table>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No products found</p>
            </div>
          )}
        </div>
      </div>

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
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => updateFormField("category", e.target.value)}
                      className="w-full rounded-lg border border-[#E5E5E5] px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:border-[#E60000] focus:ring-[#E60000] bg-white"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
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
                    {editingProduct ? "Update Product" : "Add Product"}
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
    </div>
  );
}
