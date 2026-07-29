import { cache } from "react";
import { api, ApiResponse } from "@/lib/api";
import { CourseItem, CourseReviewSummary } from "../classroom/components/types";

// generateMetadata와 페이지 본문이 같은 (countryId, courseId)로 각각 한 번씩
// 호출하므로, React.cache()로 요청 단위 메모이제이션을 걸어 실제 fetch를 1회로 줄인다.
export const getCourseDetail = cache(async (
  countryId: string | number,
  courseId: string | number
): Promise<CourseItem | null> => {
  try {
    const response = await api.get<ApiResponse<CourseItem[]>>(
      `/api/v1/courses/countries/${countryId}`,
      {
        next: { revalidate: 600 },
        suppressGlobalError: true,
      }
    );

    const courses = Array.isArray(response.data) ? response.data : [];
    return courses.find((course) => String(course.courseId) === String(courseId)) ?? null;
  } catch {
    return null;
  }
});

export const getCourseReviewSummary = async (
  courseId: string | number
): Promise<CourseReviewSummary | null> => {
  try {
    const response = await api.get<ApiResponse<CourseReviewSummary>>(
      `/api/v1/courses/${courseId}/reviews/summary`,
      {
        next: { revalidate: 600 },
        suppressGlobalError: true,
      }
    );

    return response.data ?? null;
  } catch {
    return null;
  }
};
