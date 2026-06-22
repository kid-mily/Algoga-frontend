import { api, ApiResponse } from "@/lib/api";
import { CourseItem } from "../classroom/components/types";

export const getCourses = async (
  countryId: string | number
): Promise<CourseItem[]> => {
  try {
    const response = await api.get<ApiResponse<CourseItem[]>>(
      `/api/v1/courses/countries/${countryId}`,
      {
        // next: { revalidate: 1800 },
      }
    );

    return response.data;
  } catch (error) {
    console.error("강의 데이터를 불러오는데 실패했습니다:", error);
    return [];
  }
};