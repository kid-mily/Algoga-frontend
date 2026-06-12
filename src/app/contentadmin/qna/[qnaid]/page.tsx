import type { Metadata } from "next";
import AdminQnaAnswerClient from "@/features/contentmanage/qna/components/AdminQnaAnswerClient";

interface AnswerQnaPageProps {
  params: {
    qnaid: string;
  };
  searchParams: {
    courseId?: string;
  };
}

export const metadata: Metadata = {
  title: "Q&A 답변 작성 | 알고가 관리자",
  description: "학생 Q&A에 답변을 작성합니다.",
};

export default function AnswerQnaPage({
  params,
  searchParams,
}: AnswerQnaPageProps) {
  return (
    <AdminQnaAnswerClient
      courseId={searchParams.courseId || ""}
      qnaId={params.qnaid}
      mode="answer"
    />
  );
}
