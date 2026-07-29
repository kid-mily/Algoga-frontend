"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { CountryBalanceConversion } from "../types";

type CountryBalanceConversionBarChartProps = {
  data: CountryBalanceConversion[];
};

export default function CountryBalanceConversionBarChart({
  data,
}: CountryBalanceConversionBarChartProps) {
  return (
    <article className="rounded-[18px] bg-white p-6 shadow-sm">
      <h3 className="text-[17px] font-bold text-[#111827]">
        국가별 잔금 전환율
      </h3>

      <div className="mt-6 h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="#EEF0F3"
            />
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fill: "#98A2B3", fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="countryName"
              width={70}
              tick={{ fill: "#667085", fontSize: 13 }}
            />
            <Bar
              dataKey="conversionRate"
              fill="#2FAE9B"
              radius={[0, 6, 6, 0]}
              barSize={18}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
