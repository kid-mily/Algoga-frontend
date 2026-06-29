import type { Country } from "../classroom/components/types";

type ApiResponse<T> = {
  data?: T;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getCountries = async (
  continentCode: string,
  signal?: AbortSignal
): Promise<Country[]> => {
  try {
    const path = `/api/v1/maps/continents/${continentCode}/countries`;
    const url = typeof window === "undefined" ? `${API_BASE_URL}${path}` : path;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 600 },
      signal,
    });

    if (!response.ok) {
      return [];
    }

    const result = (await response.json()) as ApiResponse<Country[]>;

    return Array.isArray(result.data) ? result.data : [];
  } catch (error) {
    console.error("[country-select] 국가 데이터 조회 실패:", error);
    return [];
  }
};