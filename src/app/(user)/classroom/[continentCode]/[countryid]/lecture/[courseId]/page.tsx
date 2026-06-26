import { notFound } from "next/navigation";
import SubHeader from "@/features/common/components/SubHeader";
import LectureActionCard from "@/features/classroom/components/LectureActionCard";
import LectureAttachments from "@/features/classroom/components/LectureAttachments";
import LectureReviews from "@/features/classroom/components/LectureReviews";
import {
  getCourseDetail,
  getCourseReviewSummary,
} from "@/features/services/lectureDetail.service";

interface LectureDetailPageProps {
  params: Promise<{
    continentCode: string;
    countryid: string;
    courseId: string;
  }>;
}

const EMPTY_REVIEW_SUMMARY = {
  courseId: 0,
  averageRating: 0,
  totalReviewCount: 0,
  fiveStarCount: 0,
  fourStarCount: 0,
  threeStarCount: 0,
  twoStarCount: 0,
  oneStarCount: 0,
  fiveStarRate: 0,
  fourStarRate: 0,
  threeStarRate: 0,
  twoStarRate: 0,
  oneStarRate: 0,
};

export default async function LectureDetailPage({
  params,
}: LectureDetailPageProps) {
  const { continentCode, countryid, courseId } = await params;

  let course: Awaited<ReturnType<typeof getCourseDetail>> | null = null;

  try {
    course = await getCourseDetail(countryid, courseId);
  } catch (error) {
    console.error("[lecture-detail] 강의 상세 조회 실패:", error);
    notFound();
  }

  if (!course) {
    notFound();
  }

  const reviewSummary = await getCourseReviewSummary(courseId).catch(
    (error) => {
      console.error("[lecture-detail] 후기 요약 조회 실패:", error);

      return {
        ...EMPTY_REVIEW_SUMMARY,
        courseId: Number(courseId) || 0,
      };
    }
  );

  return (
    <main className="min-h-screen w-full bg-[#f5f6f8] p-10">
      <section className="mx-auto w-full max-w-3xl space-y-6 px-2">
        <SubHeader
          backHref={`/classroom/${continentCode}/${countryid}`}
          backText="강의 목록으로 돌아가기"
          title={course.title}
          description={course.description || "여행에 필요한 내용을 배워보세요."}
        />

        <LectureActionCard
          course={course}
          continentCode={continentCode}
          countryId={countryid}
          courseId={courseId}
        />

        <LectureAttachments
          courseId={courseId}
          fileUrls={course.fileUrls ?? []}
        />

        <LectureReviews
          summary={reviewSummary}
          continentCode={continentCode}
          countryId={countryid}
          courseId={courseId}
        />
      </section>
    </main>
  );
}