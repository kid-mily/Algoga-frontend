import { adminApi, ApiRequestError, ApiResult, unwrapData } from "@/lib/api";
import {
  CountryPopularityData,
  CountryPopularityStat,
} from "@/features/statisticadmin/country-popular/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL 환경 변수가 설정되지 않았습니다.");
}

type UnknownRecord = Record<string, unknown>;

type CountryStatisticsQuery = {
  from: string;
  to: string;
  signal?: AbortSignal;
};

const getRecord = (value: unknown): UnknownRecord =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {};

const getItems = (data: unknown, key?: string) => {
  if (Array.isArray(data)) return data;

  const record = getRecord(data);

  if (key && Array.isArray(record[key])) return record[key] as unknown[];
  if (Array.isArray(record.content)) return record.content;
  if (Array.isArray(record.items)) return record.items;
  if (Array.isArray(record.countries)) return record.countries;
  if (Array.isArray(record.data)) return record.data;

  return [];
};

const getString = (record: UnknownRecord, keys: string[], fallback = "-") => {
  const value = keys
    .map((key) => record[key])
    .find(
      (item) =>
        item !== null &&
        item !== undefined &&
        !(typeof item === "string" && !item.trim())
    );

  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);

  return fallback;
};

const getNumber = (record: UnknownRecord, keys: string[], fallback = 0) => {
  const value = keys
    .map((key) => record[key])
    .find((item) => item !== null && item !== undefined);

  if (typeof value === "number" && Number.isFinite(value)) return value;

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
};

const buildUrl = (path: string, params?: Record<string, string>) => {
  const url = new URL(`${BASE_URL}${path}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  return url.toString();
};

export const normalizeCountryPopularityStat = (
  item: unknown,
  fallbackRank: number
): CountryPopularityStat => {
  const record = getRecord(item);

  return {
    countryId: getNumber(record, ["countryId", "country_id", "id"]),
    countryName: getString(record, ["countryName", "name", "country"], "-"),
    viewCount: getNumber(record, [
      "viewCount",
      "views",
      "entryCount",
      "visitCount",
      "pageViewCount",
    ]),
    bookingCount: getNumber(record, [
      "bookingCount",
      "reservationCount",
      "completedCount",
      "bookings",
    ]),
    revenueAmount: getNumber(record, [
      "revenueAmount",
      "totalAmount",
      "salesAmount",
      "amount",
    ]),
    popularityScore: getNumber(record, [
      "popularityScore",
      "score",
      "popularity",
      "rate",
    ]),
    conversionRate: getNumber(record, [
      "conversionRate",
      "bookingRate",
      "reservationRate",
    ]),
    rank: getNumber(record, ["rank", "ranking"], fallbackRank),
  };
};

export const getCountryStatistics = async ({
  from,
  to,
  signal,
}: CountryStatisticsQuery
): Promise<CountryPopularityStat[]> => {
  const response = await adminApi.get<ApiResult<unknown>>(
    "/api/v1/admin/stats/countries",
    {
      params: { from, to },
      suppressGlobalError: true,
      signal,
    }
  );

  return getItems(unwrapData(response)).map((item, index) =>
    normalizeCountryPopularityStat(item, index + 1)
  );
};

export const getTopCountryStatistics = async ({
  from,
  to,
  signal,
}: CountryStatisticsQuery
): Promise<CountryPopularityStat[]> => {
  const response = await adminApi.get<ApiResult<unknown>>(
    "/api/v1/admin/stats/countries/top10",
    {
      params: { from, to },
      suppressGlobalError: true,
      signal,
    }
  );

  return getItems(unwrapData(response)).map((item, index) =>
    normalizeCountryPopularityStat(item, index + 1)
  );
};

export const getCountryPopularityData = async ({
  from,
  to,
  signal,
}: CountryStatisticsQuery
): Promise<CountryPopularityData> => {
  const [countries, topCountries] = await Promise.all([
    getCountryStatistics({ from, to, signal }),
    getTopCountryStatistics({ from, to, signal }),
  ]);

  return { countries, topCountries };
};

export const downloadCountryStatisticsCsv = async ({
  from,
  to,
}: Pick<CountryStatisticsQuery, "from" | "to">) => {
  const url = buildUrl("/api/v1/admin/stats/countries/csv", { from, to });
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 30000);

  let response: Response;

  try {
    response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "text/csv, application/octet-stream, */*",
      },
      signal: controller.signal,
    });
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiRequestError({
        message: "CSV 다운로드 요청 시간이 초과되었습니다.",
        status: 0,
        url,
      });
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const result = await response.json().catch(() => null);

    throw new ApiRequestError({
      message: result?.message || "CSV 다운로드에 실패했습니다.",
      status: response.status,
      code: result?.code,
      url,
      body: result,
    });
  }

  return response.blob();
};
