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

const getItems = (value: unknown) => {
  return Array.isArray(value) ? value : [];
};

const getString = (record: UnknownRecord, key: string, fallback = "-") => {
  const value = record[key];

  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number") return String(value);

  return fallback;
};

const getNumber = (record: UnknownRecord, key: string, fallback = 0) => {
  const value = record[key];

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
    countryId: getNumber(record, "countryId"),
    countryName: getString(record, "countryName", "-"),
    countryCode: getString(record, "countryCode", "-"),
    signupCount: getNumber(record, "signupCount"),
    bookingCount: getNumber(record, "bookingCount"),
    revenue: getNumber(record, "revenue"),
    shareRate: getNumber(record, "shareRate"),
    rank: fallbackRank,
  };
};

export const getCountryPopularityData = async ({
  from,
  to,
  signal,
}: CountryStatisticsQuery
): Promise<CountryPopularityData> => {
  const response = await adminApi.get<ApiResult<unknown>>(
    "/api/v1/admin/stats/countries/top10",
    {
      params: { from, to },
      suppressGlobalError: true,
      signal,
    }
  );
  const data = getRecord(unwrapData(response));

  return {
    bookingTop10: getItems(data.bookingTop10).map((item, index) =>
      normalizeCountryPopularityStat(item, index + 1)
    ),
    revenueTop10: getItems(data.revenueTop10).map((item, index) =>
      normalizeCountryPopularityStat(item, index + 1)
    ),
  };
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
