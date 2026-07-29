import type { RefundSummary } from "../types";
import { formatPercent, formatWon } from "../utils";

type RefundSummaryCardsProps = {
  summary: RefundSummary;
};

export default function RefundSummaryCards({
  summary,
}: RefundSummaryCardsProps) {
  const cards = [
    {
      label: "환불율\n(예약매출 대비)",
      value: formatPercent(summary.refundRate),
      valueClassName: "text-[#EC4899]",
    },
    {
      label: "순매출",
      value: formatWon(summary.netRevenue),
      valueClassName: "text-[#2FAE9B]",
    },
    {
      label: "완납 후 취소",
      value: `${summary.paidCancelCount}건`,
      valueClassName: "text-[#F59E0B]",
    },
    {
      label: "결제 취소율",
      value: formatPercent(summary.paymentCancelRate),
      valueClassName: "text-[#8B5CF6]",
    },
  ];

  return (
    <section className="mx-6 mt-8 grid grid-cols-1 gap-5 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-[18px] bg-white p-6 shadow-sm"
        >
          <p className="whitespace-pre-line text-[13px] font-medium text-[#667085]">
            {card.label}
          </p>

          <p className={`mt-4 text-[28px] font-bold ${card.valueClassName}`}>
            {card.value}
          </p>
        </article>
      ))}
    </section>
  );
}
