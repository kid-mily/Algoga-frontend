"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { SignupPathCount } from "../types";
import { formatNumber, formatPercent } from "../utils";

type SignupPathPieChartProps = {
  statistics: SignupPathCount[];
  isLoading: boolean;
};

type SignupPathPieDatum = {
  name: string;
  value: number;
  fill: string;
  statistic: SignupPathCount;
};

export default function SignupPathPieChart({
  statistics,
  isLoading,
}: SignupPathPieChartProps) {
  const chartData: SignupPathPieDatum[] = statistics
    .filter((item) => item.ratio > 0)
    .map((item) => ({
      name: item.label,
      value: item.ratio,
      fill: item.color,
      statistic: item,
    }));

  return (
    <section className="rounded-[16px] border border-[#E4E7EC] bg-white">
      <header className="border-b border-[#EEF0F3] px-6 py-4">
        <h2 className="text-[18px] font-bold text-[#111827]">
          유입 경로 비율
        </h2>
      </header>

      <div className="p-6">
        {isLoading ? (
          <p
            role="status"
            aria-live="polite"
            className="py-12 text-center text-[14px] text-[#667085]"
          >
            유입 경로 비율을 불러오는 중입니다...
          </p>
        ) : chartData.length === 0 ? (
          <p
            role="status"
            aria-live="polite"
            className="py-12 text-center text-[14px] text-[#667085]"
          >
            유입 경로 비율 데이터가 없습니다.
          </p>
        ) : (
          <div
            className="h-[300px]"
            role="img"
            aria-label="유입 경로별 회원가입 비율 파이 차트"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  paddingAngle={2}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, item) => {
                    const statistic = (
                      item.payload as SignupPathPieDatum
                    ).statistic;

                    return [
                      `${formatPercent(Number(value))} · 가입 ${formatNumber(
                        statistic.signupCount
                      )}명`,
                      name,
                    ];
                  }}
                  contentStyle={{
                    border: "1px solid #EAECF0",
                    borderRadius: 12,
                    boxShadow: "0 12px 28px rgba(16, 24, 40, 0.08)",
                  }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </section>
  );
}
