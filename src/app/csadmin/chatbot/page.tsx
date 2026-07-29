import type { Metadata } from "next";
import ChatbotManageClient from "@/features/csadmin/chatbot/components/ChatbotManageClient";

export const metadata: Metadata = {
  title: "챗봇 예상 질문 관리 | 알고가 CS 관리자",
  description:
    "사용자 챗봇에 노출되는 예상 질문과 답변을 관리하는 CS 관리자 화면입니다.",
};

export default function CsChatbotPage() {
  return <ChatbotManageClient />;
}
