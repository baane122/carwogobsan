"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  Eye,
  Phone,
  MapPin,
  Calendar,
  Loader2,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Mail,
  Home,
  User,
  Tag,
  Printer,
  FileDown,
  Pencil,
  Save,
  X,
  Bell,
  StickyNote,
  Square,
  SquareCheck,
  ChevronRight,
  Hash,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  fetchOrders as apiFetchOrders,
  updateOrderStatus as apiUpdateOrderStatus,
  updateOrder as apiUpdateOrder,
  type Order,
} from "@/lib/insforge";

type SortField = "date" | "total" | "status";
type SortDirection = "asc" | "desc";

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

const statusConfig: Record<
  Order["status"],
  {
    label: string;
    labelSo: string;
    icon: React.ElementType;
    color: string;
    dotColor: string;
  }
> = {
  pending: {
    label: "Pending",
    labelSo: "Sugaya",
    icon: Clock,
    color: "bg-amber-100 text-amber-700 border-amber-200",
    dotColor: "bg-amber-500",
  },
  confirmed: {
    label: "Confirmed",
    labelSo: "La xaqiijiyay",
    icon: CheckCircle,
    color: "bg-sky-100 text-sky-700 border-sky-200",
    dotColor: "bg-sky-500",
  },
  processing: {
    label: "Processing",
    labelSo: "Wadahayo",
    icon: Package,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    dotColor: "bg-blue-500",
  },
  shipped: {
    label: "Shipped",
    labelSo: "Diray",
    icon: Truck,
    color: "bg-purple-100 text-purple-700 border-purple-200",
    dotColor: "bg-purple-500",
  },
  delivered: {
    label: "Delivered",
    labelSo: "La keenay",
    icon: CheckCircle,
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-500",
  },
  cancelled: {
    label: "Cancelled",
    labelSo: "La joojiyay",
    icon: XCircle,
    color: "bg-red-100 text-red-700 border-red-200",
    dotColor: "bg-red-500",
  },
};

const statusOptions: Order["status"][] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

