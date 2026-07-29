import { ArrowRight } from "lucide-react";
import type { LectureConversionFunnelStep, LectureReservationSummary } from "../types";
import { formatPeople, formatPercent, funnelToneStyles } from "../utils";

type LectureConversionFunnelProps = {
  data: LectureConversionFunnelStep[];
  summary: LectureReservationSummary;
};

export default function LectureConversionFunnel({
  data,
  summary,
}: LectureConversionFunnelProps) {
  const overallConversionRate =
    data.find((item) => item.key === "reserved")?.percentage ?? 0;

  return (
    <section className="mt-6 rounded-[18px] border border-[#EAECF0] bg-white p-6 shadow-sm">
      <h2 className="text-[17px] font-bold text-[#111827]">
        전환 퍼널: 단과구매 → 완강 → 패키지 예약
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-center">
        {data.map((step, index) => {
          const tone = funnelToneStyles[step.tone];

          return (
            <div key={step.key} className="contents">
              <article className={`rounded-[16px] border px-6 py-5 text-center ${tone.panel}`}>
                <p className="text-[13px] font-semibold text-[#98A2B3]">{step.label}</p>
                <p className={`mt-2 text-[28px] font-bold ${tone.value}`}>
                  {formatPeople(step.value)}
                </p>
                <p className={`mt-1 text-[13px] font-bold ${tone.value}`}>
                  {step.caption}
                </p>
              </article>

              {index < data.length - 1 && (
                <div className="hidden justify-center text-[#C0C7D2] lg:flex">
                  <ArrowRight size={20} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
        {data.map((step, index) => {
          const tone = funnelToneStyles[step.tone];

          return (
            <div key={step.key} className="contents">
              <div className="h-2 overflow-hidden rounded-full bg-[#EEF2F6]">
                <div
                  className={`h-full rounded-full ${tone.bar}`}
                  style={{ width: `${Math.min(step.percentage, 100)}%` }}
                />
              </div>
              {index < data.length - 1 && <div className="hidden lg:block" />}
            </div>
          );
        })}
      </div>

      <div className="mt-6 border-t border-[#EEF2F6] pt-5 text-[14px] font-semibold text-[#667085]">
        완강률{" "}
        <span className="text-[#8B7CF6]">{formatPercent(summary.completionRate)}</span>
        <span className="mx-3 text-[#C0C7D2]">→</span>
        완강자 여행 전환율{" "}
        <span className="text-[#F59E32]">
          {formatPercent(summary.completedToReservationRate)}
        </span>
        <span className="mx-3 text-[#C0C7D2]">→</span>
        전체 전환율{" "}
        <span className="text-[#2FAE9B]">{formatPercent(overallConversionRate)}</span>
      </div>
    </section>
  );
}
