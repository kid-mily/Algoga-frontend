import type { Metadata } from "next";
import AdminQnaManageClient from "@/features/contentmanage/qna/components/AdminQnaManageClient";

export const metadata: Metadata = {
  title: "Q&A 관리 | 알고가 관리자",
  description: "강의별 학생 Q&A를 조회하고 답변합니다.",
};

export default function QnaPage() {
  return <AdminQnaManageClient />;
}
