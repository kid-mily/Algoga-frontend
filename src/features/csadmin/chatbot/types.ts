// 관리자 예상 질문 UI 모델. id = suggestedQuestionId.
// 서버가 createdAt/updatedAt를 주지 않으므로 화면에서도 표시하지 않는다.
export type ChatbotQuestion = {
  id: number;
  question: string;
  answer: string;
};

// 관리자 API 응답 DTO (§5). 사용자용(question만)과 달리 answer까지 내려온다.
export type SuggestedQuestionAdminResponse = {
  suggestedQuestionId: number;
  question: string;
  answer: string;
};

// 관리자 API 요청 body (등록/수정 공통)
export type SuggestedQuestionPayload = {
  question: string;
  answer: string;
};

// 예상 질문 등록/수정 폼 데이터
export type ChatbotQuestionFormData = {
  question: string;
  answer: string;
};

// 공통 페이지 응답 (챗봇 관리자 로그/RAG)
export type ChatbotPage<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

// ① 챗봇 대화 로그
export type AdminChatLog = {
  chatLogId: number;
  userId: number;
  userName: string | null;
  userNickname: string | null;
  question: string;
  answer: string;
  filtered: boolean;
  createdAt: string;
};

// ② 규정 문서/페이지별 RAG 채택 빈도
export type RagSourceStat = {
  source: string;
  page: number | null;
  count: number;
};
