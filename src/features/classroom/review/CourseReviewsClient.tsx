"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import SubHeader from "@/features/common/components/SubHeader";
import { getCountryTicketStyle } from "@/features/classroom/components/countryTicketStyle";
import type {
  CourseReview,
  CourseReviewSummary,
} from "@/features/services/courseReview.service";

interface CourseReviewsClientProps {
  courseTitle: string;
  initialReviews: CourseReview[];
  initialSummary: CourseReviewSummary;
}

const STAR = "\u2605";

const getParam = (value: string | string[] | undefined) => {
  if (!value) return "";
  return decodeURIComponent(Array.isArray(value) ? value[0] : value);
};

const clampRating = (rating: number) => {
  return Math.min(Math.max(Math.round(rating), 0), 5);
};

const getPercent = (count: number, total: number) => {
  if (total <= 0) return 0;
  return Math.round((count / total) * 100);
};

const getDisplaySummary = (
  summary: CourseReviewSummary,
  reviews: CourseReview[]
): CourseReviewSummary => {
  if (summary.totalReviewCount > 0) {
    return summary;
  }

  if (reviews.length === 0) {
    return summary;
  }

  const counts = reviews.reduce(
    (acc, review) => {
      const rating = clampRating(review.rating);
      acc[rating] += 1;
      return acc;
    },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>
  );

  const totalReviewCount = reviews.length;
  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviewCount;

  return {
    ...summary,
    averageRating,
    totalReviewCount,
    fiveStarCount: counts[5],
    fourStarCount: counts[4],
    threeStarCount: counts[3],
    twoStarCount: counts[2],
    oneStarCount: counts[1],
    fiveStarRate: getPercent(counts[5], totalReviewCount),
    fourStarRate: getPercent(counts[4], totalReviewCount),
    threeStarRate: getPercent(counts[3], totalReviewCount),
    twoStarRate: getPercent(counts[2], totalReviewCount),
    oneStarRate: getPercent(counts[1], totalReviewCount),
  };
};

const Stars = ({
  rating,
  size = "text-sm",
}: {
  rating: number;
  size?: string;
}) => {
  const safeRating = clampRating(rating);

  return (
    <span className={size} aria-label={`평점 ${safeRating}점`}>
      <span className="text-[#E5A12E]">{STAR.repeat(safeRating)}</span>
      <span className="text-[#D7E0EA]">{STAR.repeat(5 - safeRating)}</span>
    </span>
  );
};

