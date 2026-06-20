import { notFound } from "next/navigation";
import QuizClient from "@/features/classroom/quiz/components/QuizClient";
import { getCourseDetail } from "@/features/services/lectureDetail.service";

// 공개 강의 제목과 퀴즈 설명은 30분마다 갱신합니다.
export const revalidate = 1800;

interface QuizPageProps {
  params: Promise<{
    continentCode: string;
    countryid: string;
    courseId: string;
  }>;
}

export default async function QuizPage({
  params,
}: QuizPageProps) {
  const { countryid, courseId } = await params;

  // 공개 강의 정보만 ISR로 조회합니다.
  // 개인 진도와 퀴즈 답안은 QuizClient에서 CSR로 처리합니다.
  const course = await getCourseDetail(countryid, courseId);

  if (!course) {
    notFound();
  }

  return (
    <QuizClient
      initialCourseTitle={course.title}
      description="학습 내용을 바탕으로 출제된 모든 문제에 답해 주세요."
    />
  );
}