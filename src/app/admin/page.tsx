"use client";

import { StatCard } from "@/components/admin/stat-card";
import { SalesChart } from "@/components/admin/sales-chart";
import { OrdersTable } from "@/components/admin/orders-table";
import {
  DollarSign,
  ShoppingCart,
  Package,
  MessageCircle,
} from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#111111]">Dashboard</h2>
        <p className="text-sm text-gray-500">Dashbaad &mdash; Overview of your store</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          titleSo="Dakhliga Guud"
          value=" $12,450.00"
          subValue="7,221,000 S"
          change={12.5}
          icon={DollarSign}
          color="red"
        />
        <StatCard
          title="Orders Today"
          titleSo="Dalabada Maanta"
          value="24"
          subValue="3 pending"
          change={8.2}
          icon={ShoppingCart}
          color="green"
        />
        <StatCard
          title="Low Stock"
          titleSo="Alaab Dheer"
          value="7"
          subValue="Products below threshold"
          change={-3.1}
          icon={Package}
          color="amber"
        />
        <StatCard
          title="WhatsApp Clicks"
          titleSo="Dhacdooyinka WhatsApp"
          value="156"
          subValue="42 this week"
          change={23.4}
          icon={MessageCircle}
          color="blue"
        />
      </div>

      {/* Sales Chart */}
      <SalesChart />

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-[#111111]">Recent Orders</h3>
            <p className="text-sm text-gray-500">Dalabada Dhowaan &mdash; Last 5 orders</p>
          </div>
        </div>
        <OrdersTable />
      </div>
    </div>
  );
}
