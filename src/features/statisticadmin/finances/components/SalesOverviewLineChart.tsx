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
import {
  isFutureDailyLabel,
  toMillionValue,
} from "../utils/salesOverviewFormatters";
import { SalesOverviewLineChartProps,ChartDatum } from '../types'

export default function SalesOverviewLineChart({
  trend,
}: SalesOverviewLineChartProps) {
  const chartData: ChartDatum[] = trend.map((item) => {
    const shouldHideFutureValue = isFutureDailyLabel(item.label);

    return {
      label: item.label,
      "총매출": shouldHideFutureValue
        ? null
        : toMillionValue(item.totalRevenue),
      "순매출": shouldHideFutureValue ? null : toMillionValue(item.netRevenue),
      "환불": shouldHideFutureValue ? null : toMillionValue(item.refund),
    };
  });

  return (
    <section className="rounded-[18px] border border-[#EAECF0] bg-white p-6 shadow-[0_12px_28px_rgba(16,24,40,0.05)]">
      <div className="mb-5">
        <h2 className="text-[17px] font-bold text-[#101828]">
          매출 추이 (총매출 · 환불 · 순매출)
        </h2>
        <p className="mt-1 text-[12px] font-medium text-[#98A2B3]">
          단위: 백만원 / 순매출 = 총매출 - 환불
        </p>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 20, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="#EAECF0" strokeDasharray="4 4" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#98A2B3", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#98A2B3", fontSize: 12 }}
              tickFormatter={(value) => `${value}M`}
            />
            <Tooltip
              formatter={(value, name) => [`${Number(value ?? 0)}M`, name]}
              contentStyle={{
                border: "1px solid #EAECF0",
                borderRadius: 12,
                boxShadow: "0 12px 28px rgba(16, 24, 40, 0.08)",
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              height={42}
              iconType="plainline"
            />
            <Line
              dataKey="총매출"
              type="monotone"
              stroke="#8B7CFF"
              strokeWidth={2.2}
              dot={false}
              activeDot={{ r: 5 }}
            />
            <Line
              dataKey="순매출"
              type="monotone"
              stroke="#2BB3A3"
              strokeWidth={2.2}
              dot={false}
              activeDot={{ r: 5 }}
            />
            <Line
              dataKey="환불"
              type="monotone"
              stroke="#EC4899"
              strokeWidth={2.2}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
