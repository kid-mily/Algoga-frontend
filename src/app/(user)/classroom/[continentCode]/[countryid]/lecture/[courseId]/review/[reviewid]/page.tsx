import { notFound } from "next/navigation";
import SubHeader from "@/features/common/components/SubHeader";
import { getCourseReviews } from "@/features/services/courseReview.service";
import { getCourseDetail } from "@/features/services/lectureDetail.service";

export const revalidate = 1800;

interface ReviewDetailPageProps {
  params: Promise<{
    continentCode: string;
    countryid: string;
    courseId: string;
    reviewid: string;
  }>;
}

const clampRating = (rating: number) => {
  return Math.min(Math.max(Math.round(rating), 0), 5);
};

export default async function ReviewDetailPage({
  params,
}: ReviewDetailPageProps) {
  const { continentCode, countryid, courseId, reviewid } = await params;

  const [course, reviews] = await Promise.all([
    getCourseDetail(countryid, courseId),
    getCourseReviews(courseId),
  ]);

  if (!course) {
    notFound();
  }

  const review = reviews.find(
    (item) => String(item.reviewId) === String(reviewid)
  );

  if (!review) {
    notFound();
  }

  const rating = clampRating(review.rating);

  return (
    <main className="min-h-screen bg-[#F3F8FC] px-4 py-8">
      <section className="mx-auto max-w-4xl space-y-6">
        <SubHeader
          backHref={`/classroom/${continentCode}/${countryid}/lecture/${courseId}/review`}
          backText="후기 목록으로 돌아가기"
          title="수강 후기"
          description={course.title}
        />

        <article className="rounded-2xl border border-[#E1E8EF] bg-white p-7 shadow-[0_8px_24px_rgba(55,88,110,0.07)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#0A1628]">
                {review.nickname || "익명"}
              </p>

              <div
                className="mt-1 text-sm"
                aria-label={`평점 ${rating}점`}
              >
                <span className="text-[#E5A12E]">{"★".repeat(rating)}</span>
                <span className="text-[#E5EAF0]">
                  {"★".repeat(5 - rating)}
                </span>
              </div>
            </div>

            <time
              dateTime={review.createdAt}
              className="text-xs text-[#98A2B3]"
            >
              {new Date(review.createdAt).toLocaleDateString("ko-KR")}
            </time>
          </div>

          <p className="mt-6 whitespace-pre-wrap break-words text-sm leading-7 text-[#475467]">
            {review.content}
          </p>
        </article>
      </section>
    </main>
  );
}