export default function CourseReviewsClient({
  courseTitle,
  initialReviews,
  initialSummary,
}: CourseReviewsClientProps) {
  const params = useParams();

  const continentCode = getParam(params.continentCode);
  const countryId = getParam(params.countryid);
  const courseId = getParam(params.courseId);
  const style = getCountryTicketStyle(continentCode);

  const displaySummary = useMemo(
    () => getDisplaySummary(initialSummary, initialReviews),
    [initialReviews, initialSummary]
  );

  const ratingRows = [
    { rating: 5, rate: displaySummary.fiveStarRate },
    { rating: 4, rate: displaySummary.fourStarRate },
    { rating: 3, rate: displaySummary.threeStarRate },
    { rating: 2, rate: displaySummary.twoStarRate },
    { rating: 1, rate: displaySummary.oneStarRate },
  ];

  return (
    <main className="min-h-[calc(100dvh-64px)] bg-[#F3F8FC] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl">
          <SubHeader
            backHref={`/classroom/${continentCode}/${countryId}/lecture/${courseId}`}
            backText="강의로 돌아가기"
            title=""
            description=""
          />

        <section className="mt-5 overflow-hidden rounded-[28px] border border-[#DDE8EF] bg-white shadow-[0_12px_32px_rgba(55,88,110,0.08)]">
          <div className={`h-1.5 w-full ${style.accent}`} />

          <div className="p-6 sm:p-8">
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${style.soft} ${style.text}`}
              >
                수강 후기
              </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div>
                <h1 className="text-2xl font-black text-[#0A1628] sm:text-3xl">
                  {courseTitle}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#718096]">
                  실제 수강생들이 남긴 별점과 후기를 바탕으로 강의 분위기와
                  학습 경험을 확인할 수 있습니다.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-[#E6EEF5] bg-[#FAFCFE] px-4 py-4">
                    <p className="text-[10px] font-bold tracking-[0.16em] text-[#A0AEC0]">
                      평균 평점
                    </p>
                    <p className="mt-1 text-2xl font-black text-[#0A1628]">
                      {displaySummary.averageRating.toFixed(1)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#E6EEF5] bg-[#FAFCFE] px-4 py-4">
                    <p className="text-[10px] font-bold tracking-[0.16em] text-[#A0AEC0]">
                      후기 수
                    </p>
                    <p className="mt-1 text-2xl font-black text-[#0A1628]">
                      {displaySummary.totalReviewCount}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#E6EEF5] bg-[#FAFCFE] px-4 py-4">
                    <p className="text-[10px] font-bold tracking-[0.16em] text-[#A0AEC0]">
                      별점
                    </p>
                    <div className="mt-2">
                      <Stars
                        rating={displaySummary.averageRating}
                        size="text-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E6EEF5] bg-[#FAFCFE] px-5 py-5">
                <p className="text-[10px] font-bold tracking-[0.18em] text-[#A0AEC0]">
                  평점
                </p>

                <div className="mt-4 space-y-3">
                  {ratingRows.map(({ rating, rate }) => {
                    const safeRate = Math.min(Math.max(rate ?? 0, 0), 100);

                    return (
                      <div
                        key={rating}
                        className="grid grid-cols-[36px_1fr_44px] items-center gap-3"
                      >
                        <span className="text-xs font-bold text-[#667085]">
                          {rating}점
                        </span>

                        <div className="h-2 overflow-hidden rounded-full bg-[#E9EEF5]">
                          <div
                            className="h-full rounded-full bg-[#E5A12E]"
                            style={{ width: `${safeRate}%` }}
                          />
                        </div>

                        <span className="text-right text-xs font-semibold text-[#98A2B3]">
                          {safeRate}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold tracking-[0.16em] text-[#439A97]">
                REVIEW BOARD
              </p>
              <h2 className="mt-1 text-xl font-bold text-[#0A1628]">
                전체 후기
              </h2>
            </div>
          </div>

          {initialReviews.length === 0 ? (
            <div className="rounded-2xl border border-[#E1E8EF] bg-white px-6 py-12 text-center shadow-[0_8px_24px_rgba(55,88,110,0.07)]">
              <p className="text-sm font-semibold text-[#0A1628]">
                아직 작성된 수강 후기가 없습니다.
              </p>
              <p className="mt-1 text-sm text-[#8A94A6]">
                첫 수강 후기가 등록되면 이곳에서 확인할 수 있습니다.
              </p>
            </div>
          ) : (
            <ul className="grid gap-4">
              {initialReviews.map((review) => {
                const rating = clampRating(review.rating);
                const nickname = review.nickname || "익명";

                return (
                  <li key={review.reviewId}>
                    <article className="relative overflow-hidden rounded-2xl border border-[#E1E8EF] bg-white p-6 shadow-[0_8px_24px_rgba(55,88,110,0.07)] transition hover:-translate-y-0.5 hover:border-[#B7DAD7] hover:shadow-[0_14px_34px_rgba(55,88,110,0.12)]">
                        <div className={`absolute left-0 top-0 h-full w-1 ${style.accent}`} />

                        <div className="flex flex-wrap items-center justify-between gap-3 pl-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${style.soft} ${style.text}`}
                            >
                              {nickname}
                            </span>
                            <Stars rating={rating} />
                          </div>

                          <time
                            dateTime={review.createdAt}
                            className="text-xs font-semibold text-[#98A2B3]"
                          >
                            {new Date(review.createdAt).toLocaleDateString("ko-KR")}
                          </time>
                        </div>

                        <p className="mt-4 whitespace-pre-wrap break-words pl-2 text-sm leading-7 text-[#475467]">
                          {review.content}
                        </p>
                      </article>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}