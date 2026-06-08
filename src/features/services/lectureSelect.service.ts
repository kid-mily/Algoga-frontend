import { api } from "@/lib/api";
import { CourseItem, BaseApiResponse } from "../classroom/components/types";

export const getCourses = async (
    countryId: string
    ): Promise<CourseItem[]> => {
    try {
        const response = await api.get<BaseApiResponse<CourseItem[]>>(
        `/api/v1/courses/countries/${countryId}`
        );

        return response.data.data;
    } catch (error) {
        console.error("강의 데이터를 불러오는데 실패했습니다:", error);
        return [];
    }
};