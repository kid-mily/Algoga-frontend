import { api, ApiResponse } from "@/lib/api";
import { Country } from "../classroom/components/types";

export const getCountries = async (
  continentCode: string
): Promise<Country[]> => {
  try {
    const response = await api.get<ApiResponse<Country[]>>(
      `/api/v1/maps/continents/${continentCode}/countries`,
      {
        next: { revalidate: 1800 },
      }
    );

    return response.data;
  } catch (error) {
    console.error("국가 데이터를 불러오는데 실패했습니다:", error);
    return [];
  }
};