import type { Metadata } from "next";
import AdminQnaAnswerClient from "@/features/contentmanage/qna/components/AdminQnaAnswerClient";

interface AnswerQnaPageProps {
  params: Promise<{
    qnaid: string;
  }>;
  searchParams: Promise<{
    courseId?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Q&A 답변 작성 | 알고가 관리자",
  description: "학생 Q&A에 답변을 작성합니다.",
};

export default async function AnswerQnaPage({
  params,
  searchParams,
}: AnswerQnaPageProps) {
  const { qnaid } = await params;
  const { courseId = "" } = await searchParams;

  return (
    <AdminQnaAnswerClient
      courseId={courseId}
      qnaId={qnaid}
      mode="answer"
    />
  );
}
