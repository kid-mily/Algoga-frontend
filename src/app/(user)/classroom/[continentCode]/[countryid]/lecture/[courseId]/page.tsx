// 강의 홈 화면

import { notFound } from "next/navigation";
import SubHeader from "@/features/contentmanage/common/SubHeader";
import LectureActionCard from "@/features/classroom/components/LectureActionCard";
import LectureAttachments from "@/features/classroom/components/LectureAttachments";
import LectureReviews from "@/features/classroom/components/LectureReviews";
import {
  getCourseDetail,
  getCourseReviewSummary,
} from "@/features/services/lectureDetail.service";

export const revalidate = 1800;

interface LectureDetailPageProps {
  params: Promise<{
    continentCode: string;
    countryid: string;
    courseId: string;
  }>;
}

export default async function LectureDetailPage({
  params,
}: LectureDetailPageProps) {
  const { continentCode, countryid, courseId } = await params;

  const [course, reviewSummary] = await Promise.all([
    getCourseDetail(countryid, courseId),
    getCourseReviewSummary(courseId),
  ]);

  if (!course) {
    notFound();
  }

  return (
    <main className="min-h-screen w-full bg-[#f5f6f8] p-10">
      <section className="mx-auto w-full max-w-4xl space-y-6 px-4 pt-4">
        <SubHeader
          backHref={`/classroom/${continentCode}/${countryid}`}
          backText="강의 목록으로 돌아가기"
          title={course.title}
          description={course.description || "여행에 필요한 내용을 배워보세요"}
        />

        <LectureActionCard
          course={course}
          continentCode={continentCode}
          countryId={countryid}
          courseId={courseId}
        />

        <LectureAttachments fileUrls={course.fileUrls} />

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