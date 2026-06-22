import { api, ApiResponse } from "@/lib/api";
import {
  CourseItem,
  CourseReviewSummary,
  ProgressData,
  UpdateProgressRequest,
} from "../classroom/components/types";

// 강의 상세 조회
export const getCourseDetail = async (
  countryId: string | number,
  courseId: string | number
): Promise<CourseItem | null> => {
  try {
    const response = await api.get<ApiResponse<CourseItem[]>>(
      `/api/v1/courses/countries/${countryId}`,
      {
        // next: { revalidate: 3 },
      }
    );

    const courses = response.data;

    const courseDetail = courses.find(
      (course) => String(course.courseId) === String(courseId)
    );

    return courseDetail ?? null;
  } catch (error) {
    console.error("강의 상세 정보를 불러오는 데 실패했습니다:", error);
    throw error;
  }
};

// 리뷰 요약 조회
export const getCourseReviewSummary = async (
  courseId: string | number
): Promise<CourseReviewSummary | null> => {
  try {
    const response = await api.get<ApiResponse<CourseReviewSummary>>(
      `/api/v1/courses/${courseId}/reviews/summary`,
      {
        // next: { revalidate: 3 },
      }
    );

    return response.data;
  } catch (error) {
    console.error("수강 후기 요약을 불러오는 데 실패했습니다:", error);
    return null;
  }
};

// 챕터 진도율 업데이트
export const updateChapterProgress = async (
  courseId: string | number,
  chapterId: string | number,
  watchedSeconds: number
): Promise<ProgressData> => {
  try {
    const requestBody: UpdateProgressRequest = {
      watchedSeconds: Math.floor(watchedSeconds),
    };

    const response = await api.post<ApiResponse<ProgressData>>(
      `/api/v1/courses/${courseId}/chapters/${chapterId}/progress`,
      requestBody
    );

    return response.data;
  } catch (error) {
    console.error("진도율 업데이트에 실패했습니다:", error);
    throw error;
  }
};