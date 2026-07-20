import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ChatbotQuestionFormClient from "@/features/csadmin/chatbot/components/ChatbotQuestionFormClient";

type ChatbotQuestionEditPageProps = {
  params: Promise<{
    questionid: string;
  }>;
};

export const metadata: Metadata = {
  title: "예상 질문 수정 | 알고가 CS 관리자",
  description: "등록된 챗봇 예상 질문과 답변을 수정합니다.",
};

export default async function ChatbotQuestionEditPage({
  params,
}: ChatbotQuestionEditPageProps) {
  const { questionid } = await params;

  if (!/^\d+$/.test(questionid)) {
    notFound();
  }

  const questionId = Number(questionid);

  if (!Number.isSafeInteger(questionId) || questionId <= 0) {
    notFound();
  }

  return <ChatbotQuestionFormClient mode="edit" questionId={questionId} />;
}
