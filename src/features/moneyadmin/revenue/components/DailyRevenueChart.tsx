import { DailyRevenueStat } from "../types";
import { formatWon } from "../utils";

type DailyRevenueChartProps = {
  data: DailyRevenueStat[];
};

export default function DailyRevenueChart({ data }: DailyRevenueChartProps) {
  const values = data.flatMap((item) => [
    item.salesAmount,
    item.refundAmount,
    item.netAmount,
  ]);
  const minValue = Math.min(0, ...values);
  const maxValue = Math.max(
    1,
    ...values
  );
  const valueRange = Math.max(1, maxValue - minValue);
  const width = 980;
  const height = 300;
  const padding = {
    top: 24,
    right: 24,
    bottom: 42,
    left: 72,
  };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) =>
    Math.round(minValue + valueRange * ratio)
  );
  const getX = (index: number) =>
    padding.left +
    (data.length > 1 ? (chartWidth / (data.length - 1)) * index : chartWidth / 2);
  const getY = (value: number) =>
    padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;
  const makePath = (key: keyof Pick<DailyRevenueStat, "salesAmount" | "refundAmount" | "netAmount">) =>
    data
      .map((item, index) => {
        const x = getX(index);
        const y = getY(item[key]);

        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

  return (
    <section className="rounded-[16px] border border-[#E4E7EC] bg-white">
      <header className="border-b border-[#EEF0F3] px-6 py-4">
        <h2 className="text-[18px] font-bold text-[#111827]">일별 수익 추이</h2>
      </header>
      <div className="overflow-x-auto p-6">
        {data.length === 0 ? (
          <p
            role="status"
            aria-live="polite"
            className="py-12 text-center text-[14px] text-[#667085]"
          >
            일별 수익 데이터가 없습니다.
          </p>
        ) : (
          <div className="min-w-[900px]">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="h-[300px] w-full"
              role="img"
              aria-label="일별 매출, 환불, 순수익 선 그래프"
            >
              {yTicks.map((tick, index) => {
                const y = getY(tick);

                return (
                  <g key={`${tick}-${index}`}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={width - padding.right}
                      y2={y}
                      stroke="#E4E7EC"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={padding.left - 12}
                      y={y + 4}
                      textAnchor="end"
                      className="fill-[#667085] text-[11px]"
                    >
                      {formatWon(tick)}
                    </text>
                  </g>
                );
              })}

              {data.map((item, index) => {
                const x = getX(index);

                return (
                  <g key={item.day}>
                    <line
                      x1={x}
                      y1={padding.top}
                      x2={x}
                      y2={height - padding.bottom}
                      stroke="#F2F4F7"
                    />
                    <text
                      x={x}
                      y={height - 14}
                      textAnchor="middle"
                      className="fill-[#667085] text-[11px]"
                    >
                      {item.day}일
                    </text>
                  </g>
                );
              })}

              <RevenueLine path={makePath("salesAmount")} color="#639E9B" />
              <RevenueLine path={makePath("refundAmount")} color="#DC2626" />
              <RevenueLine path={makePath("netAmount")} color="#16A34A" />

              {data.map((item, index) => (
                <g key={`${item.day}-points`}>
                  <RevenuePoint
                    x={getX(index)}
                    y={getY(item.salesAmount)}
                    color="#639E9B"
                    label={`${item.day}일 매출 ${formatWon(item.salesAmount)}`}
                  />
                  <RevenuePoint
                    x={getX(index)}
                    y={getY(item.refundAmount)}
                    color="#DC2626"
                    label={`${item.day}일 환불 ${formatWon(item.refundAmount)}`}
                  />
                  <RevenuePoint
                    x={getX(index)}
                    y={getY(item.netAmount)}
                    color="#16A34A"
                    label={`${item.day}일 순수익 ${formatWon(item.netAmount)}`}
                  />
                </g>
              ))}
            </svg>
          </div>
        )}
        <div className="mt-5 flex justify-center gap-5 text-[13px] font-semibold">
          <Legend color="bg-[#639E9B]" label="매출" />
          <Legend color="bg-[#DC2626]" label="환불" />
          <Legend color="bg-[#16A34A]" label="순수익" />
        </div>
      </div>
    </section>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-2 text-[#344054]">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {label}
    </span>
  );
}

function RevenueLine({ path, color }: { path: string; color: string }) {
  return (
    <path
      d={path}
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function RevenuePoint({
  x,
  y,
  color,
  label,
}: {
  x: number;
  y: number;
  color: string;
  label: string;
}) {
  return (
    <circle
      cx={x}
      cy={y}
      r="4"
      fill="white"
      stroke={color}
      strokeWidth="2.5"
      aria-label={label}
    />
  );
}
