"use client";

import { useState, useCallback } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer: string;
  phone: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
  location: string;
  address?: string;
  notes?: string;
}

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customer: "Ahmed Hassan",
    phone: "+252 63 1234567",
    items: [
      { name: "iPhone 15 Pro Max", quantity: 1, price: 1199 },
      { name: "AirPods Pro", quantity: 1, price: 149 },
    ],
    total: 1348,
    status: "pending",
    date: "2024-06-12",
    location: "New Hargeisa",
    address: "Main Street, Building 45",
    notes: "Customer requested morning delivery",
  },
  {
    id: "ORD-002",
    customer: "Fatima Ali",
    phone: "+252 63 2345678",
    items: [
      { name: "Samsung 65\" 4K Smart TV", quantity: 1, price: 899 },
    ],
    total: 899,
    status: "processing",
    date: "2024-06-11",
    location: "Golis",
    address: "Golis Market Area, Shop 12",
  },
  {
    id: "ORD-003",
    customer: "Mohamed Ibrahim",
    phone: "+252 63 3456789",
    items: [
      { name: "Dyson V15 Detect Vacuum", quantity: 1, price: 649 },
      { name: "Ninja Air Fryer Pro", quantity: 1, price: 129 },
    ],
    total: 778,
    status: "shipped",
    date: "2024-06-10",
    location: "26 June",
    address: "26 June Road, House 78",
  },
  {
    id: "ORD-004",
    customer: "Amina Yusuf",
    phone: "+252 63 4567890",
    items: [
      { name: "MacBook Air M3", quantity: 1, price: 1099 },
    ],
    total: 1099,
    status: "delivered",
    date: "2024-06-09",
    location: "Airport Area",
    address: "Airport Road, Villa 23",
    notes: "Delivered to security gate",
  },
  {
    id: "ORD-005",
    customer: "Abdirizak Mohamed",
    phone: "+252 63 5678901",
    items: [
      { name: "Sony WH-1000XM5 Headphones", quantity: 1, price: 348 },
      { name: "Bose SoundLink Flex Speaker", quantity: 1, price: 150 },
    ],
    total: 498,
    status: "pending",
    date: "2024-06-12",
    location: "Sha'ab Area",
    address: "Sha'ab District, Block C",
  },
  {
    id: "ORD-006",
    customer: "Halima Omar",
    phone: "+252 63 6789012",
    items: [
      { name: "Non-Stick Frying Pan 28cm", quantity: 2, price: 49.98 },
      { name: "Stainless Steel Pot Set", quantity: 1, price: 89.99 },
    ],
    total: 139.97,
    status: "cancelled",
    date: "2024-06-08",
    location: "Mohamed Moge",
    address: "Mohamed Moge Street, House 15",
    notes: "Customer cancelled - out of stock",
  },
];

const statusConfig = {
  pending: {
    label: "Pending",
    labelSo: "Sugaya",
    icon: Clock,
    color: "bg-amber-100 text-amber-700 border-amber-200",
    dotColor: "bg-amber-500",
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
    color: "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20",
    dotColor: "bg-[#10B981]",
  },
  cancelled: {
    label: "Cancelled",
    labelSo: "La joojiyay",
    icon: XCircle,
    color: "bg-red-100 text-red-700 border-red-200",
    dotColor: "bg-red-500",
  },
};

