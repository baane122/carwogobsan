"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  titleSo?: string;
  value: string;
  subValue?: string;
  change?: number;
  icon: LucideIcon;
  color?: "red" | "green" | "blue" | "amber";
}

const colorMap = {
  red: "bg-[#E60000]/10 text-[#E60000]",
  green: "bg-emerald-500/10 text-emerald-500",
  blue: "bg-blue-500/10 text-blue-500",
  amber: "bg-amber-500/10 text-amber-500",
};

export function StatCard({
  title,
  titleSo,
  value,
  subValue,
  change,
  icon: Icon,
  color = "red",
}: StatCardProps) {
  const isPositive = change && change > 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          {titleSo && (
            <p className="text-xs text-gray-400 mt-0.5">{titleSo}</p>
          )}
          <h3 className="text-2xl font-bold text-[#111111] mt-2">{value}</h3>
          {subValue && (
            <p className="text-sm text-gray-500 mt-1">{subValue}</p>
          )}
          {change !== undefined && (
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
              <span>{isPositive ? "+" : ""}{change}%</span>
              <span className="text-gray-400 font-normal">vs last month</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "p-3 rounded-lg",
            colorMap[color]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
