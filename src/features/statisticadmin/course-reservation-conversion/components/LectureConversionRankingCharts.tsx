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

const truncateLectureTitle = (value: unknown) => {
  const title = String(value ?? "");

  return title.length > 9 ? `${title.slice(0, 9)}...` : title;
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

      {data.length === 0 ? (
        <p className="mt-5 flex h-[220px] items-center justify-center text-[13px] text-[#98A2B3]">
          데이터가 없습니다.
        </p>
      ) : (
        <div className="mt-5 h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 6, right: 20, bottom: 12, left: 12 }}
            >
              <CartesianGrid
                horizontal={false}
                stroke="#EEF2F6"
                strokeDasharray="3 3"
              />
              <XAxis
                type="number"
                domain={[0, (dataMax: number) => Math.max(35, Math.ceil(dataMax * 1.1))]}
                tickFormatter={(value) => `${value}%`}
                tick={tickStyle}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="lectureTitle"
                width={92}
                tickFormatter={truncateLectureTitle}
                tick={tickStyle}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "#F8FAFC" }}
                formatter={(value) => [`${value}%`, "전환율"]}
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
              <Bar
                dataKey="conversionRate"
                fill={color}
                radius={[0, 5, 5, 0]}
                barSize={14}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </article>
  );
}
