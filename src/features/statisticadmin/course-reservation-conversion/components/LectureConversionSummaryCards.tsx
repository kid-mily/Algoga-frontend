import { BarChart3, Bolt, TrendingUp, UsersRound } from "lucide-react";
import type { LectureReservationSummary } from "../types";
import { formatMultiplier, formatPeople, formatPercent } from "../utils";

type LectureConversionSummaryCardsProps = {
  summary: LectureReservationSummary;
};

const iconClassName = "h-10 w-10 rounded-full p-2.5";

export default function LectureConversionSummaryCards({
  summary,
}: LectureConversionSummaryCardsProps) {
  const cards = [
    {
      label: "단과 강의 구매자",
      value: formatPeople(summary.totalLectureBuyers),
      icon: <UsersRound className={`${iconClassName} bg-[#E8F8F5] text-[#2FAE9B]`} />,
    },
    {
      label: "완강률",
      value: formatPercent(summary.completionRate),
      icon: <BarChart3 className={`${iconClassName} bg-[#F0EEFF] text-[#8B7CF6]`} />,
    },
    {
      label: "완강자→여행 전환율",
      value: formatPercent(summary.completedToReservationRate),
      icon: <TrendingUp className={`${iconClassName} bg-[#FFF3E1] text-[#F59E32]`} />,
    },
    {
      label: "완강 vs 미완강 전환 배율",
      value: formatMultiplier(summary.completedVsIncompleteMultiplier),
      icon: <Bolt className={`${iconClassName} bg-[#FCE7F3] text-[#EC4899]`} />,
    },
  ];

  return (
    <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-[16px] border border-[#EAECF0] bg-white p-6 shadow-sm"
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
