import api from "@/lib/axios";
import { BaseApiResponse, CourseItem } from "../classroom/types";

export const getCoursesByCountry = async (
  countryId: number
): Promise<CourseItem[]> => {
  const response = await api.get<BaseApiResponse<CourseItem[]>>(
    `/api/v1/courses/countries/${countryId}`
  );

  return response.data.data;
};