import { api } from "@/lib/api";
import { BaseApiResponse, CourseItem, CourseReviewSummary, ProgressData, UpdateProgressRequest } from "../classroom/components/types";

// 특정 강의 정보 찾기 (목록 API를 재활용하여 필터링)
export const getCourseDetail = async (countryId: string | number, courseId: string | number): Promise<CourseItem | null> => {
    try {
        const endpoint = `/api/v1/courses/countries/${countryId}`;
        const response = await api.get<BaseApiResponse<CourseItem[]>>(endpoint);
        
        // 목록에서 해당 courseId와 일치하는 단일 강의 추출
        const courses = response.data?.data || [];
        const courseDetail = courses.find(course => String(course.courseId) === String(courseId));
        
        return courseDetail || null;
    } catch (error) {
        console.error("강의 상세 정보 로드 실패:", error);
        throw error;
    }
};

// 수강 후기 요약 정보 가져오기
export const getCourseReviewSummary = async (courseId: string | number): Promise<CourseReviewSummary | null> => {
    try {
        const endpoint = `/api/v1/courses/${courseId}/reviews/summary`;
        const response = await api.get<BaseApiResponse<CourseReviewSummary>>(endpoint);
        
        return response.data?.data || null;
    } catch (error: any) {
        // 리뷰가 없는 경우 (404 에러 등) 
        if (error?.response?.status === 404) {
        return null; 
        }
        console.error("수강 후기 요약 로드 실패:", error);
        throw error;
    }
};

/**
 * 사용자의 챕터 영상 시청 시간을 기준으로 진도율을 업데이트합니다.
 * @param courseId 강의 ID
 * @param chapterId 챕터 ID
 * @param watchedSeconds 현재 시청 시간 (초)
 */
export const updateChapterProgress = async (
  courseId: string | number,
  chapterId: string | number,
  watchedSeconds: number
): Promise<ProgressData | null> => {
  try {
    const endpoint = `/api/v1/courses/${courseId}/chapters/${chapterId}/progress`;
    
    const requestBody: UpdateProgressRequest = {
      watchedSeconds: Math.floor(watchedSeconds) // 소수점 제외 안전하게 정수로 변환
    };

    const response = await api.post<BaseApiResponse<ProgressData>>(endpoint, requestBody);
    
    return response.data?.data || null;
  } catch (error) {
    console.error("진도율 업데이트 실패:", error);
    throw error;
  }
};