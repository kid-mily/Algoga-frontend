import { api, ApiResponse } from "@/lib/api";
import type { CourseQuiz, CourseQuizAnswer, CourseQuizSavedResult, CourseQuizSubmitResult } from "@/features/classroom/quiz/types";

export const getCourseQuizzes = async (
  courseId: string | number
): Promise<CourseQuiz[]> => {
  const response = await api.get<ApiResponse<CourseQuiz[]>>(
    `/api/v1/courses/${courseId}/quiz`,
    {
      cache: "no-store",
      suppressGlobalError: true,
    }
  );

  return response.data ?? [];
};

export const submitCourseQuiz = async (
  courseId: string | number,
  answers: CourseQuizAnswer[]
): Promise<CourseQuizSubmitResult> => {
  const response =
    await api.post<ApiResponse<CourseQuizSubmitResult>>(
      `/api/v1/courses/${courseId}/quiz/submit`,
      { answers },
      { suppressGlobalError: true }
    );

  return response.data;
};

// DB에 저장된 내 퀴즈 결과 조회
export const getCourseQuizResult = async (
  courseId: string | number
): Promise<CourseQuizSavedResult> => {
  const response =
    await api.get<ApiResponse<{
      submissionId: number;
      courseId: number;
      totalCount: number;
      correctCount: number;
      score: number;
      submittedAt: string;
    }>>(
      `/api/v1/courses/${courseId}/quiz/result`,
      {
        cache: "no-store",
        suppressGlobalError: true,
      }
    );

  return {
    ...response.data,
    userId: 0,
    wrongAnswers: [],
    answers: [],
  };
};
