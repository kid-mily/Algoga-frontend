import { adminApi, ApiResponse } from "@/lib/api";
import {
  AdminQuiz,
  CreateAdminQuizPayload,
  UpdateAdminQuizPayload,
} from "../contentmanage/quiz/types";

type AdminQuizRecord = AdminQuiz & {
  id?: number;
  answer?: number;
};

const normalizeQuiz = (quiz: AdminQuizRecord, courseId: number): AdminQuiz => ({
  quizId: quiz.quizId ?? quiz.id ?? 0,
  courseId: quiz.courseId ?? courseId,
  lectureTitle: quiz.lectureTitle,
  question: quiz.question ?? "",
  option1: quiz.option1 ?? "",
  option2: quiz.option2 ?? "",
  option3: quiz.option3 ?? "",
  option4: quiz.option4 ?? "",
  correctOption: quiz.correctOption ?? quiz.answer ?? 1,
  explanation: quiz.explanation ?? "",
});

export const getAdminQuizzes = async (
  courseId: number
): Promise<AdminQuiz[]> => {
  const response = await adminApi.get<ApiResponse<AdminQuizRecord[]>>(
    `/api/v1/admin/courses/${courseId}/quizzes`
  );

  return Array.isArray(response.data)
    ? response.data.map((quiz) => normalizeQuiz(quiz, courseId))
    : [];
};

export const createAdminQuiz = async (
  payload: CreateAdminQuizPayload
): Promise<AdminQuiz> => {
  const existingQuizzes = await getAdminQuizzes(payload.courseId);

  if (existingQuizzes.length >= 5) {
    throw new Error("강의별 퀴즈는 최대 5개까지 등록할 수 있습니다.");
  }

  const response = await adminApi.post<ApiResponse<AdminQuizRecord>>(
    `/api/v1/admin/courses/${payload.courseId}/quizzes`,
    {
      question: payload.question,
      option1: payload.option1,
      option2: payload.option2,
      option3: payload.option3,
      option4: payload.option4,
      correctOption: payload.correctOption,
      explanation: payload.explanation || "",
    }
  );

  return normalizeQuiz(response.data, payload.courseId);
};

export const updateAdminQuiz = async (
  courseId: number,
  quizId: number,
  payload: UpdateAdminQuizPayload
): Promise<AdminQuiz> => {
  const response = await adminApi.put<ApiResponse<AdminQuizRecord>>(
    `/api/v1/admin/courses/${courseId}/quizzes/${quizId}`,
    {
      question: payload.question,
      option1: payload.option1,
      option2: payload.option2,
      option3: payload.option3,
      option4: payload.option4,
      correctOption: payload.correctOption,
      explanation: payload.explanation || "",
    }
  );

  return normalizeQuiz(response.data, courseId);
};

export const deleteAdminQuiz = async (
  courseId: number,
  quizId: number
): Promise<void> => {
  await adminApi.delete(
    `/api/v1/admin/courses/${courseId}/quizzes/${quizId}`
  );
};

export const getAdminQuizDetail = async (
  courseId: number,
  quizId: number
): Promise<AdminQuiz | null> => {
  const quizzes = await getAdminQuizzes(courseId);
  return quizzes.find((quiz) => quiz.quizId === quizId) ?? null;
};