import { adminApi, ApiResult, unwrapData } from "@/lib/api";
import type {
  CohortRow,
  RepurchaseLtvStatistics,
  RepurchaseLtvSummary,
  TopCustomer,
} from "@/features/statisticadmin/repurchase-ltv/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export type RepurchaseLtvQuery = {
  from: string;
  to: string;
};

type RawRetentionSummary = {
  repeatRate: number;
  arpu: number;
  avgIntervalDays: number;
  top10RevenueShare: number;
};

type RawCohortRow = {
  cohortMonth: string;
  cohortSize: number;
  retentionRate: Array<number | null>;
  cumulativeRevenue: Array<number | null>;
};

type RawCohortResponse = {
  maxMonths: number;
  cohorts: RawCohortRow[];
};

type RawTopCustomer = {
  rank: number;
  userName: string;
  bookingCount: number;
  totalPaid: number;
  recentDestination: string;
  avgIntervalDays: number;
};

const toNumber = (value: number | null | undefined) => Number(value ?? 0);

const normalizeSummary = (raw: RawRetentionSummary): RepurchaseLtvSummary => ({
  repurchaseRate: toNumber(raw?.repeatRate),
  arpu: toNumber(raw?.arpu),
  averagePurchaseIntervalDays: toNumber(raw?.avgIntervalDays),
  topCustomerRevenueShare: toNumber(raw?.top10RevenueShare),
});

const normalizeCohortRows = (items: RawCohortRow[]): CohortRow[] =>
  items.map((item) => ({
    cohortMonth: item.cohortMonth,
    cohortSize: toNumber(item.cohortSize),
    retentionRate: item.retentionRate ?? [],
    cumulativeRevenue: item.cumulativeRevenue ?? [],
  }));

const normalizeTopCustomers = (items: RawTopCustomer[]): TopCustomer[] =>
  items.map((item) => ({
    rank: toNumber(item.rank),
    name: item.userName || "-",
    bookingCount: toNumber(item.bookingCount),
    cumulativePayment: toNumber(item.totalPaid),
    recentDestination: item.recentDestination || "-",
    averagePurchaseIntervalDays: toNumber(item.avgIntervalDays),
  }));

const getSummaryRaw = (query: RepurchaseLtvQuery, signal?: AbortSignal) =>
  adminApi.get<ApiResult<RawRetentionSummary>>(
    "/api/v1/admin/stats/retention/summary",
    { params: query, suppressGlobalError: true, signal }
  );

const getCohortRaw = (query: RepurchaseLtvQuery, signal?: AbortSignal) =>
  adminApi.get<ApiResult<RawCohortResponse>>(
    "/api/v1/admin/stats/retention/cohort",
    { params: query, suppressGlobalError: true, signal }
  );

const getTopCustomersRaw = (query: RepurchaseLtvQuery, signal?: AbortSignal) =>
  adminApi.get<ApiResult<RawTopCustomer[]>>(
    "/api/v1/admin/stats/retention/top-customers",
    { params: query, suppressGlobalError: true, signal }
  );

export const getRepurchaseLtvData = async (
  query: RepurchaseLtvQuery,
  signal?: AbortSignal
): Promise<RepurchaseLtvStatistics> => {
  const [summaryRes, cohortRes, topCustomersRes] = await Promise.all([
    getSummaryRaw(query, signal),
    getCohortRaw(query, signal),
    getTopCustomersRaw(query, signal),
  ]);

  const cohortData = unwrapData(cohortRes);

  return {
    summary: normalizeSummary(unwrapData(summaryRes)),
    maxMonths: toNumber(cohortData?.maxMonths) || 12,
    cohorts: normalizeCohortRows(cohortData?.cohorts ?? []),
    topCustomers: normalizeTopCustomers(unwrapData(topCustomersRes) ?? []),
  };
};

export const downloadTopCustomersCsv = async ({ from, to }: RepurchaseLtvQuery) => {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL이 설정되어 있지 않습니다.");
  }

  const params = new URLSearchParams({ from, to });

  const response = await fetch(
    `${API_BASE_URL}/api/v1/admin/stats/retention/top-customers/csv?${params.toString()}`,
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
  link.download = "top-customers.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
