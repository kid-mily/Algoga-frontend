import { adminApi, ApiResult, unwrapData } from "@/lib/api";
import type {
  CountryProfitabilityItem,
  CountryProfitabilitySummary,
} from "@/features/statisticadmin/country-profitability-summary/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export type CountryProfitQuery = {
  from: string;
  to: string;
};

type RawCountryProfitSummary = {
  countryCount: number;
  totalBookingCount: number;
  totalNetRevenue: number;
  avgRefundRate: number;
  topCountryName: string;
  topCountryShare: number;
};

type RawCountryProfit = {
  countryId: number;
  countryName: string;
  bookingCount: number;
  grossRevenue: number;
  netRevenue: number;
  refundRate: number;
  balanceConversionRate: number;
  cancelRate: number;
  share: number;
};

export type CountryProfitData = {
  summary: CountryProfitabilitySummary;
  items: CountryProfitabilityItem[];
};

const toNumber = (value: number | null | undefined) => Number(value ?? 0);

// 요약 응답은 avgRefundRate(백엔드) → averageRefundRate(UI)로 이름이 다름에 주의.
const normalizeSummary = (
  raw: RawCountryProfitSummary
): CountryProfitabilitySummary => ({
  countryCount: toNumber(raw?.countryCount),
  totalNetRevenue: toNumber(raw?.totalNetRevenue),
  averageRefundRate: toNumber(raw?.avgRefundRate),
});

const normalizeItems = (items: RawCountryProfit[]): CountryProfitabilityItem[] =>
  items.map((country) => ({
    countryName: country.countryName,
    bookingCount: toNumber(country.bookingCount),
    grossRevenue: toNumber(country.grossRevenue),
    netRevenue: toNumber(country.netRevenue),
    refundRate: toNumber(country.refundRate),
    balanceConversionRate: toNumber(country.balanceConversionRate),
    cancelRate: toNumber(country.cancelRate),
    share: toNumber(country.share),
  }));

const getSummaryRaw = (query: CountryProfitQuery, signal?: AbortSignal) =>
  adminApi.get<ApiResult<RawCountryProfitSummary>>(
    "/api/v1/admin/stats/country-profit/summary",
    { params: query, suppressGlobalError: true, signal }
  );

const getListRaw = (query: CountryProfitQuery, signal?: AbortSignal) =>
  adminApi.get<ApiResult<RawCountryProfit[]>>("/api/v1/admin/stats/country-profit", {
    params: query,
    suppressGlobalError: true,
    signal,
  });

export const getCountryProfitData = async (
  query: CountryProfitQuery,
  signal?: AbortSignal
): Promise<CountryProfitData> => {
  const [summaryRes, listRes] = await Promise.all([
    getSummaryRaw(query, signal),
    getListRaw(query, signal),
  ]);

  return {
    summary: normalizeSummary(unwrapData(summaryRes)),
    items: normalizeItems(unwrapData(listRes) ?? []),
  };
};

export const downloadCountryProfitCsv = async ({ from, to }: CountryProfitQuery) => {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL이 설정되어 있지 않습니다.");
  }

  const params = new URLSearchParams({ from, to });

  const response = await fetch(
    `${API_BASE_URL}/api/v1/admin/stats/country-profit/csv?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
      headers: { Accept: "text/csv" },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || `CSV 다운로드에 실패했습니다. (status: ${response.status})`
    );
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "country-profit.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
