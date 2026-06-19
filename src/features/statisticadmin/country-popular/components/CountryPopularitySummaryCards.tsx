import { CountryPopularitySummary } from "../types";
import { formatNumber, formatPercent, formatWon } from "../utils";

type CountryPopularitySummaryCardsProps = {
  summary: CountryPopularitySummary;
};

export default function CountryPopularitySummaryCards({
  summary,
}: CountryPopularitySummaryCardsProps) {
  const cards = [
    {
      title: "집계 국가",
      value: `${formatNumber(summary.totalCountryCount)}개`,
      tone: "text-[#344054]",
    },
    {
      title: "총 조회 수",
      value: `${formatNumber(summary.totalViewCount)}건`,
      tone: "text-[#439A97]",
    },
    {
      title: "예약 완료",
      value: `${formatNumber(summary.totalBookingCount)}건`,
      tone: "text-[#111827]",
    },
    {
      title: "총 수익",
      value: formatWon(summary.totalRevenueAmount),
      tone: "text-[#344054]",
    },
    {
      title: "평균 전환율",
      value: formatPercent(summary.averageConversionRate),
      tone: "text-[#111827]",
    },
  ];

  return (
    <section
      className="mb-5 grid grid-cols-5 gap-4"
      aria-label="나라별 인기도 요약"
    >
      {cards.map((card) => (
        <article
          key={card.title}
          className="rounded-[16px] border border-[#E4E7EC] bg-white p-5"
        >
          <p className="text-[13px] font-semibold text-[#667085]">
            {card.title}
          </p>
          <p className={`mt-3 text-[24px] font-bold ${card.tone}`}>
            {card.value}
          </p>
        </article>
      ))}
    </section>
  );
}
