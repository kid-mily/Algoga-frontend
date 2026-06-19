import { CouponStatisticsSummary } from "../types";
import { formatPercent } from "../utils";

type CouponStatisticsSummaryCardsProps = {
  summary: CouponStatisticsSummary;
};

export default function CouponStatisticsSummaryCards({
  summary,
}: CouponStatisticsSummaryCardsProps) {
  const cards = [
    {
      label: "쿠폰 정책",
      value: `${summary.totalPolicyCount.toLocaleString()}개`,
      color: "text-[#111827]",
    },
    {
      label: "총 발급",
      value: `${summary.totalIssuedCount.toLocaleString()}건`,
      color: "text-[#344054]",
    },
    {
      label: "총 사용",
      value: `${summary.totalUsedCount.toLocaleString()}건`,
      color: "text-[#439A97]",
    },
    {
      label: "만료",
      value: `${summary.totalExpiredCount.toLocaleString()}건`,
      color: "text-[#DC2626]",
    },
    {
      label: "사용 가능",
      value: `${summary.totalAvailableCount.toLocaleString()}건`,
      color: "text-[#111827]",
      subText: `사용률 ${formatPercent(summary.averageUsageRate)}`,
    },
  ];

  return (
    <section className="grid grid-cols-5 gap-4">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-[16px] border border-[#E4E7EC] bg-white p-5"
        >
          <p className="text-[13px] font-semibold text-[#667085]">{card.label}</p>
          <p className={`mt-3 text-[24px] font-bold ${card.color}`}>
            {card.value}
          </p>
          {card.subText && (
            <p className="mt-2 text-[13px] font-semibold text-[#667085]">
              {card.subText}
            </p>
          )}
        </article>
      ))}
    </section>
  );
}
