"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { CancellationStage } from "../types";

type CancellationStageDonutChartProps = {
  data: CancellationStage[];
};

export default function CancellationStageDonutChart({
  data,
}: CancellationStageDonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <article className="rounded-[18px] bg-white p-6 shadow-sm">
      <h3 className="text-[17px] font-bold text-[#111827]">
        취소 단계별 구성
      </h3>

      <div className="mt-4 flex flex-col items-center">
        <div className="relative h-[210px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="label"
                innerRadius={58}
                outerRadius={88}
                paddingAngle={3}
                startAngle={90}
                endAngle={-270}
              >
                {data.map((item) => (
                  <Cell key={item.label} fill={item.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <strong className="text-[26px] font-extrabold text-[#111827]">
              {total}
            </strong>
            <span className="mt-1 text-[12px] font-bold text-[#98A2B3]">
              총 취소건
            </span>
          </div>
        </div>

        <div className="mt-4 grid w-full grid-cols-3 gap-3 text-center">
          {data.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-center gap-1.5 text-[12px] font-bold text-[#667085]">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.label}
              </div>
              <p className="mt-1 text-[14px] font-extrabold text-[#111827]">
                {item.count}건
              </p>
              <p className="text-[12px] font-medium text-[#98A2B3]">
                {item.rate}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
