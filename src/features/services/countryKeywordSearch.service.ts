import type { Continent } from "../classroom/components/types";
import { getCountries } from "@/features/services/countrySelect.service";

const countryKeywordCache = new Map<string, string[]>();
const pendingCountryKeywordRequests = new Map<string, Promise<string[]>>();

const normalizeContinentCode = (continentCode: string) =>
  continentCode.trim().toUpperCase();

export const getCountryKeywords = async (
  continentCode: string
): Promise<string[]> => {
  const normalizedCode = normalizeContinentCode(continentCode);

  const cached = countryKeywordCache.get(normalizedCode);
  if (cached) {
    return cached;
  }

  const pending = pendingCountryKeywordRequests.get(normalizedCode);
  if (pending) {
    return pending;
  }

  const request = getCountries(normalizedCode)
    .then((countries) => {
      const keywords = countries.map((country) => country.countryName);
      countryKeywordCache.set(normalizedCode, keywords);
      return keywords;
    })
    .catch((error) => {
      console.error(
        `[classroom] ${normalizedCode} 국가 검색 키워드 조회 실패:`,
        error
      );
      return [];
    })
    .finally(() => {
      pendingCountryKeywordRequests.delete(normalizedCode);
    });

  pendingCountryKeywordRequests.set(normalizedCode, request);

  return request;
};

export const getCountryKeywordsByContinent = async (
  continents: Continent[]
): Promise<Record<string, string[]>> => {
  const entries = await Promise.all(
    continents.map(async (continent) => {
      const continentCode = normalizeContinentCode(continent.continentCode);
      const keywords = await getCountryKeywords(continentCode);

      return [continentCode, keywords] as const;
    })
  );

  return Object.fromEntries(entries);
};
