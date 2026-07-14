"use client";

import { Download } from "lucide-react";
import { downloadInterestLecturesCsv } from "@/features/services/adminInterestStatistics.service";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { CourseInterestItem } from "../types";

type CourseInterestBarChartProps = {
  data: CourseInterestItem[];
};

export default function CourseInterestBarChart({
  data,
}: CourseInterestBarChartProps) {
  return (
    <article className="rounded-[20px] bg-white p-6 shadow-sm">
      <header className="flex items-center justify-between">
        <h3 className="text-[18px] font-bold text-[#111827]">
          강의별 수강자 수 (Top 10)
        </h3>

        <button
          type="button"
          onClick={() => void downloadInterestLecturesCsv()}
          className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#E4E7EC] text-[#667085]"
          aria-label="강의별 수강자 수 CSV 다운로드"
        >
          <Download size={18} />
        </button>
      </header>

      <div className="mt-6 h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#98A2B3", fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="courseTitle"
              width={190}
              tick={{ fill: "#667085", fontSize: 13 }}
            />
            <Bar
              dataKey="enrollmentCount"
              fill="#8173E8"
              radius={[0, 6, 6, 0]}
              barSize={18}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
