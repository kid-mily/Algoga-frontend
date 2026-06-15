import { api, ApiResponse } from "@/lib/api";
import type {
  DiagnosisLevel,
  DiagnosisQuestion,
  DiagnosisRecommendedCourse,
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
  ].filter(Boolean),
});

// 진단평가 문제 목록 조회
export const getDiagnosisQuestions = async (
  countryId: string | number
): Promise<EvaluationFormQuestion[]> => {
  try {
    const response = await api.get<ApiResponse<DiagnosisQuestion[]>>(
      "/api/v1/diagnosis/questions",
      {
        params: {
          countryId,
        },
        next: {
          revalidate: 1800,
        },
        skipAuth: true,
      }
    );

    return response.data
      .slice()
      .sort((a, b) => a.questionOrder - b.questionOrder)
      .map(toEvaluationFormQuestion);
  } catch (error) {
    console.error("진단평가 문제 목록을 불러오는데 실패했습니다:", error);
    return [];
  }
};

// 진단평가 결과 제출
export const submitDiagnosisResult = async (
  payload: DiagnosisResultRequest
): Promise<DiagnosisResult> => {
  const response = await api.post<ApiResponse<DiagnosisResult>>(
    "/api/v1/diagnosis/result",
    payload,
    {
      skipAuth: true,
      suppressGlobalError: true,
    }
  );

  return response.data;
};

// 진단평가 추천 강의 조회
export const getDiagnosisRecommendations = async (
  countryId: string | number,
  level: DiagnosisLevel
): Promise<DiagnosisRecommendedCourse[]> => {
  try {
    const response = await api.get<ApiResponse<DiagnosisRecommendedCourse[]>>(
      "/api/v1/diagnosis/recommendations",
      {
        params: {
          countryId,
          level,
        },
        next: {
          revalidate: 1800,
        },
        skipAuth: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("추천 강의 목록을 불러오는데 실패했습니다:", error);
    return [];
  }
};