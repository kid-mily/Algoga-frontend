import { api, ApiResponse } from "@/lib/api";

export interface CourseQuiz {
  quizId: number;
  courseId: number;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
}

export interface CourseQuizAnswer {
  quizId: number;
  selectedOption: number;
}

export interface CourseQuizWrongAnswer {
  quizId: number;
  selectedOption: number;
  correctOption: number;
  question?: string;
  explanation?: string;
}

export interface CourseQuizSubmitResult {
  userId: number;
  courseId: number;
  totalCount: number;
  correctCount: number;
  score: number;
  wrongAnswers: CourseQuizWrongAnswer[];
}

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
  const response = await api.post<ApiResponse<CourseQuizSubmitResult>>(
    `/api/v1/courses/${courseId}/quiz/submit`,
    {
      answers,
    },
    {
      suppressGlobalError: true,
    }
  );

  return response.data;
};