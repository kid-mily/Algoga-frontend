import { DailyConversionStat } from "../types";
import { formatDateLabel, formatPercent } from "../utils";

type DailyConversionChartProps = {
  data: DailyConversionStat[];
  isLoading: boolean;
};

export default function DailyConversionChart({
  data,
  isLoading,
}: DailyConversionChartProps) {
  const width = 980;
  const height = 300;
  const padding = {
    top: 24,
    right: 24,
    bottom: 42,
    left: 58,
  };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const maxValue = Math.max(100, ...data.map((item) => item.conversionRate));
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) =>
    Math.round(maxValue * ratio)
  );
  const getX = (index: number) =>
    padding.left +
    (data.length > 1 ? (chartWidth / (data.length - 1)) * index : chartWidth / 2);
  const getY = (value: number) =>
    padding.top + chartHeight - (value / maxValue) * chartHeight;
  const path = data
    .map((item, index) => `${index === 0 ? "M" : "L"} ${getX(index)} ${getY(item.conversionRate)}`)
    .join(" ");

  return (
    <section className="mb-5 rounded-[16px] border border-[#E4E7EC] bg-white">
      <header className="border-b border-[#EEF0F3] px-6 py-4">
        <h2 className="text-[18px] font-bold text-[#111827]">일별 전환율 추이</h2>
      </header>

      <div className="overflow-x-auto p-6">
        {isLoading ? (
          <p
            role="status"
            aria-live="polite"
            className="py-12 text-center text-[14px] text-[#667085]"
          >
            일별 전환율을 불러오는 중입니다...
          </p>
        ) : data.length === 0 ? (
          <p
            role="status"
            aria-live="polite"
            className="py-12 text-center text-[14px] text-[#667085]"
          >
            일별 전환율 데이터가 없습니다.
          </p>
        ) : (
          <div className="min-w-[900px]">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="h-[300px] w-full"
              role="img"
              aria-label="일별 예약 전환율 선 그래프"
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
                      {formatPercent(tick)}
                    </text>
                  </g>
                );
              })}

              {data.map((item, index) => {
                const x = getX(index);

                return (
                  <g key={`${item.date}-${index}`}>
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
                      {formatDateLabel(item.date)}
                    </text>
                  </g>
                );
              })}

              <path
                d={path}
                fill="none"
                stroke="#439A97"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {data.map((item, index) => (
                <circle
                  key={`${item.date}-point-${index}`}
                  cx={getX(index)}
                  cy={getY(item.conversionRate)}
                  r="4"
                  fill="white"
                  stroke="#439A97"
                  strokeWidth="2.5"
                  aria-label={`${item.date} 전환율 ${formatPercent(item.conversionRate)}`}
                />
              ))}
            </svg>
          </div>
        )}
      </div>
    </section>
  );
}
