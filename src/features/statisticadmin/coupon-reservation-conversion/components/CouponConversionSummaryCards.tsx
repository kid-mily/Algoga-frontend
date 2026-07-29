import { CheckCircle2, Clock3, Percent, Tags, TrendingUp } from "lucide-react";
import type { CouponConversionSummary } from "../types";
import { formatCouponCount, formatPercent } from "../utils";

type CouponConversionSummaryCardsProps = {
  summary: CouponConversionSummary;
};

const iconClassName = "h-10 w-10 rounded-full p-2.5";

export default function CouponConversionSummaryCards({
  summary,
}: CouponConversionSummaryCardsProps) {
  const cards = [
    {
      label: "쿠폰 발급 수",
      value: formatCouponCount(summary.issuedCount),
      icon: <Tags className={`${iconClassName} bg-[#E8F8F5] text-[#2FAE9B]`} />,
    },
    {
      label: "쿠폰 사용 수",
      value: formatCouponCount(summary.usedCount),
      icon: (
        <CheckCircle2 className={`${iconClassName} bg-[#F0EEFF] text-[#8B7CF6]`} />
      ),
    },
    {
      label: "쿠폰 사용률",
      value: formatPercent(summary.usageRate),
      icon: <Percent className={`${iconClassName} bg-[#FFF3E1] text-[#F59E32]`} />,
    },
    {
      label: "사용 가능",
      value: formatCouponCount(summary.availableCount),
      icon: <Clock3 className={`${iconClassName} bg-[#F8FAFC] text-[#98A2B3]`} />,
    },
    {
      label: "예약 전환율",
      value: formatPercent(summary.reservationConversionRate),
      icon: (
        <TrendingUp className={`${iconClassName} bg-[#FCE7F3] text-[#EC4899]`} />
      ),
    },
  ];

  return (
    <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-[18px] border border-[#EAECF0] bg-white p-6 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <p className="text-[13px] font-semibold text-[#667085]">{card.label}</p>
            {card.icon}
          </div>

          <p className="mt-4 text-[30px] font-bold text-[#111827]">{card.value}</p>
        </article>
      ))}
    </section>
  );
}
