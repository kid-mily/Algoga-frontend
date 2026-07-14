"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RefundMonthlyTrend, TrendUnit } from "../types";
import { formatMillionAmount, formatWon, trendUnitLabels } from "../utils";

type RefundMonthlyTrendChartProps = {
  data: RefundMonthlyTrend[];
  unit: TrendUnit;
};

export default function RefundMonthlyTrendChart({
  data,
  unit,
}: RefundMonthlyTrendChartProps) {
  return (
    <article className="rounded-[18px] bg-white p-6 shadow-sm">
      <div>
        <h3 className="text-[17px] font-bold text-[#111827]">
          {trendUnitLabels[unit]} 매출 · 환불 · 순매출 추이
        </h3>
        <p className="mt-1 text-[12px] font-medium text-[#98A2B3]">
          단위: 백만원
        </p>
      </div>

      <div className="mt-6 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 8, right: 16, bottom: 0, left: 0 }}
          >
            <CartesianGrid stroke="#EEF2F6" strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#98A2B3", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#98A2B3", fontSize: 12 }}
              tickFormatter={formatMillionAmount}
            />
            <Tooltip
              formatter={(value) => formatWon(Number(value))}
              contentStyle={{
                border: "1px solid #EAECF0",
                borderRadius: 10,
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="plainline"
              wrapperStyle={{ fontSize: 12, color: "#667085" }}
            />
            <Line
              type="monotone"
              dataKey="grossRevenue"
              name="총매출"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="refundAmount"
              name="환불"
              stroke="#EC4899"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="netRevenue"
              name="순매출"
              stroke="#2FAE9B"
              strokeWidth={3}
              dot={{ r: 3, fill: "#2FAE9B", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#2FAE9B", stroke: "#FFFFFF" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
