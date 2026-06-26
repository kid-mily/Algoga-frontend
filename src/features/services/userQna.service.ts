import { api, ApiResponse } from "@/lib/api";
import { CourseQna, CourseQnaDetail, CreateQnaCommentRequest, CreateQnaRequest, QnaComment } from "../classroom/qna/components/types";


export const getCourseQnas = async (
  courseId: string | number
): Promise<CourseQna[]> => {
  const response = await api.get<ApiResponse<CourseQna[]>>(
    `/api/v1/courses/${courseId}/qnas`,
    {
      cache: "no-store",
      suppressGlobalError: true,
    }
  );

  return response.data ?? [];
};

export const createCourseQna = async (
  courseId: string | number,
  payload: CreateQnaRequest
): Promise<CourseQna> => {
  const response = await api.post<ApiResponse<CourseQna>>(
    `/api/v1/courses/${courseId}/qnas`,
    payload,
    {
      suppressGlobalError: true,
    }
  );

  return response.data;
};

export const getCourseQnaDetail = async (
  courseId: string | number,
  qnaId: string | number
): Promise<CourseQnaDetail> => {
  const response = await api.get<ApiResponse<CourseQnaDetail>>(
    `/api/v1/courses/${courseId}/qnas/${qnaId}`,
    {
      cache: "no-store",
      suppressGlobalError: true,
    }
  );

  return response.data;
};

export const createCourseQnaComment = async (
  courseId: string | number,
  qnaId: string | number,
  payload: CreateQnaCommentRequest
): Promise<QnaComment | null> => {
  const response = await api.post<ApiResponse<QnaComment | null>>(
    `/api/v1/courses/${courseId}/qnas/${qnaId}/comments`,
    payload,
    {
      suppressGlobalError: true,
    }
  );

  return response.data;
};