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
import type { LectureCouponUsage } from "../types";

type LectureCouponUsageChartProps = {
  data: LectureCouponUsage[];
  onDownloadCsv: () => void;
};

const tickStyle = {
  fill: "#667085",
  fontSize: 12,
  fontWeight: 600,
};

const truncateLectureTitle = (value: unknown) => {
  const title = String(value ?? "");

  return title.length > 16 ? `${title.slice(0, 16)}...` : title;
};

// 통계매니저 다른 화면(정상/주의/위험)과 동일한 배색: 좋음=teal, 보통=orange, 나쁨=red
const getUsageColor = (usageRate: number) => {
  if (usageRate < 20) return "#EF4444";
  if (usageRate < 30) return "#F59E0B";
  return "#2FAE9B";
};

export default function LectureCouponUsageChart({
  data,
  onDownloadCsv,
}: LectureCouponUsageChartProps) {
  const sortedData = [...data]
    .sort((a, b) => b.usageRate - a.usageRate)
    .slice(0, 10);

  return (
    <section className="mt-6 rounded-[18px] border border-[#EAECF0] bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[17px] font-bold text-[#111827]">
            강의별 쿠폰 사용률
          </h2>
          <p className="mt-1 text-[13px] font-medium text-[#98A2B3]">
            사용률 내림차순
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <div className="flex flex-wrap items-center gap-3 text-[12px] font-semibold text-[#667085]">
            <Legend color="#2FAE9B" label="30% 이상" />
            <Legend color="#F59E0B" label="20~30% 미만" />
            <Legend color="#EF4444" label="20% 미만" />
          </div>

          <button
            type="button"
            onClick={onDownloadCsv}
            className="flex h-9 items-center gap-1 rounded-[10px] border border-[#E4E7EC] px-3 text-[12px] font-semibold text-[#667085]"
          >
            <Download size={14} />
            CSV
          </button>
        </div>
      </div>

      {sortedData.length === 0 ? (
        <p className="mt-5 flex h-[220px] items-center justify-center text-[13px] text-[#98A2B3]">
          데이터가 없습니다.
        </p>
      ) : (
      <div className="mt-5 h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 6, right: 18, bottom: 12, left: 12 }}
          >
            <CartesianGrid
              horizontal={false}
              stroke="#EEF2F6"
              strokeDasharray="3 3"
            />
            <XAxis
              type="number"
              domain={[0, 60]}
              ticks={[0, 15, 30, 45, 60]}
              tickFormatter={(value) => `${value}%`}
              tick={tickStyle}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="lectureTitle"
              width={160}
              tickFormatter={truncateLectureTitle}
              tick={tickStyle}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "#F8FAFC" }}
              formatter={(value) => [`${value}%`, "쿠폰 사용률"]}
              labelFormatter={(label) => String(label)}
              contentStyle={{
                border: "1px solid #E4E7EC",
                borderRadius: 12,
                boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
                color: "#111827",
                fontSize: 13,
                fontWeight: 700,
              }}
            />
            <Bar dataKey="usageRate" radius={[0, 5, 5, 0]} barSize={14}>
              {sortedData.map((item) => (
                <Cell key={item.lectureTitle} fill={getUsageColor(item.usageRate)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      )}
    </section>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}
