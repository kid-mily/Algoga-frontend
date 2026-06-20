import { notFound } from "next/navigation";
import CourseReviewsClient from "@/features/classroom/review/CourseReviewsClient";
import { getCourseReviews, getCourseReviewSummary } from "@/features/services/courseReview.service";
import { getCourseDetail } from "@/features/services/lectureDetail.service";

export const revalidate = 300;

interface ReviewPageProps {
  params: Promise<{
    countryid: string;
    courseId: string;
  }>;
}

export default async function ReviewPage({
  params,
}: ReviewPageProps) {
  const { countryid, courseId } = await params;

  const [course, reviews, summary] =
    await Promise.all([
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
      initialSummary={summary}
    />
  );
}