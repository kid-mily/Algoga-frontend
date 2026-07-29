import { api, ApiResponse } from "@/lib/api";
import type {
  CourseQuiz,
  CourseQuizAnswer,
  CourseQuizSavedResult,
  CourseQuizSubmitResult,
} from "@/features/classroom/quiz/types";

export const getCourseQuizzes = async (
  courseId: string | number,
  signal?: AbortSignal,
  headers?: HeadersInit
): Promise<CourseQuiz[]> => {
  const response = await api.get<ApiResponse<CourseQuiz[]>>(
    `/api/v1/courses/${courseId}/quiz`,
    {
      cache: "no-store",
      signal,
      headers,
      suppressGlobalError: true,
    }
  );

  return response.data ?? [];
};

export const submitCourseQuiz = async (
  courseId: string | number,
  answers: CourseQuizAnswer[]
): Promise<CourseQuizSubmitResult> => {
  const response = await api.post<ApiResponse<CourseQuizSubmitResult>>(
    `/api/v1/courses/${courseId}/quiz/submit`,
    { answers },
    { suppressGlobalError: true }
  );

  return {
    ...response.data,
    wrongAnswers: response.data.wrongAnswers ?? [],
    completion: response.data.completion ?? null,
    courseCompleted: response.data.courseCompleted ?? false,
  };
};

export const getCourseQuizResult = async (
  courseId: string | number,
  signal?: AbortSignal,
  headers?: HeadersInit
): Promise<CourseQuizSavedResult> => {
  const response = await api.get<ApiResponse<CourseQuizSavedResult>>(
    `/api/v1/courses/${courseId}/quiz/result`,
    {
      cache: "no-store",
      signal,
      headers,
      suppressGlobalError: true,
    }
  );

  return {
    ...response.data,
    answers: response.data.answers ?? [],
  };
};