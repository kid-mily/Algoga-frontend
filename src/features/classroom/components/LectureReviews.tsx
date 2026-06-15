// 수강 후기

import Link from "next/link";
import { CourseReviewSummary } from "./types";

interface LectureReviewsProps {
  summary: CourseReviewSummary | null;
  continentCode: string;
  countryId: string;
  courseId: string;
}

export default function LectureReviews({
  summary,
  continentCode,
  countryId,
  courseId,
}: LectureReviewsProps) {
  if (!summary || summary.totalReviewCount === 0) {
    return (
      <section className="rounded-2xl bg-white p-6 py-10 text-center text-gray-500 shadow-sm">
        아직 작성된 수강 후기가 없습니다.
      </section>
    );
  }

  const stats = [
    { score: 5, percentage: summary.fiveStarRate },
    { score: 4, percentage: summary.fourStarRate },
    { score: 3, percentage: summary.threeStarRate },
    { score: 2, percentage: summary.twoStarRate },
    { score: 1, percentage: summary.oneStarRate },
  ];

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <header className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">수강 후기</h2>

        <Link
          href={`/classroom/${continentCode}/${countryId}/lecture/${courseId}/review`}
          className="text-sm text-gray-400 hover:underline"
        >
          더보기 &gt;
        </Link>
      </header>

      <div className="flex flex-col items-center gap-8 pb-8">
        <div className="p-5 text-center">
          <div className="text-5xl font-bold text-[#0A1628]">
            {summary.averageRating.toFixed(1)}
          </div>

          <p className="mt-2 text-xs text-gray-400">
            {summary.totalReviewCount}개의 후기
          </p>
        </div>

        <div className="w-full max-w-md flex-1">
          {stats.map((stat) => (
            <div
              key={stat.score}
              className="mb-2 flex items-center gap-4 text-sm text-gray-500"
            >
              <span>{stat.score}점</span>

              <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-amber-400"
                  style={{ width: `${stat.percentage}%` }}
                />
              </div>

              <span className="w-10 text-right">{stat.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}