// Status flow for timeline
const statusFlow: Order["status"][] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: "date",
    direction: "desc",
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<string | null>(
    null
  );
  const [modalStatus, setModalStatus] = useState<Order["status"] | null>(null);
  const [updatingModal, setUpdatingModal] = useState(false);

  // Bulk selection state
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(
    new Set()
  );
  const [bulkDropdownOpen, setBulkDropdownOpen] = useState(false);
  const [updatingBulk, setUpdatingBulk] = useState(false);

  // Notes editing state
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  // Print state
  const [printOrder, setPrintOrder] = useState<Order | null>(null);

  // New order notification state
  const [lastOrderCount, setLastOrderCount] = useState(0);
  const [newOrderAlert, setNewOrderAlert] = useState<{
    count: number;
    show: boolean;
  }>({ count: 0, show: false });
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch orders on mount
  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const data = await apiFetchOrders();
        setOrders(data);
        setLastOrderCount(data.length);
      } catch {
        showToast("error", "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Poll for new orders every 30 seconds
  useEffect(() => {
    const pollForNewOrders = async () => {
      try {
        const data = await apiFetchOrders();
        if (data.length > lastOrderCount && lastOrderCount > 0) {
          const newCount = data.length - lastOrderCount;
          setNewOrderAlert({ count: newCount, show: true });
          // Auto-hide after 10 seconds
          setTimeout(() => {
            setNewOrderAlert((prev) => ({ ...prev, show: false }));
          }, 10000);
        }
        setOrders(data);
        setLastOrderCount(data.length);
      } catch {
        // Silently fail polling
      }
    };

    pollingRef.current = setInterval(pollForNewOrders, 30000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [lastOrderCount]);

  const showToast = useCallback(
    (type: "success" | "error", message: string) => {
      setToast({ type, message });
      setTimeout(() => setToast(null), 3000);
    },
    []
  );

  const handleSort = (field: SortField) => {
    setSortConfig((prev) => ({
      field,
      direction:
        prev.field === field
          ? prev.direction === "asc"
            ? "desc"
            : "asc"
          : "desc",
    }));
  };

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field)
      return <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 text-[#E60000]" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-[#E60000]" />
    );
  };

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Filter by status
    if (filterStatus !== "all") {
      result = result.filter((o) => o.status === filterStatus);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.customer_name.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q) ||
          o.customer_phone.includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortConfig.field) {
        case "date":
          comparison =
            new Date(a.created_at || 0).getTime() -
            new Date(b.created_at || 0).getTime();
          break;
        case "total":
          comparison = (a.total || 0) - (b.total || 0);
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return result;
  }, [orders, filterStatus, searchQuery, sortConfig]);

  // Bulk selection handlers
  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrderIds((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedOrderIds.size === filteredOrders.length && filteredOrders.length > 0) {
      setSelectedOrderIds(new Set());
    } else {
      setSelectedOrderIds(new Set(filteredOrders.map((o) => o.id)));
    }
  };

  const clearSelection = () => {
    setSelectedOrderIds(new Set());
  };

  const handleBulkStatusChange = async (newStatus: Order["status"]) => {
    if (selectedOrderIds.size === 0) return;
    setUpdatingBulk(true);
    setBulkDropdownOpen(false);

    const ids = Array.from(selectedOrderIds);
    try {
      await Promise.all(
        ids.map((id) => apiUpdateOrderStatus(id, newStatus))
      );
      setOrders((prev) =>
        prev.map((o) =>
          selectedOrderIds.has(o.id) ? { ...o, status: newStatus } : o
        )
      );
      showToast(
        "success",
        `${ids.length} order(s) updated to ${statusConfig[newStatus].label}`
      );
      clearSelection();
    } catch {
      showToast("error", "Failed to update some orders");
    } finally {
      setUpdatingBulk(false);
    }
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    setUpdatingStatus(orderId);
    setStatusDropdownOpen(null);

    try {
      await apiUpdateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      showToast(
        "success",
        `Order status updated to ${statusConfig[newStatus].label}`
      );
    } catch {
      showToast("error", "Failed to update order status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleModalStatusChange = async (newStatus: Order["status"]) => {
    if (!selectedOrder) return;
    setUpdatingModal(true);

    try {
      await apiUpdateOrderStatus(selectedOrder.id, newStatus);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: newStatus } : o
        )
      );
      setModalStatus(newStatus);
      showToast(
        "success",
        `Order status updated to ${statusConfig[newStatus].label}`
      );
    } catch {
      showToast("error", "Failed to update order status");
    } finally {
      setUpdatingModal(false);
    }
  };

  // Notes editing
  const startEditingNotes = () => {
    if (!selectedOrder) return;
    setNotesValue(selectedOrder.notes || "");
    setEditingNotes(true);
  };

  const cancelEditingNotes = () => {
    setEditingNotes(false);
    setNotesValue("");
  };

  const saveNotes = async () => {
    if (!selectedOrder) return;
    setSavingNotes(true);
    try {
      await apiUpdateOrder(selectedOrder.id, { notes: notesValue });
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id ? { ...o, notes: notesValue } : o
        )
      );
      setSelectedOrder((prev) =>
        prev ? { ...prev, notes: notesValue } : null
      );
      setEditingNotes(false);
      showToast("success", "Order notes saved");
    } catch {
      showToast("error", "Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      "Order ID",
      "Customer Name",
      "Phone",
      "Email",
      "District",
      "Address",
      "Items",
      "Total",
      "Status",
      "Delivery Option",
      "Notes",
      "Created At",
      "Updated At",
    ];

    const rows = filteredOrders.map((order) => [
      order.id,
      order.customer_name,
      order.customer_phone,
      order.customer_email || "",
      order.district || "",
      order.address || "",
      order.items?.map((i) => `${i.product_name} x${i.quantity}`).join("; ") || "",
      order.total?.toString() || "0",
      statusConfig[order.status].label,
      order.delivery_option || "",
      order.notes || "",
      order.created_at || "",
      order.updated_at || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `orders_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast("success", `${filteredOrders.length} orders exported to CSV`);
  };

  // Print order
  const handlePrintOrder = (order: Order) => {
    setPrintOrder(order);
    // Use setTimeout to allow state update before printing
    setTimeout(() => {
      window.print();
      setPrintOrder(null);
    }, 100);
  };

  const openOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setModalStatus(order.status);
    setEditingNotes(false);
    setNotesValue(order.notes || "");
    setShowDetailModal(true);
  };

  // Calculate stats
  const stats = useMemo(() => {
    const activeOrders = orders.filter((o) => o.status !== "cancelled");
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      processing: orders.filter((o) => o.status === "processing").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
      revenue: activeOrders.reduce((sum, o) => sum + (o.total || 0), 0),
    };
  }, [orders]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return "$0.00";
    return `$${amount.toFixed(2)}`;
  };

  const isAllSelected =
    filteredOrders.length > 0 &&
    selectedOrderIds.size === filteredOrders.length;

  return (
    <div className="space-y-6">
      {/* Print-only styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area,
          .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Print Area (hidden on screen) */}
      {printOrder && (
        <div className="print-area fixed inset-0 bg-white z-[9999] overflow-auto">
          <div className="max-w-2xl mx-auto p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-[#111111]">CARWO GOBSAN</h1>
              <p className="text-sm text-gray-500">Order Receipt</p>
              <div className="mt-2 h-1 w-24 bg-[#E60000] mx-auto" />
            </div>

            <div className="mb-6">
              <div className="flex justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-500">Order ID</p>
                  <p className="text-sm font-semibold">{printOrder.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm font-semibold">
                    {formatDate(printOrder.created_at)}
                  </p>
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="text-sm font-semibold">
                    {statusConfig[printOrder.status].label}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-b border-gray-200 py-4 mb-6">
              <h3 className="text-sm font-semibold mb-3">Customer Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><span className="text-gray-500">Name:</span> {printOrder.customer_name}</p>
                <p><span className="text-gray-500">Phone:</span> {printOrder.customer_phone}</p>
                {printOrder.customer_email && (
                  <p><span className="text-gray-500">Email:</span> {printOrder.customer_email}</p>
                )}
                {printOrder.district && (
                  <p><span className="text-gray-500">District:</span> {printOrder.district}</p>
                )}
                {printOrder.address && (
                  <p className="col-span-2"><span className="text-gray-500">Address:</span> {printOrder.address}</p>
                )}
                {printOrder.delivery_option && (
                  <p className="col-span-2"><span className="text-gray-500">Delivery:</span> {printOrder.delivery_option}</p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">Order Items</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">Item</th>
                    <th className="text-center py-2">Qty</th>
                    <th className="text-right py-2">Price</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {printOrder.items?.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="py-2">{item.product_name}</td>
                      <td className="text-center py-2">{item.quantity}</td>
                      <td className="text-right py-2">{formatCurrency(item.price)}</td>
                      <td className="text-right py-2 font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end mt-4 pt-2 border-t border-gray-200">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-xl font-bold text-[#E60000]">
                    {formatCurrency(printOrder.total)}
                  </p>
                  {printOrder.total_sos && (
                    <p className="text-sm text-gray-600">
                      {printOrder.total_sos.toLocaleString()} SOS
                    </p>
                  )}
                </div>
              </div>
            </div>

            {printOrder.notes && (
              <div className="border-t border-gray-200 pt-4 mb-6">
                <h3 className="text-sm font-semibold mb-2">Notes</h3>
                <p className="text-sm text-gray-600">{printOrder.notes}</p>
              </div>
            )}

            <div className="text-center text-xs text-gray-400 mt-8 pt-4 border-t border-gray-200">
              <p>Thank you for shopping with CARWO GOBSAN</p>
              <p>Printed on {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

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
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Order Alert */}
      <AnimatePresence>
        {newOrderAlert.show && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed top-20 right-6 z-50"
          >
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg bg-[#E60000] text-white">
              <Bell className="h-5 w-5 animate-bounce" />
              <div>
                <p className="text-sm font-medium">
                  {newOrderAlert.count} new order{newOrderAlert.count > 1 ? "s" : ""} received!
                </p>
                <p className="text-xs text-white/80">
                  Refresh to see the latest orders
                </p>
              </div>
              <button
                onClick={() =>
                  setNewOrderAlert((prev) => ({ ...prev, show: false }))
                }
                className="ml-2 p-1 hover:bg-white/20 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#111111]">Orders</h2>
          <p className="text-sm text-gray-500">
            Dalabada &mdash; Manage customer orders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E5E5E5] bg-white text-sm font-medium text-[#111111] hover:border-[#E60000] hover:text-[#E60000] transition-colors"
          >
            <FileDown className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Orders",
            value: stats.total,
            color: "text-[#111111]",
          },
          { label: "Pending", value: stats.pending, color: "text-amber-600" },
          {
            label: "Revenue",
            value: `$${stats.revenue.toLocaleString()}`,
            color: "text-[#E60000]",
          },
          {
            label: "Delivered",
            value: stats.delivered,
            color: "text-emerald-600",
          },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -2 }}
            className="rounded-xl border border-[#E5E5E5] bg-white p-4"
          >
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className={cn("text-2xl font-bold", stat.color)}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {["all", ...statusOptions].map((status) => {
          const count =
            status === "all"
              ? orders.length
              : orders.filter((o) => o.status === status).length;
          const isActive = filterStatus === status;
          const statusKey = status as Order["status"];
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-[#E60000] text-white shadow-md shadow-[#E60000]/20"
                  : "bg-white border border-[#E5E5E5] text-[#111111] hover:border-[#E60000]"
              )}
            >
              {status !== "all" && (
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    statusConfig[statusKey]?.dotColor || "bg-gray-400"
                  )}
                />
              )}
              <span className="capitalize">
                {status === "all"
                  ? "All Orders"
                  : statusConfig[statusKey]?.label || status}
              </span>
              <span
                className={cn(
                  "text-xs",
                  isActive ? "text-white/70" : "text-gray-400"
                )}
              >
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search orders by customer name or order ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-[#E5E5E5] bg-white py-2.5 pl-10 pr-4 text-sm focus:border-[#E60000] focus:outline-none focus:ring-1 focus:ring-[#E60000]"
        />
      </div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedOrderIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between bg-[#111111] text-white rounded-lg px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">
                {selectedOrderIds.size} selected
              </span>
              <button
                onClick={clearSelection}
                className="text-xs text-gray-400 hover:text-white underline"
              >
                Clear
              </button>
            </div>
            <div className="relative">
              <button
                onClick={() => setBulkDropdownOpen(!bulkDropdownOpen)}
                disabled={updatingBulk}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#E60000] text-white text-sm font-medium hover:bg-[#cc0000] transition-colors disabled:opacity-50"
              >
                {updatingBulk ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Update Status
                    <ChevronDown className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
              <AnimatePresence>
                {bulkDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute top-full right-0 mt-1 z-30 bg-white rounded-lg border border-gray-200 shadow-lg py-1 min-w-[180px]"
                  >
                    {statusOptions.map((s) => {
                      const sConfig = statusConfig[s];
                      const SIcon = sConfig.icon;
                      return (
                        <button
                          key={s}
                          onClick={() => handleBulkStatusChange(s)}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#111111] hover:bg-gray-50 transition-colors"
                        >
                          <SIcon className="h-3.5 w-3.5" />
                          {sConfig.label}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[#E60000]" />
          <span className="ml-3 text-sm text-gray-500">Loading orders...</span>
        </div>
      )}

      {/* Orders Table */}
      {!loading && (
        <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E5E5] bg-[#F9F9F9]">
                  <th className="px-4 py-3">
                    <button
                      onClick={toggleSelectAll}
                      className="p-1 rounded hover:bg-gray-200 transition-colors"
                      title={isAllSelected ? "Deselect all" : "Select all"}
                    >
                      {isAllSelected ? (
                        <SquareCheck className="h-5 w-5 text-[#E60000]" />
                      ) : (
                        <Square className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-[#111111]">
                    Order ID
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-[#111111]">
                    Customer
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-[#111111]">
                    Items
                  </th>
                  <th
                    className="text-left px-4 py-3 text-sm font-semibold text-[#111111] cursor-pointer hover:text-[#E60000] transition-colors"
                    onClick={() => handleSort("total")}
                  >
                    <div className="flex items-center gap-1">
                      Total
                      {getSortIcon("total")}
                    </div>
                  </th>
                  <th
                    className="text-left px-4 py-3 text-sm font-semibold text-[#111111] cursor-pointer hover:text-[#E60000] transition-colors"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      {getSortIcon("status")}
                    </div>
                  </th>
                  <th
                    className="text-left px-4 py-3 text-sm font-semibold text-[#111111] cursor-pointer hover:text-[#E60000] transition-colors"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      {getSortIcon("date")}
                    </div>
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-[#111111]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const status = statusConfig[order.status];
                  const StatusIcon = status.icon;
                  const isSelected = selectedOrderIds.has(order.id);
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={cn(
                        "border-b border-[#E5E5E5] hover:bg-[#F9F9F9] transition-colors",
                        isSelected && "bg-[#E60000]/5"
                      )}
                    >
                      <td className="px-4 py-4">
                        <button
                          onClick={() => toggleOrderSelection(order.id)}
                          className="p-1 rounded hover:bg-gray-200 transition-colors"
                        >
                          {isSelected ? (
                            <SquareCheck className="h-5 w-5 text-[#E60000]" />
                          ) : (
                            <Square className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-medium text-[#111111]">
                          {order.id}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm font-medium text-[#111111]">
                            {order.customer_name}
                          </p>
                          <p className="text-xs text-[#666666] flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {order.customer_phone}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-[#666666]">
                          {order.items?.length || 0} item(s)
                        </span>
                        <p className="text-xs text-gray-400 truncate max-w-[200px]">
                          {order.items
                            ?.map((i) => i.product_name)
                            .join(", ")}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-semibold text-[#E60000]">
                          {formatCurrency(order.total)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="relative">
                          <button
                            onClick={() =>
                              setStatusDropdownOpen(
                                statusDropdownOpen === order.id
                                  ? null
                                  : order.id
                              )
                            }
                            disabled={updatingStatus === order.id}
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border cursor-pointer transition-all",
                              status.color
                            )}
                          >
                            {updatingStatus === order.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <StatusIcon className="h-3 w-3" />
                            )}
                            {status.label}
                            <ChevronDown className="h-3 w-3 ml-1" />
                          </button>

                          {/* Status Dropdown */}
                          <AnimatePresence>
                            {statusDropdownOpen === order.id && (
                              <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="absolute top-full left-0 mt-1 z-30 bg-white rounded-lg border border-gray-200 shadow-lg py-1 min-w-[160px]"
                              >
                                {statusOptions.map((s) => {
                                  const sConfig = statusConfig[s];
                                  const SIcon = sConfig.icon;
                                  return (
                                    <button
                                      key={s}
                                      onClick={() =>
                                        handleStatusChange(order.id, s)
                                      }
                                      className={cn(
                                        "flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 transition-colors",
                                        order.status === s
                                          ? "font-medium text-[#E60000]"
                                          : "text-[#111111]"
                                      )}
                                    >
                                      <SIcon className="h-3.5 w-3.5" />
                                      {sConfig.label}
                                    </button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-[#666666] flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(order.created_at)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openOrderDetail(order)}
                            className="p-2 rounded-lg hover:bg-gray-100 text-[#666666] transition-colors"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handlePrintOrder(order)}
                            className="p-2 rounded-lg hover:bg-gray-100 text-[#666666] transition-colors"
                            title="Print order"
                          >
                            <Printer className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No orders found</p>
            </div>
          )}
        </div>
      )}

      {/* Order Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowDetailModal(false)}
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
                <div>
                  <h3 className="text-lg font-semibold text-[#111111]">
                    Order Details
                  </h3>
                  <p className="text-sm text-gray-500">{selectedOrder.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePrintOrder(selectedOrder)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-[#666666] transition-colors"
                    title="Print order"
                  >
                    <Printer className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <XCircle className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Order Info */}
              <div className="p-6 space-y-6">
                {/* Status Badge & Update */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium border",
                      statusConfig[modalStatus || selectedOrder.status].color
                    )}
                  >
                    {(() => {
                      const SIcon =
                        statusConfig[modalStatus || selectedOrder.status].icon;
                      return <SIcon className="h-4 w-4" />;
                    })()}
                    {statusConfig[modalStatus || selectedOrder.status].label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      Update Status:
                    </span>
                    <select
                      value={modalStatus || selectedOrder.status}
                      onChange={(e) =>
                        handleModalStatusChange(e.target.value as Order["status"])
                      }
                      disabled={updatingModal}
                      className="rounded-lg border border-[#E5E5E5] bg-white py-1.5 px-3 text-sm focus:border-[#E60000] focus:outline-none focus:ring-1 focus:ring-[#E60000]"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {statusConfig[s].label}
                        </option>
                      ))}
                    </select>
                    {updatingModal && (
                      <Loader2 className="h-4 w-4 animate-spin text-[#E60000]" />
                    )}
                  </div>
                </div>

                {/* Order Timeline */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-[#111111] flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Order Timeline
                  </h4>
                  <div className="flex items-center gap-1 overflow-x-auto pb-2">
                    {statusFlow.map((s, idx) => {
                      const currentIdx = statusFlow.indexOf(
                        selectedOrder.status
                      );
                      const isCompleted = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;
                      const sConfig = statusConfig[s];
                      const SIcon = sConfig.icon;
                      return (
                        <div key={s} className="flex items-center">
                          <div
                            className={cn(
                              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap",
                              isCurrent
                                ? sConfig.color
                                : isCompleted
                                  ? "bg-gray-100 text-gray-600 border-gray-200"
                                  : "bg-gray-50 text-gray-400 border-gray-100"
                            )}
                          >
                            <SIcon className="h-3 w-3" />
                            {sConfig.label}
                          </div>
                          {idx < statusFlow.length - 1 && (
                            <ChevronRight
                              className={cn(
                                "h-3.5 w-3.5 mx-1 shrink-0",
                                isCompleted
                                  ? "text-gray-400"
                                  : "text-gray-200"
                              )}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-[#111111] flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Customer Information
                  </h4>
                  <div className="bg-[#F9F9F9] rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-[#111111] w-20">
                        Order ID:
                      </span>
                      <span className="text-sm text-[#666666]">
                        {selectedOrder.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-[#111111] w-20">
                        Name:
                      </span>
                      <span className="text-sm text-[#666666]">
                        {selectedOrder.customer_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-[#111111] w-20">
                        Phone:
                      </span>
                      <span className="text-sm text-[#666666]">
                        {selectedOrder.customer_phone}
                      </span>
                    </div>
                    {selectedOrder.customer_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-[#111111] w-20">
                          Email:
                        </span>
                        <span className="text-sm text-[#666666]">
                          {selectedOrder.customer_email}
                        </span>
                      </div>
                    )}
                    {selectedOrder.district && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-[#111111] w-20">
                          District:
                        </span>
                        <span className="text-sm text-[#666666]">
                          {selectedOrder.district}
                        </span>
                      </div>
                    )}
                    {selectedOrder.address && (
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-[#111111] w-20">
                          Address:
                        </span>
                        <span className="text-sm text-[#666666]">
                          {selectedOrder.address}
                        </span>
                      </div>
                    )}
                    {selectedOrder.delivery_option && (
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-[#111111] w-20">
                          Delivery:
                        </span>
                        <span className="text-sm text-[#666666]">
                          {selectedOrder.delivery_option}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-[#111111] flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Order Items
                  </h4>
                  <div className="bg-[#F9F9F9] rounded-lg divide-y divide-gray-100">
                    {selectedOrder.items?.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-[#111111]">
                            {item.product_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity} x {formatCurrency(item.price)}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-[#E60000]">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between p-3 border-t-2 border-gray-200">
                      <span className="text-sm font-semibold text-[#111111]">
                        Total
                      </span>
                      <span className="text-lg font-bold text-[#E60000]">
                        {formatCurrency(selectedOrder.total)}
                      </span>
                    </div>
                    {selectedOrder.total_sos && (
                      <div className="flex items-center justify-between p-3">
                        <span className="text-sm text-[#666666]">
                          Total (SOS)
                        </span>
                        <span className="text-sm font-semibold text-[#111111]">
                          {selectedOrder.total_sos.toLocaleString()} SOS
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Date & Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Ordered on {formatDate(selectedOrder.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <span>Updated {formatDate(selectedOrder.updated_at)}</span>
                  </div>
                  {selectedOrder.whatsapp_sent && (
                    <div className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>WhatsApp sent</span>
                    </div>
                  )}
                </div>

                {/* Editable Notes */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-[#111111] flex items-center gap-2">
                      <StickyNote className="h-4 w-4" />
                      Order Notes
                    </h4>
                    {!editingNotes && (
                      <button
                        onClick={startEditingNotes}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-[#E60000] hover:bg-[#E60000]/10 transition-colors"
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </button>
                    )}
                  </div>
                  {editingNotes ? (
                    <div className="space-y-2">
                      <textarea
                        value={notesValue}
                        onChange={(e) => setNotesValue(e.target.value)}
                        placeholder="Add notes about this order..."
                        rows={3}
                        className="w-full rounded-lg border border-[#E5E5E5] bg-white p-3 text-sm focus:border-[#E60000] focus:outline-none focus:ring-1 focus:ring-[#E60000] resize-none"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={saveNotes}
                          disabled={savingNotes}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E60000] text-white text-xs font-medium hover:bg-[#cc0000] transition-colors disabled:opacity-50"
                        >
                          {savingNotes ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Save className="h-3 w-3" />
                          )}
                          Save Notes
                        </button>
                        <button
                          onClick={cancelEditingNotes}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E5E5] text-xs font-medium text-[#111111] hover:bg-gray-50 transition-colors"
                        >
                          <X className="h-3 w-3" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : selectedOrder.notes ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-sm text-amber-800">
                        {selectedOrder.notes}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg p-3">
                      <p className="text-sm text-gray-400 italic">
                        No notes added yet. Click Edit to add notes.
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handlePrintOrder(selectedOrder)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E5E5E5] text-sm font-medium text-[#111111] hover:bg-gray-50 transition-colors"
                  >
                    <Printer className="h-4 w-4" />
                    Print
                  </button>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-4 py-2.5 rounded-lg bg-[#111111] text-white text-sm font-medium hover:bg-[#333333] transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close dropdowns */}
      {(statusDropdownOpen || bulkDropdownOpen) && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => {
            setStatusDropdownOpen(null);
            setBulkDropdownOpen(false);
          }}
        />
      )}
    </div>
  );
}
