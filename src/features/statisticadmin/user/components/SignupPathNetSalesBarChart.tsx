"use client";

import { Download } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { downloadInflowChannelsCsv } from "@/features/services/adminUserStatistics.service";
import { SignupPathChannelRevenue } from "../types";
import { formatWon } from "../utils";

type SignupPathNetSalesBarChartProps = {
  channelRevenue: SignupPathChannelRevenue[];
  isLoading: boolean;
};

export default function SignupPathNetSalesBarChart({
  channelRevenue,
  isLoading,
}: SignupPathNetSalesBarChartProps) {
  return (
    <section className="rounded-[16px] border border-[#E4E7EC] bg-white">
      <header className="flex items-center justify-between border-b border-[#EEF0F3] px-6 py-4">
        <h2 className="text-[18px] font-bold text-[#111827]">
          유입경로별 순매출
        </h2>
        <button
          type="button"
          onClick={() => void downloadInflowChannelsCsv()}
          className="flex h-[32px] cursor-pointer items-center gap-1.5 rounded-[10px] border border-[#E4E7EC] bg-white px-3 text-[12px] font-semibold text-[#667085]"
        >
          <Download aria-hidden="true" className="h-[14px] w-[14px]" />
          CSV
        </button>
      </header>

      <div className="p-6">
        {isLoading ? (
          <p
            role="status"
            aria-live="polite"
            className="py-12 text-center text-[14px] text-[#667085]"
          >
            유입경로별 순매출을 불러오는 중입니다...
          </p>
        ) : channelRevenue.length === 0 ? (
          <p
            role="status"
            aria-live="polite"
            className="py-12 text-center text-[14px] text-[#667085]"
          >
            유입경로별 순매출 데이터가 없습니다.
          </p>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={channelRevenue}
                layout="vertical"
                margin={{ top: 8, right: 24, bottom: 0, left: 0 }}
              >
                <CartesianGrid
                  stroke="#EAECF0"
                  strokeDasharray="4 4"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#98A2B3", fontSize: 12 }}
                  tickFormatter={(value) => formatWon(Number(value))}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  width={90}
                  tick={{ fill: "#344054", fontSize: 13, fontWeight: 600 }}
                />
                <Tooltip
                  formatter={(value) => formatWon(Number(value))}
                  contentStyle={{
                    border: "1px solid #EAECF0",
                    borderRadius: 12,
                    boxShadow: "0 12px 28px rgba(16, 24, 40, 0.08)",
                  }}
                />
                <Bar dataKey="netSales" radius={[0, 8, 8, 0]} barSize={22}>
                  {channelRevenue.map((entry) => (
                    <Cell key={entry.signupPath} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </section>
  );
}
