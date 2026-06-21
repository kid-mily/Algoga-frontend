import { api, ApiResponse } from "@/lib/api";
import { Continent } from "../classroom/components/types";

export const getContinents = async (): Promise<Continent[]> => {
  try {
    const response = await api.get<ApiResponse<Continent[]>>(
      "/api/v1/maps/continents",
      {
        // next: { revalidate: 1800 },
      }
    );

    return response.data;
  } catch (error) {
    console.error("대륙 데이터를 불러오는데 실패했습니다:", error);
    return [];
  }
};