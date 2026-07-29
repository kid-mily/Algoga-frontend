"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { RecoveryRatePoint } from "../types";

type BalanceRecoveryLineChartProps = {
  data: RecoveryRatePoint[];
};

export default function BalanceRecoveryLineChart({
  data,
}: BalanceRecoveryLineChartProps) {
  return (
    <article className="rounded-[18px] bg-white p-6 shadow-sm">
      <h3 className="text-[17px] font-bold text-[#111827]">
        누적 납부율 곡선 (계약금 납부 후 경과일)
      </h3>

      <div className="mt-6 h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F3" />
            <XAxis
              dataKey="day"
              tick={{ fill: "#98A2B3", fontSize: 12 }}
              label={{
                value: "경과일",
                position: "insideBottom",
                offset: -5,
                fill: "#98A2B3",
                fontSize: 12,
              }}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fill: "#98A2B3", fontSize: 12 }}
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#2FAE9B"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#FFFFFF",
                stroke: "#2FAE9B",
                strokeWidth: 3,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
