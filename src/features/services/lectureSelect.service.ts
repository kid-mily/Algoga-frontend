import { api, ApiResponse } from "@/lib/api";
import type { CourseItem } from "../classroom/components/types";

export const getCourses = async (
  countryId: string | number
): Promise<CourseItem[]> => {
  try {
    const response = await api.get<ApiResponse<CourseItem[]>>(
      `/api/v1/courses/countries/${countryId}`,
      {
        next: { revalidate: 600 },
        suppressGlobalError: true,
      }
    );

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("[lecture-list] 강의 데이터 조회 실패:", error);
    return [];
  }
};