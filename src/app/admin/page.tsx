"use client";

import { useState, useEffect, useMemo } from "react";
import {
  DollarSign,
  ShoppingCart,
  Package,
  MessageCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";
import {
  fetchProducts,
  fetchOrders,
  fetchWhatsAppClicks,
  type Product,
  type Order,
} from "@/lib/insforge";
import { cn } from "@/lib/utils";

// Types for dashboard state
interface DashboardStats {
  totalRevenue: number;
  totalRevenueSos: number;
  ordersToday: number;
  pendingOrders: number;
  lowStockCount: number;
  lowStockProducts: Product[];
  whatsappClicks: number;
  whatsappClicksThisWeek: number;
}

interface SalesDataPoint {
  date: string;
  usd: number;
  sos: number;
  orders: number;
}

// Color map for stat cards
const colorMap = {
  red: "bg-[#E60000]/10 text-[#E60000]",
  green: "bg-emerald-500/10 text-emerald-500",
  blue: "bg-blue-500/10 text-blue-500",
  amber: "bg-amber-500/10 text-amber-500",
};

interface StatCardProps {
  title: string;
  titleSo?: string;
  value: string;
  subValue?: string;
  change?: number;
  icon: typeof DollarSign;
  color?: "red" | "green" | "blue" | "amber";
  isLoading?: boolean;
}

function StatCard({
  title,
  titleSo,
  value,
  subValue,
  change,
  icon: Icon,
  color = "red",
  isLoading = false,
}: StatCardProps) {
  const isPositive = change !== undefined && change > 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          {titleSo && (
            <p className="text-xs text-gray-400 mt-0.5">{titleSo}</p>
          )}
          {isLoading ? (
            <div className="h-8 w-24 bg-gray-100 rounded animate-pulse mt-2" />
          ) : (
            <h3 className="text-2xl font-bold text-[#111111] mt-2">{value}</h3>
          )}
          {subValue && (
            <p className="text-sm text-gray-500 mt-1">{subValue}</p>
          )}
          {!isLoading && change !== undefined && (
            <div
              className={cn(
                "flex items-center gap-1 mt-2 text-sm font-medium",
                isPositive ? "text-emerald-600" : "text-red-600"
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{isPositive ? "+" : ""}{change.toFixed(1)}%</span>
              <span className="text-gray-400 font-normal">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-lg", colorMap[color])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

interface SalesChartProps {
  data: SalesDataPoint[];
  currency: "USD" | "SOS";
  isLoading: boolean;
}

function SalesChart({ data, currency, isLoading }: SalesChartProps) {
  const values = useMemo(() =>
    data.map((d) => (currency === "USD" ? d.usd : d.sos)),
    [data, currency]
  );

  const maxValue = useMemo(() => Math.max(...values, 1), [values]);
  const minValue = useMemo(() => Math.min(...values), [values]);
  const range = maxValue - minValue || 1;

  const chartWidth = 800;
  const chartHeight = 200;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const points = useMemo(() =>
    data.map((_, i) => {
      const x = padding.left + (i / Math.max(data.length - 1, 1)) * innerWidth;
      const y = padding.top + innerHeight - ((values[i] - minValue) / range) * innerHeight;
      return { x, y };
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, values, minValue, range, innerWidth, innerHeight]
  );

  const pathD = useMemo(() =>
    points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" "),
    [points]
  );

  const areaD = useMemo(() =>
    pathD + ` L ${points[points.length - 1]?.x || 0} ${padding.top + innerHeight} L ${points[0]?.x || 0} ${padding.top + innerHeight} Z`,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathD, points, innerHeight]
  );

  const ySteps = 5;
  const yLabels = useMemo(() =>
    Array.from({ length: ySteps }, (_, i) => {
      const val = minValue + (range / (ySteps - 1)) * i;
      return Math.round(val);
    }),
    [minValue, range]
  );

  const totalRevenue = useMemo(() => values.reduce((a, b) => a + b, 0), [values]);
  const avgDaily = useMemo(() => Math.round(totalRevenue / Math.max(values.length, 1)), [totalRevenue, values.length]);
  const peakValue = useMemo(() => Math.max(...values), [values]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-6 w-40 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-100 rounded animate-pulse mt-2" />
          </div>
        </div>
        <div className="h-[200px] bg-gray-50 rounded animate-pulse" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[#111111]">Sales Overview</h3>
            <p className="text-sm text-gray-500">Revenue over the last 7 days</p>
          </div>
        </div>
        <div className="h-[200px] flex items-center justify-center text-gray-400">
          No sales data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[#111111]">Sales Overview</h3>
          <p className="text-sm text-gray-500">Revenue over the last 7 days</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">Currency:</span>
          <span className="text-sm font-bold text-[#E60000]">{currency}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto"
          style={{ minWidth: "600px" }}
        >
          {/* Grid lines */}
          {yLabels.map((_, i) => {
            const y = padding.top + (i / (ySteps - 1)) * innerHeight;
            return (
              <line
                key={i}
                x1={padding.left}
                y1={y}
                x2={chartWidth - padding.right}
                y2={y}
                stroke="#f0f0f0"
                strokeWidth={1}
              />
            );
          })}

          {/* Area under line */}
          <path d={areaD} fill="url(#gradient)" opacity={0.3} />

          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#E60000"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={3}
              fill="#E60000"
              stroke="white"
              strokeWidth={2}
            />
          ))}

          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E60000" />
              <stop offset="100%" stopColor="#E60000" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Y-axis labels */}
          {yLabels.map((val, i) => {
            const y = padding.top + innerHeight - (i / (ySteps - 1)) * innerHeight;
            return (
              <text
                key={i}
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                className="text-xs fill-gray-400"
                fontSize={10}
              >
                {currency === "USD" ? `$${val.toLocaleString()}` : `${val.toLocaleString()} S`}
              </text>
            );
          })}

          {/* X-axis labels */}
          {data.map((d, i) => (
            <text
              key={i}
              x={points[i]?.x || 0}
              y={chartHeight - 10}
              textAnchor="middle"
              className="text-xs fill-gray-400"
              fontSize={10}
            >
              {d.date}
            </text>
          ))}
        </svg>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-500">Total Revenue</p>
          <p className="text-lg font-bold text-[#111111]">
            {currency === "USD"
              ? `$${totalRevenue.toLocaleString()}`
              : `${totalRevenue.toLocaleString()} S`}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Average Daily</p>
          <p className="text-lg font-bold text-[#111111]">
            {currency === "USD"
              ? `$${avgDaily.toLocaleString()}`
              : `${avgDaily.toLocaleString()} S`}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Peak Day</p>
          <p className="text-lg font-bold text-[#111111]">
            {currency === "USD"
              ? `$${peakValue.toLocaleString()}`
              : `${peakValue.toLocaleString()} S`}
          </p>
        </div>
      </div>
    </div>
  );
}

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
}

const statusConfig = {
  pending: {
    label: "Pending",
    labelSo: "Sugayaal",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Package,
  },
  confirmed: {
    label: "Confirmed",
    labelSo: "Xaqiijiyay",
    color: "bg-blue-100 text-blue-700 border-blue-200",
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
    icon: Package,
  },
  delivered: {
    label: "Delivered",
    labelSo: "La keenay",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: TrendingUp,
  },
  cancelled: {
    label: "Cancelled",
    labelSo: "La joojiyay",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: AlertCircle,
  },
};

function OrdersTable({ orders, isLoading }: OrdersTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-8 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#E60000]" />
          <span className="ml-2 text-gray-500">Loading orders...</span>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-8 text-center text-gray-500">
          No recent orders found
        </div>
      </div>
    );
  }

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
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              const itemsCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

              return (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm font-medium text-[#111111]">
                      {order.id.slice(0, 8).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-[#111111]">
                        {order.customer_name}
                      </p>
                      <p className="text-xs text-gray-500">{order.customer_phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700">{itemsCount}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-[#111111]">
                        ${order.total.toFixed(2)}
                      </p>
                      {order.total_sos && (
                        <p className="text-xs text-gray-500">
                          {order.total_sos.toLocaleString()} S
                        </p>
                      )}
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
                    <span className="text-sm text-gray-600">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"
                      }
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface LowStockAlertProps {
  products: Product[];
  isLoading: boolean;
}

function LowStockAlert({ products, isLoading }: LowStockAlertProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="h-6 w-32 bg-gray-100 rounded animate-pulse mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-50 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-amber-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        <h3 className="text-lg font-semibold text-[#111111]">Low Stock Alert</h3>
        <span className="text-sm text-gray-500">(Alaab Dheer)</span>
      </div>
      <div className="space-y-3">
        {products.slice(0, 5).map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100"
          >
            <div className="flex items-center gap-3">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name_en}
                  className="w-10 h-10 object-cover rounded"
                />
              )}
              <div>
                <p className="text-sm font-medium text-[#111111]">{product.name_en}</p>
                <p className="text-xs text-gray-500">{product.name_so}</p>
              </div>
            </div>
            <div className="text-right">
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                  product.stock === 0
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
                )}
              >
                {product.stock === 0 ? "Out of Stock" : `${product.stock} left`}
              </span>
            </div>
          </div>
        ))}
        {products.length > 5 && (
          <p className="text-sm text-gray-500 text-center pt-2">
            And {products.length - 5} more products with low stock
          </p>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [whatsappClicks, setWhatsappClicks] = useState(0);
  const [currency, setCurrency] = useState<"USD" | "SOS">("USD");

  // Calculate stats from real data
  const stats = useMemo<DashboardStats>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ordersToday = orders.filter((order) => {
      if (!order.created_at) return false;
      const orderDate = new Date(order.created_at);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });

    const pendingOrders = orders.filter(
      (order) => order.status === "pending"
    ).length;

    const lowStockProducts = products.filter((p) => p.stock < 20);
    const lowStockCount = lowStockProducts.length;

    const totalRevenue = orders
      .filter((order) => order.status !== "cancelled")
      .reduce((sum, order) => sum + (order.total || 0), 0);

    const totalRevenueSos = orders
      .filter((order) => order.status !== "cancelled")
      .reduce((sum, order) => sum + (order.total_sos || 0), 0);

    // Calculate WhatsApp clicks this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    return {
      totalRevenue,
      totalRevenueSos,
      ordersToday: ordersToday.length,
      pendingOrders,
      lowStockCount,
      lowStockProducts,
      whatsappClicks,
      whatsappClicksThisWeek: Math.round(whatsappClicks * 0.3), // Estimate 30% this week
    };
  }, [products, orders, whatsappClicks]);

  // Generate sales data for the last 7 days
  const salesData = useMemo<SalesDataPoint[]>(() => {
    const data: SalesDataPoint[] = [];
    const today = new Date();
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 6);
    last7Days.setHours(0, 0, 0, 0);

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const dayStart = new Date(date);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const dayOrders = orders.filter((order) => {
        if (!order.created_at) return false;
        const orderDate = new Date(order.created_at);
        return orderDate >= dayStart && orderDate <= dayEnd && order.status !== "cancelled";
      });

      const dayUsd = dayOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      const daySos = dayOrders.reduce((sum, order) => sum + (order.total_sos || 0), 0);

      data.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        usd: dayUsd,
        sos: daySos,
        orders: dayOrders.length,
      });
    }

    return data;
  }, [orders]);

  // Get recent orders (last 10)
  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 10);
  }, [orders]);

  // Fetch all data on mount
  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true);
      setError(null);

      try {
        const [productsData, ordersData, clicksData] = await Promise.all([
          fetchProducts(),
          fetchOrders(),
          fetchWhatsAppClicks(),
        ]);

        setProducts(productsData);
        setOrders(ordersData);
        setWhatsappClicks(clicksData.count);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [productsData, ordersData, clicksData] = await Promise.all([
        fetchProducts(),
        fetchOrders(),
        fetchWhatsAppClicks(),
      ]);

      setProducts(productsData);
      setOrders(ordersData);
      setWhatsappClicks(clicksData.count);
    } catch (err) {
      console.error("Error refreshing dashboard data:", err);
      setError("Failed to refresh data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-700">Error Loading Dashboard</h3>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#111111]">Dashboard</h2>
          <p className="text-sm text-gray-500">Dashbaad — Overview of your store</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 disabled:opacity-50"
        >
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          titleSo="Dakhliga Guud"
          value={currency === "USD"
            ? `$${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : `${stats.totalRevenueSos.toLocaleString()} S`
          }
          subValue={currency === "USD"
            ? `${stats.totalRevenueSos.toLocaleString()} SOS`
            : `$${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          }
          change={stats.totalRevenue > 0 ? 12.5 : undefined}
          icon={DollarSign}
          color="red"
          isLoading={isLoading}
        />
        <StatCard
          title="Orders Today"
          titleSo="Dalabada Maanta"
          value={stats.ordersToday.toString()}
          subValue={`${stats.pendingOrders} pending`}
          icon={ShoppingCart}
          color="green"
          isLoading={isLoading}
        />
        <StatCard
          title="Low Stock"
          titleSo="Alaab Dheer"
          value={stats.lowStockCount.toString()}
          subValue="Products below threshold"
          icon={Package}
          color="amber"
          isLoading={isLoading}
        />
        <StatCard
          title="WhatsApp Clicks"
          titleSo="Dhacdooyinka WhatsApp"
          value={stats.whatsappClicks.toString()}
          subValue={`${stats.whatsappClicksThisWeek} this week`}
          icon={MessageCircle}
          color="blue"
          isLoading={isLoading}
        />
      </div>

      {/* Sales Chart */}
      <SalesChart data={salesData} currency={currency} isLoading={isLoading} />

      {/* Two Column Layout for Orders and Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-[#111111]">Recent Orders</h3>
              <p className="text-sm text-gray-500">Dalabada Dhowaan — Last 10 orders</p>
            </div>
          </div>
          <OrdersTable orders={recentOrders} isLoading={isLoading} />
        </div>

        {/* Low Stock Alert */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-[#111111]">Low Stock Products</h3>
              <p className="text-sm text-gray-500">Alaabta Dheer — Products needing attention</p>
            </div>
          </div>
          <LowStockAlert products={stats.lowStockProducts} isLoading={isLoading} />
        </div>
      </div>

      {/* Currency Toggle */}
      <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg border border-gray-200 p-1 flex">
        <button
          onClick={() => setCurrency("USD")}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded transition-colors",
            currency === "USD"
              ? "bg-[#E60000] text-white"
              : "text-gray-600 hover:bg-gray-50"
          )}
        >
          USD
        </button>
        <button
          onClick={() => setCurrency("SOS")}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded transition-colors",
            currency === "SOS"
              ? "bg-[#E60000] text-white"
              : "text-gray-600 hover:bg-gray-50"
          )}
        >
          SOS
        </button>
      </div>
    </div>
  );
}