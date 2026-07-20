// 챗봇 & 1:1 문의 (사용자 파트) 타입 — API 계약서 기준

export type ChatbotMode = "NORMAL" | "REJECTED" | "AGENT_HANDOFF" | "RATE_LIMITED";

export type HistoryType = "CHATBOT" | "INQUIRY";

// CHATBOT: COMPLETED | FILTERED / INQUIRY: PENDING | ANSWERED
export type HistoryStatus = "COMPLETED" | "FILTERED" | "PENDING" | "ANSWERED";

export type InquiryCategory = "RESERVATION" | "REFUND" | "COURSE" | "ETC";

export type InquiryStatus = "PENDING" | "ANSWERED";

export const INQUIRY_CATEGORY_LABEL: Record<InquiryCategory, string> = {
  RESERVATION: "예약",
  REFUND: "환불",
  COURSE: "강의",
  ETC: "기타",
};

// 2-5 ChatbotAnswerResponse — UI 분기의 핵심
export type ChatbotAnswerResponse = {
  answer: string;
  isSuccess: boolean;
  mode: ChatbotMode;
  handoffSummary: string | null; // AGENT_HANDOFF일 때만
  handoffInquiry: string | null; // AGENT_HANDOFF일 때만
};

// 직접 질문(ask)은 429 Retry-After까지 다루기 위해 확장 결과를 사용
export type ChatbotAskResult = ChatbotAnswerResponse & {
  retryAfterSeconds?: number;
};

// 2-2 예상 질문 (사용자용은 question만)
export type SuggestedQuestion = {
  suggestedQuestionId: number;
  question: string;
};

// 2-1 통합 히스토리 항목
export type UnifiedChatHistoryItem = {
  id: string; // "CHAT_{id}" | "INQ_{id}"
  type: HistoryType;
  question: string;
  answer: string | null;
  status: HistoryStatus;
  createdAt: string;
  isAnswerUnread: boolean; // INQUIRY + 답변 미확인일 때만 true
};

export type ChatHistoryPage = {
  content: UnifiedChatHistoryItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

// 3-1 문의 카테고리 (셀렉트: code 전송 / description 표시)
export type InquiryCategoryOption = {
  code: InquiryCategory;
  description: string;
};

// 3-2 문의 등록
export type CreateInquiryPayload = {
  category: InquiryCategory;
  title: string;
  content: string;
};
