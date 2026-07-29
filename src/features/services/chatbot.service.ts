import { api, ApiResponse, unwrapData } from "@/lib/api";
import type {
  ChatbotAnswerResponse,
  ChatbotAskResult,
  ChatHistoryPage,
  SuggestedQuestion,
} from "@/features/chatbot/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class ChatbotApiError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "ChatbotApiError";
    this.status = status;
    this.code = code;
  }
}

// 2-1. 챗봇 대화 + 1:1 문의 통합 내역 (page=0이 최신)
export const getChatbotHistory = async (
  page = 0,
  size = 20,
  signal?: AbortSignal
): Promise<ChatHistoryPage> => {
  const response = await api.get<ApiResponse<ChatHistoryPage>>(
    "/api/v1/chatbot/history",
    {
      params: { page, size },
      cache: "no-store",
      suppressGlobalError: true,
      signal,
    }
  );

  return unwrapData(response);
};

// 2-2. 예상 질문 버튼 목록 (사용자용은 question만 내려옴)
export const getSuggestedQuestions = async (
  signal?: AbortSignal
): Promise<SuggestedQuestion[]> => {
  const response = await api.get<ApiResponse<SuggestedQuestion[]>>(
    "/api/v1/chatbot/suggested-questions",
    {
      cache: "no-store",
      suppressGlobalError: true,
      signal,
    }
  );

  return unwrapData(response) ?? [];
};

// 2-3. 예상 질문 클릭 → 저장된 답변 (항상 NORMAL)
export const askSuggestedQuestion = async (
  suggestedQuestionId: number,
  signal?: AbortSignal
): Promise<ChatbotAnswerResponse> => {
  const response = await api.post<ApiResponse<ChatbotAnswerResponse>>(
    "/api/v1/chatbot/suggested-questions/ask",
    { suggestedQuestionId },
    { suppressGlobalError: true, signal }
  );

  return unwrapData(response);
};

// 2-4. 직접 질문. 레이트리밋(429)이어도 본문은 ApiResponse 봉투(data.mode=RATE_LIMITED)로 오고,
// 성공/실패는 HTTP 코드가 아니라 data.mode/isSuccess로 판단해야 한다.
// Retry-After 헤더를 읽어야 해서 공통 클라이언트 대신 fetch를 직접 사용한다.
export const askChatbot = async (
  question: string,
  signal?: AbortSignal
): Promise<ChatbotAskResult> => {
  if (!BASE_URL) {
    throw new ChatbotApiError("NEXT_PUBLIC_API_URL이 설정되어 있지 않습니다.");
  }

  const response = await fetch(`${BASE_URL}/api/v1/chatbot/ask`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ question }),
    signal,
  });

  const payload = await response.json().catch(() => null);
  const data =
    payload && typeof payload === "object" && "data" in payload
      ? (payload as ApiResponse<ChatbotAnswerResponse>).data
      : null;

  // NORMAL / REJECTED / AGENT_HANDOFF / RATE_LIMITED 는 모두 data.mode를 가진 봉투로 온다.
  if (data && typeof data === "object" && "mode" in data) {
    if (data.mode === "RATE_LIMITED") {
      const retryAfter = Number(response.headers.get("Retry-After"));
      return {
        ...data,
        retryAfterSeconds: Number.isFinite(retryAfter) ? retryAfter : undefined,
      };
    }

    return data;
  }

  // 그 외(일일 한도 초과 CHAT_001, 미인증 401 등)는 ErrorResponse → 에러로 처리
  const errorCode =
    payload && typeof payload === "object" && "errorCode" in payload
      ? (payload as { errorCode?: string }).errorCode
      : undefined;
  const message =
    (payload && typeof payload === "object" && "message" in payload
      ? (payload as { message?: string }).message
      : undefined) || "챗봇 답변에 실패했습니다.";

  throw new ChatbotApiError(message, response.status, errorCode);
};
