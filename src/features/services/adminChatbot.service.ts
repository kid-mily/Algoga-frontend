import { adminApi, ApiRequestError, ApiResult, unwrapData } from "@/lib/api";
import type {
  SuggestedQuestionAdminResponse,
  SuggestedQuestionPayload,
} from "@/features/csadmin/chatbot/types";

const BASE_PATH = "/api/v1/admin/chatbot/suggested-questions";

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