const statusOptions: Order["status"][] = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<string | null>(null);

  const showToast = useCallback((type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (filterStatus !== "all" && order.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        order.customer.toLowerCase().includes(q) ||
        order.id.toLowerCase().includes(q) ||
        order.phone.includes(q) ||
        order.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    setUpdatingStatus(orderId);
    setStatusDropdownOpen(null);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      
      showToast("success", `Order status updated to ${statusConfig[newStatus].label}`);
    } catch {
      showToast("error", "Failed to update order status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const openOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    revenue: orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0),
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
                <CheckCircle2 className="h-5 w-5" />
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
          <h2 className="text-2xl font-bold text-[#111111]">Orders</h2>
          <p className="text-sm text-gray-500">Dalabada &mdash; Manage customer orders</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Orders", value: stats.total, color: "text-[#111111]" },
          { label: "Pending", value: stats.pending, color: "text-amber-600" },
          { label: "Revenue", value: `$${stats.revenue.toLocaleString()}`, color: "text-[#E60000]" },
          { label: "Delivered", value: stats.delivered, color: "text-[#10B981]" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -2 }}
            className="rounded-xl border border-[#E5E5E5] bg-white p-4"
          >
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {["all", ...statusOptions].map((status) => {
          const count = status === "all" ? orders.length : orders.filter((o) => o.status === status).length;
          const isActive = filterStatus === status;
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
                    statusConfig[status as keyof typeof statusConfig]?.dotColor || "bg-gray-400"
                  )}
                />
              )}
              <span className="capitalize">{status === "all" ? "All Orders" : statusConfig[status as keyof typeof statusConfig]?.label || status}</span>
              <span className={cn("text-xs", isActive ? "text-white/70" : "text-gray-400")}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search orders by customer, ID, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-[#E5E5E5] bg-white py-2.5 pl-4 pr-4 text-sm focus:border-[#E60000] focus:outline-none focus:ring-1 focus:ring-[#E60000]"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E5E5] bg-[#F9F9F9]">
                <th className="text-left px-6 py-3 text-sm font-semibold text-[#111111]">Order ID</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-[#111111]">Customer</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-[#111111]">Items</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-[#111111]">Total</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-[#111111]">Location</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-[#111111]">Status</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-[#111111]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const status = statusConfig[order.status];
                const StatusIcon = status.icon;
                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-[#E5E5E5] hover:bg-[#F9F9F9] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-[#111111]">{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-[#111111]">{order.customer}</p>
                        <p className="text-xs text-[#666666] flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {order.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#666666]">{order.items.length} item(s)</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-[#E60000]">
                        ${order.total.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#666666] flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {order.location}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button
                          onClick={() => setStatusDropdownOpen(statusDropdownOpen === order.id ? null : order.id)}
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
                                    onClick={() => handleStatusChange(order.id, s)}
                                    className={cn(
                                      "flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 transition-colors",
                                      order.status === s ? "font-medium text-[#E60000]" : "text-[#111111]"
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
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openOrderDetail(order)}
                          className="p-2 rounded-lg hover:bg-gray-100 text-[#666666] transition-colors"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
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
              className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-semibold text-[#111111]">Order Details</h3>
                  <p className="text-sm text-gray-500">{selectedOrder.id}</p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <XCircle className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Order Info */}
              <div className="p-6 space-y-6">
                {/* Status Badge */}
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium border",
                    statusConfig[selectedOrder.status].color
                  )}>
                    {(() => {
                      const SIcon = statusConfig[selectedOrder.status].icon;
                      return <SIcon className="h-4 w-4" />;
                    })()}
                    {statusConfig[selectedOrder.status].label}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-[#111111]">Customer Information</h4>
                  <div className="bg-[#F9F9F9] rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#111111] w-20">Name:</span>
                      <span className="text-sm text-[#666666]">{selectedOrder.customer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-[#666666]">{selectedOrder.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-[#666666]">{selectedOrder.location}</span>
                    </div>
                    {selectedOrder.address && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#666666] ml-6">{selectedOrder.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-[#111111]">Order Items</h4>
                  <div className="bg-[#F9F9F9] rounded-lg divide-y divide-gray-100">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3">
                        <div>
                          <p className="text-sm font-medium text-[#111111]">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-semibold text-[#E60000]">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between p-3 border-t-2 border-gray-200">
                      <span className="text-sm font-semibold text-[#111111]">Total</span>
                      <span className="text-lg font-bold text-[#E60000]">
                        ${selectedOrder.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Date */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Ordered on {selectedOrder.date}</span>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs font-medium text-amber-700 mb-1">Notes</p>
                    <p className="text-sm text-amber-600">{selectedOrder.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-4 py-2.5 rounded-lg border border-[#E5E5E5] text-sm font-medium text-[#111111] hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close dropdown */}
      {statusDropdownOpen && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setStatusDropdownOpen(null)}
        />
      )}
    </div>
  );
}
