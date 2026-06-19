import { adminApi, ApiResult, unwrapData } from "@/lib/api";
import {
  CouponStatistic,
  CouponStatisticsData,
  CouponStatisticsSummary,
} from "@/features/statisticadmin/coupon/types";
import type { CouponDiscountType } from "@/features/common/types/coupon";

type UnknownRecord = Record<string, unknown>;

const getRecord = (value: unknown): UnknownRecord =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {};

const getItems = (data: unknown) => {
  if (Array.isArray(data)) return data;

  const record = getRecord(data);

  if (Array.isArray(record.content)) return record.content;
  if (Array.isArray(record.items)) return record.items;
  if (Array.isArray(record.policies)) return record.policies;

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

  if (typeof value === "string" && value.trim()) return value;
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

const normalizeDiscountType = (value: string): CouponDiscountType => {
  const discountType = value.toUpperCase();

  return discountType === "AMOUNT" ? "AMOUNT" : "RATE";
};

export const normalizeCouponStatistic = (
  item: unknown,
  fallbackId = 0
): CouponStatistic => {
  const record = getRecord(item);
  const issuedCount = getNumber(record, ["issuedCount", "issueCount", "totalIssued"]);
  const usedCount = getNumber(record, ["usedCount", "useCount", "totalUsed"]);
  const usageRate =
    getNumber(record, ["usageRate", "useRate"], issuedCount ? (usedCount / issuedCount) * 100 : 0);

  return {
    couponPolicyId: getNumber(record, ["couponPolicyId", "couponId", "id"], fallbackId),
    couponName: getString(record, ["couponName", "name", "title"], "-"),
    discountType: normalizeDiscountType(getString(record, ["discountType"], "RATE")),
    discountValue: getNumber(record, ["discountValue"]),
    courseId: getNumber(record, ["courseId"]),
    courseName: getString(record, ["courseTitle", "courseName", "lectureName"], "-"),
    countryId: getNumber(record, ["countryId"]),
    countryName: getString(record, ["countryName"], "-"),
    issuedCount,
    usedCount,
    expiredCount: getNumber(record, ["expiredCount", "expireCount", "totalExpired"]),
    availableCount: getNumber(record, ["availableCount", "totalAvailable"]),
    usageRate,
  };
};

const buildSummary = (
  data: unknown,
  statistics: CouponStatistic[]
): CouponStatisticsSummary => {
  const record = getRecord(data);
  const totalPolicyCount = getNumber(
    record,
    ["totalPolicyCount"],
    statistics.length
  );
  const totalIssuedCount = getNumber(
    record,
    ["totalIssuedCouponCount", "totalIssuedCount", "issuedCount", "totalIssued"],
    statistics.reduce((sum, item) => sum + item.issuedCount, 0)
  );
  const totalUsedCount = getNumber(
    record,
    ["totalUsedCouponCount", "totalUsedCount", "usedCount", "totalUsed"],
    statistics.reduce((sum, item) => sum + item.usedCount, 0)
  );
  const totalExpiredCount = getNumber(
    record,
    ["totalExpiredCouponCount", "totalExpiredCount", "expiredCount", "totalExpired"],
    statistics.reduce((sum, item) => sum + item.expiredCount, 0)
  );
  const totalAvailableCount = getNumber(
    record,
    ["totalAvailableCouponCount", "totalAvailableCount", "availableCount"],
    statistics.reduce((sum, item) => sum + item.availableCount, 0)
  );
  const averageUsageRate = getNumber(
    record,
    ["averageUsageRate", "usageRate", "avgUsageRate"],
    totalIssuedCount ? (totalUsedCount / totalIssuedCount) * 100 : 0
  );

  return {
    filterCourseId: getNumber(record, ["filterCourseId"]) || null,
    filterCountryId: getNumber(record, ["filterCountryId"]) || null,
    totalPolicyCount,
    totalIssuedCount,
    totalUsedCount,
    totalExpiredCount,
    totalAvailableCount,
    averageUsageRate,
  };
};

export const getAdminCouponStatistics = async (
  signal?: AbortSignal
): Promise<CouponStatisticsData> => {
  const response = await adminApi.get<ApiResult<unknown>>(
    "/api/v1/admin/coupon-statistics",
    {
      suppressGlobalError: true,
      signal,
    }
  );
  const data = unwrapData(response);
  const items = getItems(data);
  const statistics = items
    .map((item) => normalizeCouponStatistic(item))
    .filter((statistic) => statistic.couponPolicyId > 0);

  return {
    summary: buildSummary(data, statistics),
    statistics,
  };
};
