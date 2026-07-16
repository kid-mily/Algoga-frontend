"use client";

import { Download } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CountryProfitabilityItem } from "../types";
import { formatHundredMillion } from "../utils";

type CountryNetSalesBarChartProps = {
  data: CountryProfitabilityItem[];
};

export default function CountryNetSalesBarChart({
  data,
}: CountryNetSalesBarChartProps) {
  const chartData = [...data]
    .sort((a, b) => b.netRevenue - a.netRevenue)
    .slice(0, 10);

  return (
    <article className="rounded-[18px] border border-[#EAECF0] bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[17px] font-bold text-[#111827]">
            나라별 순매출 Top 10
          </h2>
          <p className="mt-1 text-[13px] font-medium text-[#98A2B3]">
            환불 차감 후 확정 순매출 기준
          </p>
        </div>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#E4E7EC] text-[#667085]"
        >
          <Download size={15} />
        </button>
      </div>

      <div className="mt-5 h-[330px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 8, right: 24, bottom: 10, left: 8 }}
          >
            <CartesianGrid
              horizontal={false}
              stroke="#EEF2F6"
              strokeDasharray="3 3"
            />

            <XAxis
              type="number"
              tickFormatter={(value) => formatHundredMillion(Number(value))}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#98A2B3", fontSize: 12, fontWeight: 600 }}
            />

            <YAxis
              type="category"
              dataKey="countryName"
              width={70}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#667085", fontSize: 12, fontWeight: 700 }}
            />

            <Tooltip
              formatter={(value) => [
                formatHundredMillion(Number(value)),
                "순매출",
              ]}
            />

            <Bar
              dataKey="netRevenue"
              fill="#2FAE9B"
              radius={[0, 5, 5, 0]}
              barSize={14}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}