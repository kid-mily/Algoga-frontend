import { formatNumber, formatPercent } from "../utils";

type CourseEnrollmentSummaryCardsProps = {
  summary: {
    totalCourseCount: number;
    totalStudentCount: number;
    averageCompletionRate: number;
    averageProgressRate: number;
  };
};

export default function CourseEnrollmentSummaryCards({
  summary,
}: CourseEnrollmentSummaryCardsProps) {
  const cards = [
    {
      label: "조회 강의",
      value: `${formatNumber(summary.totalCourseCount)}개`,
    },
    {
      label: "총 수강생",
      value: `${formatNumber(summary.totalStudentCount)}명`,
    },
    {
      label: "평균 진도율",
      value: formatPercent(summary.averageProgressRate),
    },
    {
      label: "평균 수료율",
      value: formatPercent(summary.averageCompletionRate),
    },
  ];

  return (
    <section className="mb-5 grid grid-cols-4 gap-4" aria-label="수강률 요약">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-[16px] border border-[#E4E7EC] bg-white p-5"
        >
          <p className="text-[13px] font-semibold text-[#667085]">
            {card.label}
          </p>
          <p className="mt-2 text-[24px] font-bold text-[#111827]">
            {card.value}
          </p>
        </article>
      ))}
    </section>
  );
}
