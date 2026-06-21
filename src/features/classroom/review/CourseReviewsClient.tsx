"use client";

import { useParams } from "next/navigation";
import SubHeader from "@/features/common/SubHeader";
import type { CourseReview, CourseReviewSummary } from "@/features/services/courseReview.service";

interface CourseReviewsClientProps {
    courseTitle: string;
    initialReviews: CourseReview[];
    initialSummary: CourseReviewSummary;
}

const getParam = (
    value: string | string[] | undefined
) => {
    if (!value) return "";
    
    return decodeURIComponent(
        Array.isArray(value) ? value[0] : value
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

    const rates = [
        initialSummary.fiveStarRate,
        initialSummary.fourStarRate,
        initialSummary.threeStarRate,
        initialSummary.twoStarRate,
        initialSummary.oneStarRate,
    ];

    return (
        <main className="min-h-[calc(100dvh-64px)] bg-[#F5F7FB] px-6 py-8">
        <div className="mx-auto max-w-3xl">
            <SubHeader
            backHref={`/classroom/${continentCode}/${countryId}/lecture/${courseId}`}
            backText="돌아가기"
            title=""
            description=""
            />

            <header className="rounded-[20px] bg-white px-6 py-5 shadow-sm">
            <p className="text-sm font-bold text-[#5E9F9B]">
                {courseTitle}
            </p>

            <h1 className="mt-1 text-xl font-bold text-[#0A1628]">
                수강 후기
            </h1>

            <p className="mt-1 text-sm text-[#8A9BB0]">
                수강생이 작성한 강의 후기를 확인해 보세요.
            </p>
            </header>

            {/* 후기 요약 */}
            <section className="mt-4 grid grid-cols-[220px_1fr] gap-4 rounded-[20px] bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center justify-center border-r border-[#E8EEF5]">
                <strong className="text-4xl text-[#0A1628]">
                {initialSummary.averageRating.toFixed(1)}
                </strong>

                <div
                className="mt-2 text-lg text-[#E5A12E]"
                aria-label={`평균 평점 ${initialSummary.averageRating.toFixed(
                    1
                )}점`}
                >
                ★★★★★
                </div>

                <p className="mt-2 text-xs text-[#8A9BB0]">
                후기 {initialSummary.totalReviewCount}개
                </p>
            </div>

            <div>
                {[5, 4, 3, 2, 1].map(
                (rating, index) => {
                    const rate = Math.min(
                    Math.max(rates[index] ?? 0, 0),
                    100
                    );

                    return (
                    <div
                        key={rating}
                        className="mb-2 flex items-center gap-3 text-xs"
                    >
                        <span className="w-8 text-[#667085]">
                        {rating}점
                        </span>

                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#EEF2F6]">
                        <div
                            className="h-full rounded-full bg-[#E5A12E]"
                            style={{
                            width: `${rate}%`,
                            }}
                        />
                        </div>

                        <span className="w-10 text-right text-[#98A2B3]">
                        {rate}%
                        </span>
                    </div>
                    );
                }
                )}
            </div>
            </section>

            {/* 후기 목록 */}
            <section className="mt-4 space-y-3">
            {initialReviews.length === 0 ? (
                <div className="rounded-[20px] bg-white px-6 py-12 text-center text-sm text-[#8A9BB0] shadow-sm">
                아직 작성된 수강 후기가 없습니다.
                </div>
            ) : (
                initialReviews.map((review) => {
                const rating = Math.min(
                    Math.max(review.rating, 0),
                    5
                );

                return (
                    <article
                    key={review.reviewId}
                    className="rounded-[18px] bg-white px-6 py-5 shadow-sm"
                    >
                    <div className="flex items-start justify-between gap-4">
                        <div>
                        <strong className="text-sm text-[#243247]">
                            수강생
                        </strong>

                        <div
                            className="mt-1 text-sm"
                            aria-label={`평점 ${rating}점`}
                        >
                            <span className="text-[#E5A12E]">
                            {"★".repeat(rating)}
                            </span>

                            <span className="text-[#E5EAF0]">
                            {"★".repeat(5 - rating)}
                            </span>
                        </div>
                        </div>

                        <time
                        dateTime={review.createdAt}
                        className="text-xs text-[#98A2B3]"
                        >
                        {new Date(
                            review.createdAt
                        ).toLocaleDateString("ko-KR")}
                        </time>
                    </div>

                    <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-[#475467]">
                        {review.content}
                    </p>
                    </article>
                );
                })
            )}
            </section>
        </div>
        </main>
    );
}