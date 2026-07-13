import { api, ApiResponse } from "@/lib/api";
import { CourseItem, CourseReviewSummary } from "../classroom/components/types";

export const getCourseDetail = async (
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
};

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
