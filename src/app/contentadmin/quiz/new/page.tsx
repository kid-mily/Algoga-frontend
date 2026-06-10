import type { Metadata } from "next";
import CreateQuizClient from "@/features/contentmanage/quiz/components/CreateQuizClient";

export const metadata: Metadata = {
  title: "퀴즈 등록 | 콘텐츠 관리자",
  description: "강의에 연결할 새 퀴즈를 등록하는 콘텐츠 관리자 화면입니다.",
};

export default function CreateQuizPage() {
  return <CreateQuizClient />;
}
