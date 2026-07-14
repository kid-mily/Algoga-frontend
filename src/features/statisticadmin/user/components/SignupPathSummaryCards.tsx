import { SignupPathSummary } from "../types";
import { formatNumber, formatWon } from "../utils";

type SignupPathSummaryCardsProps = {
  summary: SignupPathSummary;
};

export default function SignupPathSummaryCards({
  summary,
}: SignupPathSummaryCardsProps) {
  const cards = [
    {
      title: "총가입자 수",
      value: `${formatNumber(summary.totalSignupCount)}명`,
      tone: "text-[#439A97]",
    },
    {
      title: "총 순매출",
      value: formatWon(summary.totalNetSales),
      tone: "text-[#344054]",
    },
    {
      title: "최고 효율 경로",
      value: `${summary.bestEfficiencyPathLabel} · ${formatWon(
        summary.bestEfficiencyPathArpu
      )}`,
      tone: "text-[#111827]",
    },
  ];

  return (
    <section
      className="mb-5 grid grid-cols-3 gap-4"
      aria-label="유저 유입 경로 요약"
    >
      {cards.map((card) => (
        <article
          key={card.title}
          className="rounded-[16px] border border-[#E4E7EC] bg-white p-5"
        >
          <p className="text-[13px] font-semibold text-[#667085]">
            {card.title}
          </p>
          <p className={`mt-3 truncate text-[24px] font-bold ${card.tone}`}>
            {card.value}
          </p>
        </article>
      ))}
    </section>
  );
}
