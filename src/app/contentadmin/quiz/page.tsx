import type { Metadata } from "next";
import QuizManageClient from "@/features/contentmanage/quiz/components/QuizManageClient";

export const metadata: Metadata = {
  title: "퀴즈 관리 | 콘텐츠 관리자",
  description: "강의별 퀴즈를 등록, 검색, 수정, 삭제하는 콘텐츠 관리자 화면입니다.",
};

type QuizPageProps = {
  searchParams: Promise<{
    courseId?: string;
  }>;
};

export default async function QuizPage({ searchParams }: QuizPageProps) {
  const { courseId } = await searchParams;

  return <QuizManageClient initialCourseId={courseId || "all"} />;
}
