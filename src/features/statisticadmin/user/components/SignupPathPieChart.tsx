import { SignupPathStatistic } from "../types";
import { formatPercent } from "../utils";

type SignupPathPieChartProps = {
  statistics: SignupPathStatistic[];
  isLoading: boolean;
};

export default function SignupPathPieChart({
  statistics,
  isLoading,
}: SignupPathPieChartProps) {
  const visibleStatistics = statistics.filter((item) => item.ratio > 0);
  const totalRatio = visibleStatistics.reduce((sum, item) => sum + item.ratio, 0);

  const getPoint = (angle: number, radius: number) => {
    const radian = (Math.PI / 180) * angle;

    return {
      x: 210 + radius * Math.cos(radian),
      y: 145 + radius * Math.sin(radian),
    };
  };

  const makePath = (startAngle: number, endAngle: number) => {
    const start = getPoint(startAngle, 84);
    const end = getPoint(endAngle, 84);
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return [
      "M 210 145",
      `L ${start.x} ${start.y}`,
      `A 84 84 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
      "Z",
    ].join(" ");
  };
  const chartSegments = visibleStatistics.reduce<{
    currentAngle: number;
    segments: {
      item: SignupPathStatistic;
      startAngle: number;
      endAngle: number;
      labelPoint: { x: number; y: number };
    }[];
  }>(
    (accumulator, item) => {
      const angle = totalRatio > 0 ? (item.ratio / totalRatio) * 360 : 0;
      const startAngle = accumulator.currentAngle;
      const endAngle = accumulator.currentAngle + angle;

      return {
        currentAngle: endAngle,
        segments: [
          ...accumulator.segments,
          {
            item,
            startAngle,
            endAngle,
            labelPoint: getPoint(startAngle + angle / 2, 118),
          },
        ],
      };
    },
    { currentAngle: -90, segments: [] }
  ).segments;

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
        ) : visibleStatistics.length === 0 || totalRatio <= 0 ? (
          <p
            role="status"
            aria-live="polite"
            className="py-12 text-center text-[14px] text-[#667085]"
          >
            유입 경로 비율 데이터가 없습니다.
          </p>
        ) : (
          <>
            <svg
              viewBox="0 0 500 290"
              className="h-[280px] w-full"
              role="img"
              aria-label="유입 경로별 회원가입 비율 원형 차트"
            >
              {chartSegments.map(({ item, startAngle, endAngle, labelPoint }) => {
                return (
                  <g key={`${item.signupPath}-${item.label}`}>
                    <path
                      d={makePath(startAngle, endAngle)}
                      fill={item.color}
                    />
                    <text
                      x={labelPoint.x}
                      y={labelPoint.y}
                      textAnchor={labelPoint.x > 210 ? "start" : "end"}
                      className="text-[11px] font-semibold"
                      fill={item.color}
                    >
                      {item.label} {formatPercent(item.ratio)}
                    </text>
                  </g>
                );
              })}
              <circle cx="210" cy="145" r="42" fill="#fff" />
            </svg>

            <div className="mt-2 flex flex-wrap justify-center gap-4 text-[12px] font-semibold text-[#344054]">
              {statistics.map((item) => (
                <div key={`${item.signupPath}-${item.label}`} className="flex items-center gap-2">
                  <span
                    className="h-[9px] w-[9px] rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.label}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
