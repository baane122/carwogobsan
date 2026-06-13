"use client";

import { useMemo } from "react";

interface SalesDataPoint {
  date: string;
  usd: number;
  sos: number;
}

interface SalesChartProps {
  data?: SalesDataPoint[];
  currency?: "USD" | "SOS";
}

function generateMockData(): SalesDataPoint[] {
  const data: SalesDataPoint[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const baseUsd = 500 + Math.random() * 1500;
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      usd: Math.round(baseUsd),
      sos: Math.round(baseUsd * 580),
    });
  }
  return data;
}

export function SalesChart({ data, currency = "USD" }: SalesChartProps) {
  const chartData = useMemo(() => data || generateMockData(), [data]);

  const values = chartData.map((d) => (currency === "USD" ? d.usd : d.sos));
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue || 1;

  const chartWidth = 800;
  const chartHeight = 200;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const points = chartData.map((_, i) => {
    const x = padding.left + (i / (chartData.length - 1)) * innerWidth;
    const y =
      padding.top +
      innerHeight -
      ((values[i] - minValue) / range) * innerHeight;
    return { x, y };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaD =
    pathD +
    ` L ${points[points.length - 1].x} ${padding.top + innerHeight} L ${points[0].x} ${padding.top + innerHeight} Z`;

  // Y-axis labels
  const ySteps = 5;
  const yLabels = Array.from({ length: ySteps }, (_, i) => {
    const val = minValue + (range / (ySteps - 1)) * i;
    return Math.round(val);
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[#111111]">
            Sales Overview
          </h3>
          <p className="text-sm text-gray-500">
            Revenue over the last 30 days
          </p>
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

          {/* X-axis labels (show every 5th) */}
          {chartData.map((d, i) =>
            i % 5 === 0 ? (
              <text
                key={i}
                x={points[i].x}
                y={chartHeight - 10}
                textAnchor="middle"
                className="text-xs fill-gray-400"
                fontSize={10}
              >
                {d.date}
              </text>
            ) : null
          )}
        </svg>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-500">Total Revenue</p>
          <p className="text-lg font-bold text-[#111111]">
            {currency === "USD"
              ? `$${values.reduce((a, b) => a + b, 0).toLocaleString()}`
              : `${values.reduce((a, b) => a + b, 0).toLocaleString()} S`}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Average Daily</p>
          <p className="text-lg font-bold text-[#111111]">
            {currency === "USD"
              ? `$${Math.round(values.reduce((a, b) => a + b, 0) / values.length).toLocaleString()}`
              : `${Math.round(values.reduce((a, b) => a + b, 0) / values.length).toLocaleString()} S`}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Peak Day</p>
          <p className="text-lg font-bold text-[#111111]">
            {currency === "USD"
              ? `$${Math.max(...values).toLocaleString()}`
              : `${Math.max(...values).toLocaleString()} S`}
          </p>
        </div>
      </div>
    </div>
  );
}
