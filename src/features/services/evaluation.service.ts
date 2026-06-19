import { api, ApiResponse } from "@/lib/api";
import { getCookie } from "@/lib/cookie";
import type {
  DiagnosisLevel,
  DiagnosisQuestion,
  DiagnosisRecommendedCourse,
  DiagnosisResult,
  DiagnosisResultRequest,
  EvaluationFormQuestion,
} from "@/features/classroom/evaluation/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://kidmily.kro.kr";

interface DiagnosisSubmitErrorResponse {
  timestamp?: string;
  status?: number;
  errorCode?: string;
  message?: string;
  traceId?: string;
}

export class DiagnosisSubmitError extends Error {
  status?: number;
  errorCode?: string;
  traceId?: string;
  data?: DiagnosisSubmitErrorResponse;

  constructor(errorData: DiagnosisSubmitErrorResponse) {
    super(errorData.message || "진단평가 결과 제출에 실패했습니다.");

    this.name = "DiagnosisSubmitError";
    this.status = errorData.status;
    this.errorCode = errorData.errorCode;
    this.traceId = errorData.traceId;
    this.data = errorData;
  }
}

const toEvaluationFormQuestion = (
  question: DiagnosisQuestion
): EvaluationFormQuestion => ({
  ...question,
  options: [
    question.option1,
    question.option2,
    question.option3,
    question.option4,
  ].filter(Boolean),
});

export const getDiagnosisQuestions = async (
  countryId: string | number
): Promise<EvaluationFormQuestion[]> => {
  try {
    const response = await api.get<ApiResponse<DiagnosisQuestion[]>>(
      "/api/v1/diagnosis/questions",
      {
        params: { countryId },
        next: { revalidate: 1800 },
        skipAuth: true,
      }
    );

    return response.data
      .slice()
      .sort((a, b) => a.questionOrder - b.questionOrder)
      .map(toEvaluationFormQuestion);
  } catch (error) {
    console.error("진단평가 문제 목록을 불러오지 못했습니다.", error);
    return [];
  }
};

export const submitDiagnosisResult = async (
  payload: DiagnosisResultRequest
): Promise<DiagnosisResult> => {
  const response = await fetch(`${BASE_URL}/api/v1/diagnosis/result`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responseBody = await response.json().catch(() => null);

  if (!response.ok) {
    const errorData: DiagnosisSubmitErrorResponse = responseBody || {
      status: response.status,
      message: response.statusText,
    };

    throw new DiagnosisSubmitError(errorData);
  }

  return responseBody.data;
};

export const getDiagnosisRecommendations = async (
  countryId: string | number,
  level: DiagnosisLevel
): Promise<DiagnosisRecommendedCourse[]> => {
  try {
    const response = await api.get<ApiResponse<DiagnosisRecommendedCourse[]>>(
      "/api/v1/diagnosis/recommendations",
      {
        params: { countryId, level },
        next: { revalidate: 1800 },
        skipAuth: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("추천 강의 목록을 불러오지 못했습니다.", error);
    return [];
  }
};