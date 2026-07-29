import type { Metadata } from "next";
import ChatbotQuestionFormClient from "@/features/csadmin/chatbot/components/ChatbotQuestionFormClient";

export const metadata: Metadata = {
  title: "예상 질문 등록 | 알고가 CS 관리자",
  description: "챗봇에 노출될 예상 질문과 답변을 등록합니다.",
};

export default function ChatbotQuestionCreatePage() {
  return <ChatbotQuestionFormClient mode="create" />;
}
