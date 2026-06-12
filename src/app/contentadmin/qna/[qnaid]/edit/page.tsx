import type { Metadata } from "next";
import AdminQnaAnswerClient from "@/features/contentmanage/qna/components/AdminQnaAnswerClient";

interface EditQnaPageProps {
  params: {
    qnaid: string;
  };
  searchParams: {
    courseId?: string;
  };
}

export const metadata: Metadata = {
  title: "Q&A 답변 상세 | 알고가 관리자",
  description: "학생 Q&A 답변 상세 내용을 확인합니다.",
};

export default function EditQnaPage({ params, searchParams }: EditQnaPageProps) {
  return (
    <AdminQnaAnswerClient
      courseId={searchParams.courseId || ""}
      qnaId={params.qnaid}
      mode="detail"
    />
  );
}
