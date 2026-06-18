import { MonthlyRevenueDetail, MonthlyRevenueStat } from "../types";
import { formatGrowthRate, formatWon } from "../utils";

type RevenueSummaryCardsProps = {
  stat: MonthlyRevenueStat | MonthlyRevenueDetail;
};

export default function RevenueSummaryCards({ stat }: RevenueSummaryCardsProps) {
  const cards = [
    {
      label: "총 매출",
      value: formatWon(stat.totalAmount),
      color: "text-[#111827]",
    },
    {
      label: "환불 금액",
      value: formatWon(stat.refundAmount),
      color: "text-[#DC2626]",
    },
    {
      label: "순 수익",
      value: formatWon(stat.netAmount),
      color: "text-[#16A34A]",
    },
    {
      label: "결제 건수",
      value: `${stat.count.toLocaleString()}건`,
      color: "text-[#111827]",
    },
  ];

  return (
    <section className="grid grid-cols-4 gap-4">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-[16px] border border-[#E4E7EC] bg-white p-5"
        >
          <p className="text-[13px] font-semibold text-[#667085]">{card.label}</p>
          <p className={`mt-3 text-[24px] font-bold ${card.color}`}>
            {card.value}
          </p>
          {card.label === "순 수익" && (
            <p
              className={`mt-2 text-[13px] font-semibold ${
                stat.growthRate >= 0 ? "text-[#16A34A]" : "text-[#DC2626]"
              }`}
            >
              전월 대비 {formatGrowthRate(stat.growthRate)}
            </p>
          )}
        </article>
      ))}
    </section>
  );
}
