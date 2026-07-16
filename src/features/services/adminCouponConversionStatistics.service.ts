import { adminApi, ApiResult, unwrapData } from "@/lib/api";
import type {
  CouponConversionSummary,
  CouponPerformance,
  LectureCouponUsage,
} from "@/features/statisticadmin/coupon-reservation-conversion/types";
import type { CountryLectureConversion } from "@/features/statisticadmin/course-reservation-conversion/types";
import { getLectureCountryConversion } from "@/features/services/adminLectureConversionStatistics.service";

type RawCouponPolicyStatistics = {
  couponPolicyId: number;
  couponName: string;
  courseId: number;
  courseTitle: string;
  issuedCount: number;
  usedCount: number;
  expiredCount: number;
  availableCount: number;
};

type RawCouponStatistics = {
  totalPolicyCount: number;
  totalIssuedCouponCount: number;
  totalUsedCouponCount: number;
  totalExpiredCouponCount: number;
  totalAvailableCouponCount: number;
  policies: RawCouponPolicyStatistics[];
};

type RawCouponConversion = {
  couponUsedUsers: number;
  convertedUsers: number;
  conversionRate: number;
};

export type CouponConversionData = {
  summary: CouponConversionSummary;
  performance: CouponPerformance[];
  lectureUsage: LectureCouponUsage[];
  countries: CountryLectureConversion[];
};

const toNumber = (value: number | null | undefined) => Number(value ?? 0);

const toPercent = (used: number, issued: number) =>
  issued > 0 ? Math.round((used / issued) * 1000) / 10 : 0;

const dateInputFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

// coupon-statistics / coupon-conversion / lecture-to-trip 전부 이 페이지엔 기간 선택 UI가 없어서
// 항상 서비스 시작일부터 오늘까지(전체 기간)로 고정 조회합니다.
export const ALL_TIME_QUERY = {
  from: "2000-01-01",
  to: dateInputFormatter.format(new Date()),
};

const getCouponStatisticsRaw = (signal?: AbortSignal) =>
  adminApi.get<ApiResult<RawCouponStatistics>>("/api/v1/admin/coupon-statistics", {
    suppressGlobalError: true,
    signal,
  });

// coupon/conversion은 from/to가 필수라, 발급/사용/사용가능과 같은 범위(전체 기간)로 맞춰 호출합니다.
const getCouponConversionRaw = (signal?: AbortSignal) =>
  adminApi.get<ApiResult<RawCouponConversion>>(
    "/api/v1/admin/stats/coupon/conversion",
    { params: ALL_TIME_QUERY, suppressGlobalError: true, signal }
  );

const normalizePerformance = (
  items: RawCouponPolicyStatistics[]
): CouponPerformance[] =>
  items.map((item) => ({
    couponName: item.couponName,
    issuedCount: toNumber(item.issuedCount),
    usedCount: toNumber(item.usedCount),
    usageRate: toPercent(toNumber(item.usedCount), toNumber(item.issuedCount)),
  }));

// 백엔드가 강의별 쿠폰 사용률을 직접 안 내려줘서, 쿠폰 정책별 통계(policies)를 courseTitle 기준으로
// 합산해 계산합니다. 강의 하나에 쿠폰 정책이 여러 개 걸릴 수 있어 합산 후 사용률을 다시 계산합니다.
const normalizeLectureUsage = (
  items: RawCouponPolicyStatistics[]
): LectureCouponUsage[] => {
  const byLecture = new Map<string, { issued: number; used: number }>();

  items.forEach((item) => {
    const key = item.courseTitle || "-";
    const prev = byLecture.get(key) ?? { issued: 0, used: 0 };

    byLecture.set(key, {
      issued: prev.issued + toNumber(item.issuedCount),
      used: prev.used + toNumber(item.usedCount),
    });
  });

  return Array.from(byLecture.entries()).map(([lectureTitle, { issued, used }]) => ({
    lectureTitle,
    usageRate: toPercent(used, issued),
  }));
};

export const getCouponConversionData = async (
  signal?: AbortSignal
): Promise<CouponConversionData> => {
  const [statsRes, conversionRes, countries] = await Promise.all([
    getCouponStatisticsRaw(signal),
    getCouponConversionRaw(signal),
    getLectureCountryConversion(ALL_TIME_QUERY, signal),
  ]);

  const stats = unwrapData(statsRes);
  const conversion = unwrapData(conversionRes);
  const policies = stats?.policies ?? [];
  const issuedCount = toNumber(stats?.totalIssuedCouponCount);
  const usedCount = toNumber(stats?.totalUsedCouponCount);

  return {
    summary: {
      issuedCount,
      usedCount,
      usageRate: toPercent(usedCount, issuedCount),
      availableCount: toNumber(stats?.totalAvailableCouponCount),
      reservationConversionRate: toNumber(conversion?.conversionRate),
    },
    performance: normalizePerformance(policies),
    lectureUsage: normalizeLectureUsage(policies),
    countries,
  };
};

const buildCsv = (rows: string[][]) => {
  const escapeCell = (cell: string) => `"${cell.replace(/"/g, '""')}"`;
  const csvBody = rows.map((row) => row.map(escapeCell).join(",")).join("\n");

  return `﻿${csvBody}`;
};

const downloadCsvBlob = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

// 백엔드에 CSV 엔드포인트가 없어서, 이미 받아온 데이터로 프론트에서 직접 CSV를 생성합니다.
export const downloadLectureCouponUsageCsv = (data: LectureCouponUsage[]) => {
  const rows = [
    ["강의명", "쿠폰 사용률(%)"],
    ...data.map((item) => [item.lectureTitle, String(item.usageRate)]),
  ];

  downloadCsvBlob(buildCsv(rows), "lecture-coupon-usage.csv");
};

export const downloadCouponPerformanceCsv = (data: CouponPerformance[]) => {
  const rows = [
    ["쿠폰명", "발급", "사용", "사용률(%)"],
    ...data.map((item) => [
      item.couponName,
      String(item.issuedCount),
      String(item.usedCount),
      String(item.usageRate),
    ]),
  ];

  downloadCsvBlob(buildCsv(rows), "coupon-performance.csv");
};
