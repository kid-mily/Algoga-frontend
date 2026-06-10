import {
  createAdminQuiz,
  deleteAdminQuiz,
  getAdminQuizDetail,
  getAdminQuizzes,
  updateAdminQuiz,
} from "@/features/services/adminQuiz.service";
import {
  CreateAdminQuizPayload,
  UpdateAdminQuizPayload,
} from "./types";

export const getQuizListAction = (courseId: number) => {
  return getAdminQuizzes(courseId);
};

export const getQuizDetailAction = (courseId: number, quizId: number) => {
  return getAdminQuizDetail(courseId, quizId);
};

export const createQuizAction = (payload: CreateAdminQuizPayload) => {
  return createAdminQuiz(payload);
};

export const updateQuizAction = (
  courseId: number,
  quizId: number,
  payload: UpdateAdminQuizPayload
) => {
  return updateAdminQuiz(courseId, quizId, payload);
};

export const deleteQuizAction = (courseId: number, quizId: number) => {
  return deleteAdminQuiz(courseId, quizId);
};
