import type { CohortRow } from "../types";
import { getCohortCellClassName } from "../utils";

type CohortRetentionHeatmapProps = {
  data: CohortRow[];
  maxMonths: number;
};

export default function CohortRetentionHeatmap({
  data,
  maxMonths,
}: CohortRetentionHeatmapProps) {
  const monthColumns = Array.from({ length: maxMonths }, (_, index) => index);

  return (
    <article className="rounded-[18px] border border-[#EAECF0] bg-white p-6 shadow-sm">
      <h2 className="text-[17px] font-bold text-[#111827]">
        가입 월별 코호트 히트맵
      </h2>
      <p className="mt-1 text-[13px] font-medium text-[#98A2B3]">
        가입 월 기준 재구매율 (%)
      </p>

      <div className="mt-6">
        <div
          className="grid gap-x-1 gap-y-4 text-[11px] font-semibold text-[#98A2B3]"
          style={{
            gridTemplateColumns: `48px repeat(${monthColumns.length}, minmax(0, 1fr))`,
          }}
        >
          <span className="truncate">가입 월</span>
          {monthColumns.map((month) => (
            <span key={month} className="truncate text-center">
              M{month}
            </span>
          ))}

          {data.map((row) => (
            <Row key={row.cohortMonth} row={row} monthColumns={monthColumns} />
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3 border-t border-[#EEF2F6] pt-5 text-[12px] font-semibold text-[#98A2B3]">
        <span>낮음</span>
        <span className="h-3 w-8 rounded-full bg-[#B9E4DD]" />
        <span className="h-3 w-8 rounded-full bg-[#67CDBA]" />
        <span className="h-3 w-8 rounded-full bg-[#32B89F]" />
        <span className="h-3 w-8 rounded-full bg-[#1BA88F]" />
        <span>높음</span>
      </div>
    </article>
  );
}

function Row({
  row,
  monthColumns,
}: {
  row: CohortRow;
  monthColumns: number[];
}) {
  return (
    <>
      <span className="flex h-9 items-center truncate text-[11px] font-semibold text-[#667085]">
        {row.cohortMonth}
      </span>
      {monthColumns.map((month) => {
        const value = row.retentionRate[month];

        return (
          <span
            key={month}
            className={`flex h-9 items-center justify-center overflow-hidden whitespace-nowrap rounded-[10px] px-0.5 text-[10px] font-extrabold leading-none tabular-nums ${getCohortCellClassName(value)}`}
          >
            {value === null || value === undefined ? "-" : `${value}%`}
          </span>
        );
      })}
    </>
  );
}
