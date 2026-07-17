import { Globe2, TrendingDown, WalletCards } from "lucide-react";
import type { CountryProfitabilitySummary } from "../types";
import { formatManwon, formatPercent } from "../utils";

type CountryProfitabilitySummaryCardsProps = {
  summary: CountryProfitabilitySummary;
};

export default function CountryProfitabilitySummaryCards({
  summary,
}: CountryProfitabilitySummaryCardsProps) {
  const cards = [
    {
      label: "집계 국가 수",
      value: `${summary.countryCount}개국`,
      icon: Globe2,
      iconClassName: "bg-[#E7F7F2] text-[#2FAE9B]",
    },
    {
      label: "총 순매출",
      value: formatManwon(summary.totalNetRevenue),
      icon: WalletCards,
      iconClassName: "bg-[#F2EEFF] text-[#8B5CF6]",
    },
    {
      label: "평균 환불율",
      value: formatPercent(summary.averageRefundRate),
      icon: TrendingDown,
      iconClassName: "bg-[#FCE7F3] text-[#EC4899]",
    },
  ];

  return (
    <section className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article key={card.label} className="rounded-[18px] bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[13px] font-medium text-[#667085]">
                  {card.label}
                </p>
                <p className="mt-5 text-[28px] font-extrabold text-[#111827]">
                  {card.value}
                </p>
              </div>

              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${card.iconClassName}`}
              >
                <Icon size={18} />
              </span>
            </div>
          </article>
        );
      })}
    </section>
  );
}
