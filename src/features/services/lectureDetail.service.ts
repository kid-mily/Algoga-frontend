import { api } from "@/lib/api";
import { BaseApiResponse, CourseItem, CourseReviewSummary } from "../classroom/components/types";

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