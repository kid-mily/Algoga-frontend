import type { Metadata } from "next";
import EditQuizClient from "@/features/contentmanage/quiz/components/EditQuizClient";

type EditQuizPageProps = {
  params: Promise<{ quizid: string }>;
  searchParams: Promise<{ courseId?: string }>;
};

export const metadata: Metadata = {
  title: "퀴즈 수정 | 콘텐츠 관리자",
  description: "등록된 퀴즈의 문제, 보기, 정답, 해설을 수정하는 콘텐츠 관리자 화면입니다.",
};

export default async function EditQuizPage({
  params,
  searchParams,
}: EditQuizPageProps) {
  const { quizid } = await params;
  const { courseId } = await searchParams;

  return (
    <EditQuizClient
      quizId={Number(quizid)}
      courseId={Number(courseId)}
    />
  );
}
