"use client";

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
import { formatPercent } from "../utils";

type CountryRefundCancelCompareChartProps = {
  data: CountryProfitabilityItem[];
};

export default function CountryRefundCancelCompareChart({
  data,
}: CountryRefundCancelCompareChartProps) {
  const chartData = [...data]
    .sort((a, b) => b.refundRate - a.refundRate)
    .slice(0, 10);

  return (
    <article className="rounded-[18px] border border-[#EAECF0] bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[17px] font-bold text-[#111827]">
            나라별 환불율 · 취소율 비교
          </h2>
          <p className="mt-1 text-[13px] font-medium text-[#98A2B3]">
            환불율 내림차순 · 위험국가 우선 노출
          </p>
        </div>

        <div className="flex flex-wrap justify-end gap-4 text-[12px] font-semibold text-[#667085]">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#EC4899]" />
            환불율
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
            취소율
          </span>
        </div>
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
              domain={[0, 9]}
              ticks={[0, 3, 6, 9]}
              tickFormatter={(value) => `${value}%`}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#98A2B3", fontSize: 12, fontWeight: 600 }}
            />
            <YAxis
              type="category"
              dataKey="countryName"
              width={110}
              interval={0}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#667085", fontSize: 12, fontWeight: 700 }}
            />
            <Tooltip
              formatter={(value, name) => [
                formatPercent(Number(value)),
                name === "refundRate" ? "환불율" : "취소율",
              ]}
              contentStyle={{
                border: "1px solid #E4E7EC",
                borderRadius: 12,
                boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
                color: "#111827",
                fontSize: 13,
                fontWeight: 700,
              }}
            />
            <Bar
              dataKey="refundRate"
              fill="#EC4899"
              radius={[0, 5, 5, 0]}
              barSize={8}
            />
            <Bar
              dataKey="cancelRate"
              fill="#F59E0B"
              radius={[0, 5, 5, 0]}
              barSize={8}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-2 text-[13px] font-bold text-[#667085]">
        <span className="text-[#EC4899]">진한 색</span> = 위험 수준
      </p>
    </article>
  );
}
