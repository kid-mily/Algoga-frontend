import {
  CourseQna,
  CreateCourseQnaCommentPayload,
  CreateCourseQnaPayload,
  normalizeCourseQna,
} from "@/features/classroom/qna/types";
import { adminApi, api, ApiResponse } from "@/lib/api";

type CourseQnaApiResponse<T> = ApiResponse<T> | T;

type CreateAdminCourseQnaAnswerPayload = {
  answer: string;
};

const unwrapData = <T>(response: CourseQnaApiResponse<T>): T => {
  if (response && typeof response === "object" && "data" in response) {
    return (response as ApiResponse<T>).data;
  }

  return response as T;
};

const unwrapList = (data: unknown) => {
  if (Array.isArray(data)) return data;

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;

    if (Array.isArray(record.content)) return record.content;
    if (Array.isArray(record.qnas)) return record.qnas;
    if (Array.isArray(record.items)) return record.items;
  }

  return [];
};

export const getCourseQnas = async (courseId: string | number): Promise<CourseQna[]> => {
  const response = await api.get<CourseQnaApiResponse<unknown>>(
    `/api/v1/courses/${courseId}/qnas`
  );
  const data = unwrapData(response);

  return unwrapList(data).map((item, index) => normalizeCourseQna(item, index + 1));
};

export const createCourseQna = async (
  courseId: string | number,
  payload: CreateCourseQnaPayload
) => {
  const response = await api.post<CourseQnaApiResponse<unknown>>(
    `/api/v1/courses/${courseId}/qnas`,
    payload
  );

  return unwrapData(response);
};

export const getCourseQna = async (
  courseId: string | number,
  qnaId: string | number
): Promise<CourseQna> => {
  const response = await api.get<CourseQnaApiResponse<unknown>>(
    `/api/v1/courses/${courseId}/qnas/${qnaId}`
  );
  const data = unwrapData(response);

  return normalizeCourseQna(data, Number(qnaId));
};

export const createCourseQnaComment = async (
  courseId: string | number,
  qnaId: string | number,
  payload: CreateCourseQnaCommentPayload
) => {
  const response = await api.post<CourseQnaApiResponse<unknown>>(
    `/api/v1/courses/${courseId}/qnas/${qnaId}/comments`,
    {
      parentCommentId: payload.parentCommentId ?? null,
      content: payload.content,
    }
  );

  return unwrapData(response);
};

export const createAdminCourseQnaAnswer = async (
  courseId: string | number,
  qnaId: string | number,
  payload: CreateAdminCourseQnaAnswerPayload
) => {
  const response = await adminApi.post<CourseQnaApiResponse<unknown>>(
    `/api/v1/admin/courses/${courseId}/qnas/${qnaId}/answer`,
    payload
  );

  return unwrapData(response);
};
