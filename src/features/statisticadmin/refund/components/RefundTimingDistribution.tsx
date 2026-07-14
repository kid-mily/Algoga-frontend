import type { RefundTiming } from "../types";

type RefundTimingDistributionProps = {
  data: RefundTiming[];
};

export default function RefundTimingDistribution({
  data,
}: RefundTimingDistributionProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <article className="rounded-[18px] bg-white p-6 shadow-sm">
      <h3 className="text-[17px] font-bold text-[#111827]">
        환불 타이밍 분포
      </h3>

      <div className="mt-6 space-y-6">
        {data.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-2 text-[13px] font-bold text-[#344054]">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex shrink-0 items-center gap-2 text-[12px] font-bold">
                <span style={{ color: item.color }}>{item.rate}%</span>
                <span className="text-[#98A2B3]">({item.count}건)</span>
              </div>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-[#F2F4F7]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${item.rate}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 border-t border-[#EAECF0] pt-4 text-[12px] font-medium text-[#98A2B3]">
        총 취소 {total}건 기준
      </p>
    </article>
  );
}
