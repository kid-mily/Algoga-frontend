import { adminApi, ApiRequestError, ApiResult, unwrapData } from "@/lib/api";
import type {
  AdminChatLog,
  ChatbotPage,
  RagSourceStat,
  SuggestedQuestionAdminResponse,
  SuggestedQuestionPayload,
} from "@/features/csadmin/chatbot/types";

const BASE_PATH = "/api/v1/admin/chatbot/suggested-questions";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// 5. 예상 질문 목록 (관리자)
export const getAdminSuggestedQuestions = async (
  signal?: AbortSignal
): Promise<SuggestedQuestionAdminResponse[]> => {
  const response = await adminApi.get<ApiResult<SuggestedQuestionAdminResponse[]>>(
    BASE_PATH,
    { suppressGlobalError: true, signal }
  );
  const data = unwrapData(response);

  return Array.isArray(data) ? data : [];
};

// 5. 예상 질문 단건 (수정 폼 프리필용). 없는 ID는 404 CHAT_005 → null로 변환.
export const getAdminSuggestedQuestionById = async (
  suggestedQuestionId: number,
  signal?: AbortSignal
): Promise<SuggestedQuestionAdminResponse | null> => {
  try {
    const response = await adminApi.get<ApiResult<SuggestedQuestionAdminResponse>>(
      `${BASE_PATH}/${suggestedQuestionId}`,
      { suppressGlobalError: true, signal }
    );

    return unwrapData(response);
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      return null;
    }

    throw error;
  }
};

// 5. 예상 질문 등록
export const createAdminSuggestedQuestion = async (
  payload: SuggestedQuestionPayload
): Promise<void> => {
  await adminApi.post<ApiResult<null>>(BASE_PATH, payload, {
    suppressGlobalError: true,
  });
};

// 5. 예상 질문 수정
export const updateAdminSuggestedQuestion = async (
  suggestedQuestionId: number,
  payload: SuggestedQuestionPayload
): Promise<void> => {
  await adminApi.put<ApiResult<null>>(
    `${BASE_PATH}/${suggestedQuestionId}`,
    payload,
    { suppressGlobalError: true }
  );
};

// 5. 예상 질문 삭제
export const deleteAdminSuggestedQuestion = async (
  suggestedQuestionId: number
): Promise<void> => {
  await adminApi.delete<ApiResult<null>>(`${BASE_PATH}/${suggestedQuestionId}`, {
    suppressGlobalError: true,
  });
};

// ─────────────────────────────────────────────
// 챗봇 운영: 대화 로그 / RAG 채택 빈도
// ─────────────────────────────────────────────

const CHAT_LOGS_PATH = "/api/v1/admin/chatbot/chat-logs";
const RAG_STATS_PATH = "/api/v1/admin/chatbot/rag-source-stats";

// 응답 data가 없거나 형식이 어긋나도 안전하게 빈 페이지로 정규화한다.
const normalizeChatbotPage = <T>(
  data: Partial<ChatbotPage<T>> | null | undefined,
  size: number
): ChatbotPage<T> => ({
  content: Array.isArray(data?.content) ? (data?.content as T[]) : [],
  page: data?.page ?? 0,
  size: data?.size ?? size,
  totalElements: data?.totalElements ?? 0,
  totalPages: Math.max(1, data?.totalPages ?? 1),
  first: data?.first ?? true,
  last: data?.last ?? true,
});

export type ChatLogQuery = {
  filtered?: boolean;
  from?: string;
  to?: string;
  keyword?: string;
  page?: number;
};

export type RagStatQuery = {
  from?: string;
  to?: string;
  page?: number;
};

// 빈 문자열은 파라미터에서 제외한다(백엔드가 "전체"로 처리하도록).
const emptyToUndefined = (value?: string) => {
  const trimmed = value?.trim();

  return trimmed ? trimmed : undefined;
};

// ① 챗봇 대화 로그 (최신순, 20건/페이지)
export const getAdminChatLogs = async (
  query: ChatLogQuery = {},
  signal?: AbortSignal
): Promise<ChatbotPage<AdminChatLog>> => {
  const response = await adminApi.get<ApiResult<ChatbotPage<AdminChatLog>>>(
    CHAT_LOGS_PATH,
    {
      params: {
        filtered: query.filtered,
        from: emptyToUndefined(query.from),
        to: emptyToUndefined(query.to),
        keyword: emptyToUndefined(query.keyword),
        page: query.page ?? 0,
      },
      suppressGlobalError: true,
      signal,
    }
  );

  return normalizeChatbotPage(unwrapData(response), 20);
};

// ② 규정 문서/페이지별 RAG 채택 빈도 (count 내림차순, 20건/페이지)
export const getAdminRagSourceStats = async (
  query: RagStatQuery = {},
  signal?: AbortSignal
): Promise<ChatbotPage<RagSourceStat>> => {
  const response = await adminApi.get<ApiResult<ChatbotPage<RagSourceStat>>>(
    RAG_STATS_PATH,
    {
      params: {
        from: emptyToUndefined(query.from),
        to: emptyToUndefined(query.to),
        page: query.page ?? 0,
      },
      suppressGlobalError: true,
      signal,
    }
  );

  return normalizeChatbotPage(unwrapData(response), 20);
};

// ③ CSV 다운로드 — 인증 쿠키가 필요하고 응답이 파일(text/csv)이라 공통 클라이언트 대신 fetch를 직접 쓴다.
const downloadCsv = async (
  path: string,
  params: Record<string, string | boolean | undefined>,
  fileName: string
) => {
  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL이 설정되어 있지 않습니다.");
  }

  const url = new URL(`${BASE_URL}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url.toString(), { credentials: "include" });

  if (!response.ok) {
    throw new Error("CSV 다운로드에 실패했습니다.");
  }

  const blob = await response.blob();
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(objectUrl);
};

export const downloadChatLogsCsv = (query: ChatLogQuery = {}) =>
  downloadCsv(
    `${CHAT_LOGS_PATH}/export`,
    {
      filtered: query.filtered,
      from: emptyToUndefined(query.from),
      to: emptyToUndefined(query.to),
      keyword: emptyToUndefined(query.keyword),
    },
    "chatbot-chat-logs.csv"
  );

export const downloadRagSourceStatsCsv = (query: RagStatQuery = {}) =>
  downloadCsv(
    `${RAG_STATS_PATH}/export`,
    {
      from: emptyToUndefined(query.from),
      to: emptyToUndefined(query.to),
    },
    "chatbot-rag-source-stats.csv"
  );
