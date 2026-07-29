import type { Metadata } from "next";
import ChatbotOperationsClient from "@/features/csadmin/chatbot/components/ChatbotOperationsClient";

export const metadata: Metadata = {
  title: "챗봇 운영 관리 | 알고가 CS 관리자",
  description:
    "챗봇 대화 내역과 답변 근거 문서 활용 현황을 확인하는 CS 관리자 화면입니다.",
};

export default function CsChatbotOperationsPage() {
  return <ChatbotOperationsClient />;
}
