import {
  api,
  ApiRequestError,
  ApiResult,
  unwrapData,
} from "@/lib/api";
import { DiagnosisResult } from "../types";

interface FindLatestDiagnosisResultParams {
  countryId: string;
  resultId?: string | null;
}

// 현재 로그인한 사용자의 나라별 최신 진단평가 결과 목록 조회
export const getMyLatestDiagnosisResults = async (): Promise<
  DiagnosisResult[]
> => {
  try {
    const response = await api.get<ApiResult<DiagnosisResult[]>>(
      "/api/v1/diagnosis/me/latest",
      {
        cache: "no-store",
        suppressGlobalError: true,
      }
    );

    return unwrapData(response) ?? [];
  } catch (error) {
    // 아직 진단평가 결과가 없는 사용자는 빈 배열로 처리
    if (error instanceof ApiRequestError && error.status === 404) {
      return [];
    }

    throw error;
  }
};

// 결과 페이지에서 보여줄 진단평가 결과 선택
export const findLatestDiagnosisResult = async ({
  countryId,
  resultId,
}: FindLatestDiagnosisResultParams): Promise<DiagnosisResult | null> => {
  const numericCountryId = Number(countryId);
  const numericResultId = resultId ? Number(resultId) : null;

  const results = await getMyLatestDiagnosisResults();

  // 제출 직후 이동한 경우 resultId가 있으므로 해당 결과를 우선 사용
  if (numericResultId && Number.isInteger(numericResultId)) {
    const matchedResult = results.find(
      (result) => result.resultId === numericResultId
    );

    if (matchedResult) {
      return matchedResult;
    }
  }

  // resultId가 없거나 못 찾으면 현재 countryId의 최신 결과 사용
  const countryResults = results
    .filter((result) => result.countryId === numericCountryId)
    .sort(
      (first, second) =>
        new Date(second.submittedAt).getTime() -
        new Date(first.submittedAt).getTime()
    );

  return countryResults[0] ?? null;
};