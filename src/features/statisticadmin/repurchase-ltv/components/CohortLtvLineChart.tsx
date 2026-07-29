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
import type { CohortRow } from "../types";
import { formatManwon } from "../utils";

type CohortLtvLineChartProps = {
  data: CohortRow[];
  maxMonths: number;
};

const colors = ["#2FAE9B", "#8B7CF6", "#F59E0B", "#EC4899", "#1BA88F", "#5B6EF5"];

export default function CohortLtvLineChart({ data, maxMonths }: CohortLtvLineChartProps) {
  const normalized = Array.from({ length: maxMonths }, (_, month) => {
    const point: Record<string, number | string | null> = { month: `M${month}` };

    data.forEach((row) => {
      point[row.cohortMonth] = row.cumulativeRevenue[month] ?? null;
    });

    return point;
  });

  return (
    <article className="rounded-[18px] border border-[#EAECF0] bg-white p-6 shadow-sm">
      <h2 className="text-[17px] font-bold text-[#111827]">
        코호트별 누적매출
      </h2>
      <p className="mt-1 text-[13px] font-medium text-[#98A2B3]">
        가입 후 경과 월 기준 (단위: 만원)
      </p>

      <div className="mt-5 h-[330px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={normalized} margin={{ top: 14, right: 24, bottom: 6, left: 0 }}>
            <CartesianGrid stroke="#EEF2F6" strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#98A2B3", fontSize: 12, fontWeight: 600 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#98A2B3", fontSize: 12, fontWeight: 600 }}
              tickFormatter={(value) => `${Math.round(Number(value) / 10000)}만`}
            />
            <Tooltip
              formatter={(value) => [formatManwon(Number(value)), "누적매출"]}
              contentStyle={{
                border: "1px solid #E4E7EC",
                borderRadius: 12,
                boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
                color: "#111827",
                fontSize: 13,
                fontWeight: 700,
              }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{ fontSize: 12, fontWeight: 700, color: "#667085" }}
            />
            {data.map((row, index) => (
              <Line
                key={row.cohortMonth}
                type="monotone"
                dataKey={row.cohortMonth}
                stroke={colors[index % colors.length]}
                strokeWidth={2.4}
                dot={false}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
