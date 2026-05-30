import { api } from "@/lib/api";
import { CourseItem } from "../classroom/components/types";

export const getCoursesByCountry = async (
    countryId: number
    ): Promise<CourseItem[]> => {
    const response = await api.get(
        `/api/v1/courses/countries/${countryId}`
    );

    return response.data;
};