import { adminApi, ApiResult, unwrapData } from "@/lib/api";
import { getAdminPayments } from "@/features/services/adminPayment.service";
import {
  DailyRevenueStat,
  MonthlyRevenueDetail,
  MonthlyRevenueStat,
  RevenueDetailData,
} from "@/features/moneyadmin/revenue/types";
import { getMonthDateRange } from "@/features/moneyadmin/revenue/utils";

const getRecord = (item: unknown): Record<string, unknown> =>
  item && typeof item === "object" ? (item as Record<string, unknown>) : {};

const toNumber = (value: unknown, fallback = 0) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
};

const getItems = (data: unknown) => {
  if (Array.isArray(data)) return data;

  const record = getRecord(data);

  if (Array.isArray(record.content)) return record.content;
  if (Array.isArray(record.items)) return record.items;
  if (Array.isArray(record.stats)) return record.stats;
  if (Array.isArray(record.monthlyStats)) return record.monthlyStats;

  return [];
};

export const normalizeMonthlyRevenue = (
  item: unknown,
  fallbackMonth = 1
): MonthlyRevenueStat => {
  const record = getRecord(item);

  return {
    year: toNumber(record.year),
    month: toNumber(record.month, fallbackMonth),
    totalAmount: toNumber(record.totalAmount),
    refundAmount: toNumber(record.refundAmount),
    netAmount: toNumber(record.netAmount),
    count: toNumber(record.count),
    growthRate: toNumber(record.growthRate),
  };
};

export const normalizeDailyRevenue = (
  item: unknown,
  fallbackDay = 1
): DailyRevenueStat => {
  const record = getRecord(item);

  return {
    day: toNumber(record.day, fallbackDay),
    salesAmount: toNumber(record.salesAmount),
    refundAmount: toNumber(record.refundAmount),
    netAmount: toNumber(record.netAmount),
  };
};

export const normalizeMonthlyRevenueDetail = (
  item: unknown,
  year: number,
  month: number
): MonthlyRevenueDetail => {
  const record = getRecord(item);
  const summary = normalizeMonthlyRevenue(record, month);
  const dailyStats = getItems(record.dailyStats).map((daily, index) =>
    normalizeDailyRevenue(daily, index + 1)
  );

  return {
    ...summary,
    year: summary.year || year,
    month: summary.month || month,
    dailyStats,
  };
};

export const getMonthlyRevenueStats = async (
  signal?: AbortSignal
): Promise<MonthlyRevenueStat[]> => {
  const response = await adminApi.get<ApiResult<unknown>>(
    "/api/v1/admin/payments/stats",
    {
      suppressGlobalError: true,
      signal,
    }
  );
  const data = unwrapData(response);

  return getItems(data).map((item, index) =>
    normalizeMonthlyRevenue(item, index + 1)
  );
};

export const getMonthlyRevenueDetail = async (
  year: number,
  month: number,
  signal?: AbortSignal
): Promise<MonthlyRevenueDetail> => {
  const response = await adminApi.get<ApiResult<unknown>>(
    `/api/v1/admin/payments/stats/${year}/${month}`,
    {
      suppressGlobalError: true,
      signal,
    }
  );

  return normalizeMonthlyRevenueDetail(unwrapData(response), year, month);
};

export const getRevenueDetailData = async (
  year: number,
  month: number,
  signal?: AbortSignal
): Promise<RevenueDetailData> => {
  const { from, to } = getMonthDateRange(year, month);
  const [detail, payments] = await Promise.all([
    getMonthlyRevenueDetail(year, month, signal),
    getAdminPayments({ from, to, signal }),
  ]);

  return { detail, payments };
};
