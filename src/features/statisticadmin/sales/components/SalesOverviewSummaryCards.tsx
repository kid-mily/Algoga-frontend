import {
  CircleDollarSign,
  Coins,
  CreditCard,
  RefreshCcw,
  type LucideIcon,
} from "lucide-react";

import {
  formatKoreanMoney,
  formatPercentValue,
  formatRateValue,
} from "../utils/salesOverviewFormatters";

import { SalesOverviewSummaryCardsProps, SummaryCard } from '../types';

export default function SalesOverviewSummaryCards({
  summary,
}: SalesOverviewSummaryCardsProps) {
  const cards: SummaryCard[] = [
    {
      label: "순매출",
      value: formatKoreanMoney(summary.netSales),
      delta: formatPercentValue(summary.netSalesChangeRate),
      deltaTone: summary.netSalesChangeRate >= 0 ? "positive" : "negative",
      icon: CircleDollarSign,
      iconTone: "bg-[#DDF7EF] text-[#2BB3A3]",
    },
    {
      label: "총 미수금",
      value: formatKoreanMoney(summary.receivableAmount),
      delta: formatPercentValue(summary.receivableChangeRate),
      deltaTone: summary.receivableChangeRate <= 0 ? "positive" : "negative",
      icon: Coins,
      iconTone: "bg-[#FFF1D6] text-[#F59E0B]",
    },
    {
      label: "환불율 (예약매출 대비)",
      value: formatRateValue(summary.refundRate),
      delta: `${formatPercentValue(summary.refundRateChange)}p`,
      deltaTone: summary.refundRateChange <= 0 ? "positive" : "negative",
      icon: RefreshCcw,
      iconTone: "bg-[#FFE4EF] text-[#EC4899]",
    },
    {
      label: "잔금 전환율",
      value: formatRateValue(summary.balanceConversionRate),
      delta: `${formatPercentValue(summary.balanceConversionRateChange)}p`,
      deltaTone:
        summary.balanceConversionRateChange >= 0 ? "positive" : "negative",
      icon: CreditCard,
      iconTone: "bg-[#ECE9FF] text-[#8B5CF6]",
    },
  ];

  return (
    <section className="grid grid-cols-4 gap-4" aria-label="재무 요약">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.label}
            className="rounded-[16px] border border-[#EAECF0] bg-white p-5 shadow-[0_12px_28px_rgba(16,24,40,0.06)]"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="max-w-[150px] text-[13px] font-semibold leading-5 text-[#667085]">
                {card.label}
              </p>
              <span
                className={`flex h-[30px] w-[30px] items-center justify-center rounded-full ${card.iconTone}`}
              >
                <Icon
                  aria-hidden="true"
                  className="h-[15px] w-[15px]"
                  strokeWidth={2}
                />
              </span>
            </div>
            <p className="mt-8 text-[24px] font-bold text-[#101828]">
              {card.value}
            </p>
            <span
              className={`mt-3 inline-flex rounded-full px-2 py-1 text-[12px] font-bold ${
                card.deltaTone === "positive"
                  ? "bg-[#E6F8EF] text-[#12B76A]"
                  : "bg-[#FFECEF] text-[#F04438]"
              }`}
            >
              {card.delta}
            </span>
          </article>
        );
      })}
    </section>
  );
}
