import type { Metadata } from "next";
import AdminQnaAnswerClient from "@/features/contentmanage/qna/components/AdminQnaAnswerClient";

interface EditQnaPageProps {
  params: Promise<{
    qnaid: string;
  }>;
  searchParams: Promise<{
    courseId?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Q&A 답변 상세 | 알고가 관리자",
  description: "학생 Q&A 답변 상세 내용을 확인합니다.",
};

export default async function EditQnaPage({
  params,
  searchParams,
}: EditQnaPageProps) {
  const { qnaid } = await params;
  const { courseId = "" } = await searchParams;

  return (
    <AdminQnaAnswerClient
      courseId={courseId}
      qnaId={qnaid}
      mode="detail"
    />
  );
}
