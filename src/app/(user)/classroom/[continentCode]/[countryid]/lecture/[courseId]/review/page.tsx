import { notFound } from "next/navigation";
import CourseReviewsClient from "@/features/classroom/review/CourseReviewsClient";
import {
  getCourseReviews,
  getCourseReviewSummary,
} from "@/features/services/courseReview.service";
import { getCourseDetail } from "@/features/services/lectureDetail.service";

interface ReviewPageProps {
  params: Promise<{
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

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { countryid, courseId } = await params;

  let course: Awaited<ReturnType<typeof getCourseDetail>> | null = null;

  try {
    course = await getCourseDetail(countryid, courseId);
  } catch (error) {
    console.error("[review-page] 강의 상세 조회 실패:", error);
    notFound();
  }

  if (!course) {
    notFound();
  }

  const [reviews, summary] = await Promise.all([
    getCourseReviews(courseId).catch((error) => {
      console.error("[review-page] 후기 목록 조회 실패:", error);
      return [];
    }),
    getCourseReviewSummary(courseId).catch((error) => {
      console.error("[review-page] 후기 요약 조회 실패:", error);

      return {
        ...EMPTY_REVIEW_SUMMARY,
        courseId: Number(courseId) || 0,
      };
    }),
  ]);

  return (
    <CourseReviewsClient
      courseTitle={course.title}
      initialReviews={reviews}
      initialSummary={summary}
    />
  );
}