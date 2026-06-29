import { notFound } from "next/navigation";
import CourseReviewsClient from "@/features/classroom/review/CourseReviewsClient";
import {
  getCourseReviews,
  getCourseReviewSummary,
} from "@/features/services/courseReview.service";
import { getCourseDetail } from "@/features/services/lectureDetail.service";

export const revalidate = 1800;

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

  const [course, reviews, summary] = await Promise.all([
    getCourseDetail(countryid, courseId),
    getCourseReviews(courseId),
    getCourseReviewSummary(courseId),
  ]);

  if (!course) {
    notFound();
  }

  return (
    <CourseReviewsClient
      courseTitle={course.title}
      initialReviews={reviews}
      initialSummary={
        summary ?? {
          ...EMPTY_REVIEW_SUMMARY,
          courseId: Number(courseId) || 0,
        }
      }
    />
  );
}
