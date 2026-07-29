import {
  api,
  type ApiResult,
  unwrapData,
} from "@/lib/api";
import type {
  DiagnosisQuestion,
  DiagnosisResult,
  DiagnosisResultRequest,
  EvaluationFormQuestion,
} from "@/features/classroom/evaluation/types";

const toEvaluationFormQuestion = (
  question: DiagnosisQuestion
): EvaluationFormQuestion => ({
  ...question,
  options: [
    question.option1,
    question.option2,
    question.option3,
    question.option4,
  ],
});

export const getDiagnosisQuestions = async (
  countryId: string | number,
  signal?: AbortSignal,
  headers?: HeadersInit
): Promise<EvaluationFormQuestion[]> => {
  const numericCountryId = Number(countryId);

  if (
    !Number.isInteger(numericCountryId) ||
    numericCountryId <= 0
  ) {
    throw new Error("국가 번호가 올바르지 않습니다.");
  }

  const response = await api.get<
    ApiResult<DiagnosisQuestion[]>
  >("/api/v1/diagnosis/questions", {
    params: {
      countryId: numericCountryId,
    },
    cache: "no-store",
    signal,
    headers,
    suppressGlobalError: true,

    // 제거해야 합니다.
    // skipAuth: true,
  });

  const questions = unwrapData(response) ?? [];

  return [...questions]
    .sort(
      (first, second) =>
        first.questionOrder -
        second.questionOrder
    )
    .map(toEvaluationFormQuestion);
};

export const submitDiagnosisResult = async (
  payload: DiagnosisResultRequest
): Promise<DiagnosisResult> => {
  const response = await api.post<
    ApiResult<DiagnosisResult>
  >(
    "/api/v1/diagnosis/result",
    payload,
    {
      suppressGlobalError: true,
    }
  );

  return unwrapData(response);
};