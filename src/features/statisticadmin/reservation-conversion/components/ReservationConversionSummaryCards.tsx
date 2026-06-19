import { ConversionSummary } from "../types";
import { formatNumber, formatPercent } from "../utils";

type ReservationConversionSummaryCardsProps = {
  summary: ConversionSummary;
};

const cards = [
  {
    key: "attemptCount",
    title: "결제 페이지 진입 수",
    tone: "text-[#344054]",
  },
  {
    key: "completedCount",
    title: "예약 완료",
    tone: "text-[#439A97]",
  },
  {
    key: "conversionRate",
    title: "전환율",
    tone: "text-[#111827]",
  },
] as const;

export default function ReservationConversionSummaryCards({
  summary,
}: ReservationConversionSummaryCardsProps) {
  return (
    <section className="mb-5 grid grid-cols-3 gap-4" aria-label="예약 전환율 요약">
      {cards.map((card) => {
        const value =
          card.key === "conversionRate"
            ? formatPercent(summary.conversionRate)
            : `${formatNumber(summary[card.key])}건`;

        return (
          <article
            key={card.key}
            className="rounded-[16px] border border-[#E4E7EC] bg-white p-5"
          >
            <p className="text-[13px] font-semibold text-[#667085]">{card.title}</p>
            <p className={`mt-3 text-[26px] font-bold ${card.tone}`}>{value}</p>
          </article>
        );
      })}
    </section>
  );
}
