import { Clock, RotateCcw, Star, WalletCards } from "lucide-react";
import type { RepurchaseLtvSummary } from "../types";
import { formatPercent, formatWon } from "../utils";

type RepurchaseLtvSummaryCardsProps = {
  summary: RepurchaseLtvSummary;
};

export default function RepurchaseLtvSummaryCards({
  summary,
}: RepurchaseLtvSummaryCardsProps) {
  const cards = [
    {
      label: "재구매율",
      value: formatPercent(summary.repurchaseRate),
      caption: "재구매 고객 비율",
      icon: RotateCcw,
      iconClassName: "bg-[#E7F7F2] text-[#2FAE9B]",
    },
    {
      label: "ARPU",
      value: formatWon(summary.arpu),
      caption: "인당 평균 결제액",
      icon: WalletCards,
      iconClassName: "bg-[#F2EEFF] text-[#8B5CF6]",
    },
    {
      label: "평균 구매간격",
      value: `${summary.averagePurchaseIntervalDays}일`,
      caption: "구매 간 평균 일수",
      icon: Clock,
      iconClassName: "bg-[#FFF3DF] text-[#F59E0B]",
    },
    {
      label: "상위 10% 매출집중도",
      value: formatPercent(summary.topCustomerRevenueShare),
      caption: "상위 고객 집중",
      icon: Star,
      iconClassName: "bg-[#FCE7F3] text-[#EC4899]",
    },
  ];

  return (
    <section className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article key={card.label} className="rounded-[18px] bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[13px] font-medium text-[#667085]">{card.label}</p>
                <p className="mt-5 text-[28px] font-extrabold text-[#111827]">
                  {card.value}
                </p>
                <p className="mt-1 text-[13px] font-semibold text-[#98A2B3]">
                  {card.caption}
                </p>
              </div>
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${card.iconClassName}`}
              >
                <Icon size={18} strokeWidth={2.2} />
              </span>
            </div>
          </article>
        );
      })}
    </section>
  );
}
