import { api, ApiResponse, unwrapData } from "@/lib/api";
import type {
  CreateInquiryPayload,
  InquiryCategoryOption,
} from "@/features/chatbot/types";

// 3-1. 문의 카테고리 (셀렉트: code 전송 / description 표시)
export const getInquiryCategories = async (
  signal?: AbortSignal
): Promise<InquiryCategoryOption[]> => {
  const response = await api.get<ApiResponse<InquiryCategoryOption[]>>(
    "/api/v1/inquiries/categories",
    {
      cache: "no-store",
      suppressGlobalError: true,
      signal,
    }
  );

  return unwrapData(response) ?? [];
};

// 3-2. 문의 등록 (title 2자 이상, content 5자 이상 — 프론트 선검증 권장)
export const createInquiry = async (
  payload: CreateInquiryPayload
): Promise<void> => {
  await api.post<ApiResponse<null>>("/api/v1/inquiries", payload, {
    suppressGlobalError: true,
  });
};

// 3-3. 문의 답변 확인 처리 (챗봇 "답변 완료" 뱃지 해제)
export const markInquiryAnswerRead = async (
  inquiryId: number
): Promise<void> => {
  await api.patch<ApiResponse<null>>(
    `/api/v1/inquiries/${inquiryId}/answer/read`,
    undefined,
    { suppressGlobalError: true }
  );
};
