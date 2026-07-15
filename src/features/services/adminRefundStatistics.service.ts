import { adminApi, ApiResult, unwrapData } from "@/lib/api";
import {
  CancellationStage,
  CountryRefundRate,
  CountryRefundRateStatus,
  RefundManagementData,
  RefundMonthlyTrend,
  RefundQuery,
  RefundReason,
  RefundTiming,
  TrendUnit,
} from "@/features/statisticadmin/refund/types";

const timingColors = ["#2FAE9B", "#F5A623", "#EC4899"];
const cancelStageColors = ["#B8C0CC", "#F5A623", "#EC4899"];

type RawRefundSummary = {
  refundRate: number;
  netRevenue: number;
  bookingRevenue: number;
  totalRefund: number;
  refundCount: number;
  avgRefundAmount: number;
};

type RawCancelStats = {
  totalBookings: number;
  cancelCount: number;
  cancelRate: number;
  unpaidCancel: number;
  depositCancel: number;
  fullCancel: number;
  paidCancelRate: number;
};

type RawOverviewTrendPoint = {
  label: string;
  totalRevenue: number;
  refund: number;
  netRevenue: number;
};

type RawRefundTiming = {
  bucket: string;
  policyRate: number;
  count: number;
  amount: number;
};

type RawRefundReason = {
  reason: string;
  count: number;
  amount: number;
};

type RawRefundByCountry = {
  countryId: number;
  countryName: string;
  bookingCount: number;
  refundCount: number;
  refundAmount: number;
  refundRate: number;
  grade: CountryRefundRateStatus;
};

const normalizeMonthlyTrends = (
  items: RawOverviewTrendPoint[]
): RefundMonthlyTrend[] =>
  items.map((item) => ({
    month: item.label,
    grossRevenue: item.totalRevenue ?? 0,
    refundAmount: item.refund ?? 0,
    netRevenue: item.netRevenue ?? 0,
  }));

const normalizeRefundTimings = (items: RawRefundTiming[]): RefundTiming[] => {
  const totalCount = items.reduce((sum, item) => sum + Number(item.count || 0), 0);

  return items.map((item, index) => ({
    label: `${item.bucket} 취소 (${item.policyRate}% 환불)`,
    count: item.count ?? 0,
    rate: totalCount > 0 ? (Number(item.count || 0) / totalCount) * 100 : 0,
    color: timingColors[index % timingColors.length],
  }));
};

const normalizeCancellationStages = (
  raw: RawCancelStats
): CancellationStage[] => {
  const stages = [
    { label: "미결제 취소", count: raw.unpaidCancel ?? 0 },
    { label: "선금 후 취소", count: raw.depositCancel ?? 0 },
    { label: "완납 후 취소", count: raw.fullCancel ?? 0 },
  ];
  const totalCount =
    raw.cancelCount ?? stages.reduce((sum, stage) => sum + stage.count, 0);

  return stages.map((stage, index) => ({
    label: stage.label,
    count: stage.count,
    rate: totalCount > 0 ? (stage.count / totalCount) * 100 : 0,
    color: cancelStageColors[index % cancelStageColors.length],
  }));
};

const normalizeRefundReasons = (items: RawRefundReason[]): RefundReason[] => {
  const totalCount = items.reduce((sum, item) => sum + Number(item.count || 0), 0);

  return items.map((item) => ({
    reason: item.reason,
    count: item.count ?? 0,
    rate: totalCount > 0 ? (Number(item.count || 0) / totalCount) * 100 : 0,
  }));
};

// refundRate/grade는 이미 %·평가문구로 내려옴 (×100 하지 않음)
const normalizeCountryRefundRates = (
  items: RawRefundByCountry[]
): CountryRefundRate[] =>
  items.map((item) => ({
    countryName: item.countryName,
    bookingCount: item.bookingCount ?? 0,
    refundRate: item.refundRate ?? 0,
    status: item.grade,
  }));

const getRefundSummaryRaw = (query: RefundQuery, signal?: AbortSignal) =>
  adminApi.get<ApiResult<RawRefundSummary>>(
    "/api/v1/admin/stats/refund/summary",
    { params: query, suppressGlobalError: true, signal }
  );

const getCancelStatsRaw = (query: RefundQuery, signal?: AbortSignal) =>
  adminApi.get<ApiResult<RawCancelStats>>("/api/v1/admin/stats/refund/cancel", {
    params: query,
    suppressGlobalError: true,
    signal,
  });

const getOverviewTrendRaw = (
  query: RefundQuery,
  unit: TrendUnit,
  signal?: AbortSignal
) =>
  adminApi.get<ApiResult<RawOverviewTrendPoint[]>>(
    "/api/v1/admin/stats/overview/trend",
    { params: { ...query, unit }, suppressGlobalError: true, signal }
  );

const getRefundTimingRaw = (query: RefundQuery, signal?: AbortSignal) =>
  adminApi.get<ApiResult<RawRefundTiming[]>>(
    "/api/v1/admin/stats/refund/timing",
    { params: query, suppressGlobalError: true, signal }
  );

const getRefundReasonsRaw = (query: RefundQuery, signal?: AbortSignal) =>
  adminApi.get<ApiResult<RawRefundReason[]>>(
    "/api/v1/admin/stats/refund/reasons",
    { params: query, suppressGlobalError: true, signal }
  );

const getRefundByCountryRaw = (query: RefundQuery, signal?: AbortSignal) =>
  adminApi.get<ApiResult<RawRefundByCountry[]>>(
    "/api/v1/admin/stats/refund/by-country",
    { params: query, suppressGlobalError: true, signal }
  );

export const getRefundManagementData = async (
  query: RefundQuery,
  unit: TrendUnit,
  signal?: AbortSignal
): Promise<RefundManagementData> => {
  const [summaryRes, cancelRes, trendRes, timingRes, reasonsRes, byCountryRes] =
    await Promise.all([
      getRefundSummaryRaw(query, signal),
      getCancelStatsRaw(query, signal),
      getOverviewTrendRaw(query, unit, signal),
      getRefundTimingRaw(query, signal),
      getRefundReasonsRaw(query, signal),
      getRefundByCountryRaw(query, signal),
    ]);

  const summary = unwrapData(summaryRes);
  const cancel = unwrapData(cancelRes);

  return {
    summary: {
      refundRate: summary?.refundRate ?? 0,
      netRevenue: summary?.netRevenue ?? 0,
      paidCancelCount: cancel?.fullCancel ?? 0,
      paymentCancelRate: cancel?.paidCancelRate ?? 0,
    },
    monthlyTrends: normalizeMonthlyTrends(unwrapData(trendRes) ?? []),
    refundTimings: normalizeRefundTimings(unwrapData(timingRes) ?? []),
    cancellationStages: normalizeCancellationStages(cancel),
    refundReasons: normalizeRefundReasons(unwrapData(reasonsRes) ?? []),
    countryRefundRates: normalizeCountryRefundRates(unwrapData(byCountryRes) ?? []),
  };
};
