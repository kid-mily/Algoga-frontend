import type { BalanceSummary } from "../types";
import { formatWon } from "../utils";

type BalanceSummaryCardsProps = {
  summary: BalanceSummary;
};

export default function BalanceSummaryCards({
  summary,
}: BalanceSummaryCardsProps) {
  const cards = [
    {
      label: "잔금 전환율",
      value: `${summary.conversionRate.toFixed(1)}%`,
    },
    {
      label: "미수금",
      value: formatWon(summary.outstandingAmount),
    },
    {
      label: "D-day 임박 미납",
      value: `${summary.dueSoonCount}건`,
    },
    {
      label: "위험(At-risk) 건수",
      value: `${summary.atRiskCount}건`,
    },
  ];

  return (
    <section className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-[18px] bg-white p-6 shadow-sm"
        >
          <p className="text-[14px] font-medium text-[#667085]">
            {card.label}
          </p>

          <p className="mt-4 text-[28px] font-bold text-[#111827]">
            {card.value}
          </p>
        </article>
      ))}
    </section>
  );
}
