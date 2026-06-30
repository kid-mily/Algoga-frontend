import type { Country } from "@/features/classroom/types";

type ApiResponse<T> = {
  data?: T;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getCountries = async (
  continentCode: string,
  signal?: AbortSignal
): Promise<Country[]> => {
  const path = `/api/v1/maps/continents/${continentCode}/countries`;
  const url = typeof window === "undefined" ? `${API_BASE_URL}${path}` : path;

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    next: {
      revalidate: 3600,
      tags: [`countries-${continentCode}`],
    },
    signal,
  });

  if (!response.ok) {
    throw new Error("국가 데이터를 불러오지 못했습니다.");
  }

  const result = (await response.json()) as ApiResponse<Country[]>;

  return Array.isArray(result.data) ? result.data : [];
};
