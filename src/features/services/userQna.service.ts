import { api, ApiResponse } from "@/lib/api";
import { CourseQna, CourseQnaDetail, CreateQnaCommentRequest, CreateQnaRequest, QnaComment } from "../classroom/qna/components/types";

// Q&A 목록 조회
export const getCourseQnas = async ( courseId: string | number ): Promise<CourseQna[]> => {
    const response = await api.get<ApiResponse<CourseQna[]>>(
        `/api/v1/courses/${courseId}/qnas`,
        {
            next: { revalidate: 3 },
        }
    );

    return response.data;
};

// Q&A 작성
export const createCourseQna = async (
    courseId: string | number,
    payload: CreateQnaRequest
): Promise<CourseQna> => {
    const response = await api.post<ApiResponse<CourseQna>>(
        `/api/v1/courses/${courseId}/qnas`,
        payload
    );

    return response.data;
};

// Q&A 상세 조회
export const getCourseQnaDetail = async (
    courseId: string | number,
    qnaId: string | number
): Promise<CourseQnaDetail> => {
    const response = await api.get<ApiResponse<CourseQnaDetail>>(
        `/api/v1/courses/${courseId}/qnas/${qnaId}`,
        {
        next: { revalidate: 3 },
        }
    );

    return response.data;
};

// Q&A 댓글 작성
export const createCourseQnaComment = async (
    courseId: string | number,
    qnaId: string | number,
    payload: CreateQnaCommentRequest
): Promise<QnaComment | null> => {
    const response = await api.post<ApiResponse<QnaComment | null>>(
        `/api/v1/courses/${courseId}/qnas/${qnaId}/comments`,
        payload
    );

    return response.data;
};