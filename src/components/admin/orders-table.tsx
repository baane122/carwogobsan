"use client";

import { cn } from "@/lib/utils";
import { Eye, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export interface Order {
  id: string;
  customer: string;
  phone: string;
  items: number;
  totalUsd: number;
  totalSos: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
  whatsappClicked: boolean;
}

interface OrdersTableProps {
  orders?: Order[];
  showActions?: boolean;
}

const statusConfig = {
  pending: {
    label: "Pending",
    labelSo: "Sugayaal",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Package,
  },
  processing: {
    label: "Processing",
    labelSo: "Wadahayo",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Package,
  },
  shipped: {
    label: "Shipped",
    labelSo: "Diray",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    labelSo: "La keenay",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    labelSo: "La joojiyay",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: XCircle,
  },
};

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customer: "Ahmed Hassan",
    phone: "+252 61 234 5678",
    items: 3,
    totalUsd: 145.5,
    totalSos: 84390,
    status: "pending",
    date: "2024-06-12",
    whatsappClicked: true,
  },
  {
    id: "ORD-002",
    customer: "Fatima Ali",
    phone: "+252 63 456 7890",
    items: 1,
    totalUsd: 89.99,
    totalSos: 52194,
    status: "processing",
    date: "2024-06-11",
    whatsappClicked: true,
  },
  {
    id: "ORD-003",
    customer: "Mohamed Ibrahim",
    phone: "+252 65 789 0123",
    items: 5,
    totalUsd: 320.0,
    totalSos: 185600,
    status: "shipped",
    date: "2024-06-10",
    whatsappClicked: false,
  },
  {
    id: "ORD-004",
    customer: "Amina Yusuf",
    phone: "+252 61 345 6789",
    items: 2,
    totalUsd: 67.5,
    totalSos: 39150,
    status: "delivered",
    date: "2024-06-09",
    whatsappClicked: true,
  },
  {
    id: "ORD-005",
    customer: "Abdirizak Omar",
    phone: "+252 63 890 1234",
    items: 1,
    totalUsd: 199.0,
    totalSos: 115420,
    status: "cancelled",
    date: "2024-06-08",
    whatsappClicked: false,
  },
];

export function OrdersTable({
  orders = mockOrders,
  showActions = true,
}: OrdersTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                Order ID
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                Customer
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                Items
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                Total
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                Status
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                Date
              </th>
              {showActions && (
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;
              return (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm font-medium text-[#111111]">
                      {order.id}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-[#111111]">
                        {order.customer}
                      </p>
                      <p className="text-xs text-gray-500">{order.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700">{order.items}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-[#111111]">
                        ${order.totalUsd.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.totalSos.toLocaleString()} S
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                        status.color
                      )}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">{order.date}</span>
                  </td>
                  {showActions && (
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/orders?order=${order.id}`}
                        className="inline-flex items-center gap-1 text-sm text-[#E60000] hover:text-[#b30000] font-medium transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
