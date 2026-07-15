"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { LectureConversionRanking } from "../types";

type LectureConversionRankingChartsProps = {
  topLectures: LectureConversionRanking[];
  bottomLectures: LectureConversionRanking[];
};

const tickStyle = {
  fill: "#667085",
  fontSize: 12,
  fontWeight: 600,
};

export default function LectureConversionRankingCharts({
  topLectures,
  bottomLectures,
}: LectureConversionRankingChartsProps) {
  return (
    <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
      <RankingChart
        title="강의별 전환율 TOP 5"
        data={topLectures}
        color="#2FAE9B"
      />
      <RankingChart
        title="강의별 전환율 Bottom 5"
        data={bottomLectures}
        color="#EA5A93"
      />
    </section>
  );
}

function RankingChart({
  title,
  data,
  color,
}: {
  title: string;
  data: LectureConversionRanking[];
  color: string;
}) {
  return (
    <article className="rounded-[18px] border border-[#EAECF0] bg-white p-6 shadow-sm">
      <h2 className="text-[17px] font-bold text-[#111827]">{title}</h2>

      <div className="mt-5 h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 6, right: 20, bottom: 12, left: 78 }}
          >
            <CartesianGrid
              horizontal={false}
              stroke="#EEF2F6"
              strokeDasharray="3 3"
            />
            <XAxis
              type="number"
              domain={[0, 35]}
              tickFormatter={(value) => `${value}%`}
              tick={tickStyle}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="lectureTitle"
              width={118}
              tick={tickStyle}
              axisLine={false}
              tickLine={false}
            />
            <Bar
              dataKey="conversionRate"
              fill={color}
              radius={[0, 5, 5, 0]}
              barSize={14}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
