import { adminApi, ApiResult, unwrapData } from "@/lib/api";
import { downloadAdminFile } from "@/lib/downloadFile";
import type {
  CountryProfitabilityItem,
  CountryProfitabilitySummary,
  CountryProfitQuery,
} from "@/features/statisticadmin/country-profitability-summary/types";

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

// search(국가명 부분 일치)는 목록에만 적용합니다. 빈 값이면 전체 조회.
const getListRaw = (
  { from, to, search }: CountryProfitQuery & { search?: string },
  signal?: AbortSignal
) =>
  adminApi.get<ApiResult<RawCountryProfit[]>>("/api/v1/admin/stats/country-profit", {
    params: { from, to, search: search?.trim() || undefined },
    suppressGlobalError: true,
    signal,
  });

// 요약·점유율(topCountryShare 등)은 전체 기준이라 search를 보내지 않습니다.
export const getCountryProfitSummary = async (
  query: CountryProfitQuery,
  signal?: AbortSignal
): Promise<CountryProfitabilitySummary> =>
  normalizeSummary(unwrapData(await getSummaryRaw(query, signal)));

// 나라별 수익성 목록. search가 있으면 서버 검색으로 걸러진 목록을 받습니다.
export const getCountryProfitItems = async (
  query: CountryProfitQuery & { search?: string },
  signal?: AbortSignal
): Promise<CountryProfitabilityItem[]> =>
  normalizeItems(unwrapData(await getListRaw(query, signal)) ?? []);

export const downloadCountryProfitCsv = ({
  from,
  to,
  search,
}: CountryProfitQuery & { search?: string }) =>
  downloadAdminFile("/api/v1/admin/stats/country-profit/csv", {
    params: { from, to, search: search?.trim() },
    filename: "country-profit.csv",
    errorFromResponse: true,
  });
