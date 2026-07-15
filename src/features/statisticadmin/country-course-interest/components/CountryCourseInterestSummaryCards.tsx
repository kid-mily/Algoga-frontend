import { BookOpen, TrendingUp, TriangleAlert } from "lucide-react";
import type { CountryCourseInterestSummaryCardsProps } from "../types";


export default function CountryCourseInterestSummaryCards({
  summary,
}: CountryCourseInterestSummaryCardsProps) {
  const cards = [
    {
      label: "총 수강 건수",
      value: `${summary.totalEnrollmentCount.toLocaleString()}건`,
      description: "전체 강의 합산",
      icon: BookOpen,
      tone: "green",
    },
    {
      label: "평균 수료율",
      value: `${summary.averageCompletionRate}%`,
      description: "전체 강의 평균",
      icon: TrendingUp,
      tone: "green",
    },
    {
      label: "수료율 위험 강의",
      value: `${summary.riskyCourseCount}개`,
      description: "수료율 30% 미만",
      icon: TriangleAlert,
      tone: "red",
    },
  ];

  return (
    <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const isRed = card.tone === "red";

        return (
          <article
            key={card.label}
            className="rounded-[20px] bg-white p-6 shadow-sm"
          >
            <header className="flex items-start justify-between">
              <p className="text-[15px] font-medium text-[#667085]">
                {card.label}
              </p>

              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  isRed
                    ? "bg-[#FEEEEE] text-[#EF4444]"
                    : "bg-[#E8F7F3] text-[#2FAE9B]"
                }`}
              >
                <Icon size={18} />
              </span>
            </header>

            <p
              className={`mt-7 text-[32px] font-bold ${
                isRed ? "text-[#EF4444]" : "text-[#111827]"
              }`}
            >
              {card.value}
            </p>

            <p className="mt-2 text-[14px] text-[#98A2B3]">
              {card.description}
            </p>
          </article>
        );
      })}
    </section>
  );
}
