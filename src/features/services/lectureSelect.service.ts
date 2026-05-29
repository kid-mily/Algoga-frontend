import { api } from "@/lib/api";
import { Country, CourseItem } from "@/features/classroom/types";

interface ApiResponse<T> {
  code?: string;
  message?: string;
  data?: T;
}

interface CountryCourseResult {
  country: Country;
  courses: CourseItem[];
}

const normalizeCode = (code: string) => {
  return decodeURIComponent(code)
    .trim()
    .replace(/-/g, "_")
    .toUpperCase();
};

const getCountryByCode = async (
  continentCode: string,
  countryCode: string
): Promise<Country> => {
  const normalizedContinentCode = normalizeCode(continentCode);
  const normalizedCountryCode = normalizeCode(countryCode);

  const response = await api.get<ApiResponse<Country[]>>(
    `/api/v1/maps/continents/${normalizedContinentCode}/countries`
  );

  const countries = Array.isArray(response.data?.data)
    ? response.data.data
    : [];

  const matchedCountry = countries.find(
    (country) => normalizeCode(country.countryCode) === normalizedCountryCode
  );

  if (!matchedCountry) {
    throw new Error(
      `해당 국가를 찾을 수 없습니다. countryCode=${normalizedCountryCode}`
    );
  }

  return matchedCountry;
};

export const getCourse = async (
  continentCode: string,
  countryCode: string
): Promise<CountryCourseResult> => {
  const country = await getCountryByCode(continentCode, countryCode);

  const response = await api.get<ApiResponse<CourseItem[]>>(
    `/api/v1/courses/countries/${country.countryId}`
  );

  const courses = Array.isArray(response.data?.data)
    ? response.data.data
    : [];

  return {
    country,
    courses,
  };
};