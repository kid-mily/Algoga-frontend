import type { Country } from "../classroom/components/types";

type ApiResponse<T> = {
  data?: T;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const unwrapCountryList = (value: unknown): Country[] => {
  if (Array.isArray(value)) return value as Country[];

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    if (Array.isArray(record.data)) {
      return record.data as Country[];
    }

    if (record.data && typeof record.data === "object") {
      const data = record.data as Record<string, unknown>;

      if (Array.isArray(data.countries)) return data.countries as Country[];
      if (Array.isArray(data.content)) return data.content as Country[];
      if (Array.isArray(data.items)) return data.items as Country[];
    }

    if (Array.isArray(record.countries)) return record.countries as Country[];
    if (Array.isArray(record.content)) return record.content as Country[];
    if (Array.isArray(record.items)) return record.items as Country[];
  }

  return [];
};

const buildCountryUrl = (continentCode: string) => {
  const path = `/api/v1/maps/continents/${continentCode}/countries`;

  if (typeof window === "undefined") {
    return `${API_BASE_URL}${path}`;
  }

  return path;
};

export const getCountries = async (
  continentCode: string,
  signal?: AbortSignal
): Promise<Country[]> => {
  const response = await fetch(buildCountryUrl(continentCode), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new Error("국가 데이터를 불러오지 못했습니다.");
  }

  const result = (await response.json()) as ApiResponse<unknown>;

  return unwrapCountryList(result);
};