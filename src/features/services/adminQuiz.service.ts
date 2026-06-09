import { adminApi } from "@/lib/api";
import {
  AdminQuiz,
  CreateAdminQuizPayload,
  UpdateAdminQuizPayload,
} from "../contentmanage/quiz/types";

const getErrorMessage = (error: any, fallbackMessage: string) => {
  return error?.response?.data?.message || error?.message || fallbackMessage;
};

const normalizeQuiz = (quiz: any, courseId: number): AdminQuiz => {
  return {
    quizId: quiz.quizId ?? quiz.id,
    courseId: quiz.courseId ?? courseId,
    lectureTitle: quiz.lectureTitle,
    question: quiz.question ?? "",
    option1: quiz.option1 ?? "",
    option2: quiz.option2 ?? "",
    option3: quiz.option3 ?? "",
    option4: quiz.option4 ?? "",
    correctOption: quiz.correctOption ?? quiz.answer ?? 1,
    explanation: quiz.explanation ?? "",
  };
};

export const getAdminQuizzes = async (
  courseId: number
): Promise<AdminQuiz[]> => {
  try {
    const response = await adminApi.get(
      `/api/v1/admin/courses/${courseId}/quizzes`
    );

    console.log(`${courseId}번 강의 퀴즈 API 응답:`, response.data);

    const data = response.data?.data;

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map((quiz) => normalizeQuiz(quiz, courseId));
  } catch (error: any) {
    console.error("퀴즈 목록 조회 API 에러:", error.response?.data || error);
    throw new Error(getErrorMessage(error, "퀴즈 목록 조회에 실패했습니다."));
  }
};

export const createAdminQuiz = async (
  payload: CreateAdminQuizPayload
): Promise<AdminQuiz> => {
  try {
    const existingQuizzes = await getAdminQuizzes(payload.courseId);

    if (existingQuizzes.length >= 5) {
      throw new Error("강의별 퀴즈는 최대 5개까지만 등록할 수 있습니다.");
    }

    const response = await adminApi.post(
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

    return normalizeQuiz(response.data.data, payload.courseId);
  } catch (error: any) {
    console.error("퀴즈 등록 API 에러:", error.response?.data || error);

    if (error?.message === "강의별 퀴즈는 최대 5개까지만 등록할 수 있습니다.") {
      throw error;
    }

    throw new Error(getErrorMessage(error, "퀴즈 등록에 실패했습니다."));
  }
};

export const updateAdminQuiz = async (
  courseId: number,
  quizId: number,
  payload: UpdateAdminQuizPayload
): Promise<AdminQuiz> => {
  try {
    const response = await adminApi.put(
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

    return normalizeQuiz(response.data.data, courseId);
  } catch (error: any) {
    console.error("퀴즈 수정 API 에러:", error.response?.data || error);
    throw new Error(getErrorMessage(error, "퀴즈 수정에 실패했습니다."));
  }
};

export const deleteAdminQuiz = async (
  courseId: number,
  quizId: number
): Promise<void> => {
  try {
    await adminApi.delete(`/api/v1/admin/courses/${courseId}/quizzes/${quizId}`);
  } catch (error: any) {
    console.error("퀴즈 삭제 API 에러:", error.response?.data || error);
    throw new Error(getErrorMessage(error, "퀴즈 삭제에 실패했습니다."));
  }
};

export const getAdminQuizDetail = async (
  courseId: number,
  quizId: number
): Promise<AdminQuiz | null> => {
  const quizzes = await getAdminQuizzes(courseId);
  return quizzes.find((quiz) => quiz.quizId === quizId) ?? null;
};
