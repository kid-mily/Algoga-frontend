export type CouponStatistic = {
  couponPolicyId: number;
  couponName: string;
  discountType: "RATE" | "AMOUNT" | string;
  discountValue: number;
  courseId: number;
  courseName: string;
  countryId: number;
  countryName: string;
  issuedCount: number;
  usedCount: number;
  expiredCount: number;
  availableCount: number;
  usageRate: number;
};

export type CouponStatisticsSummary = {
  filterCourseId: number | null;
  filterCountryId: number | null;
  totalPolicyCount: number;
  totalIssuedCount: number;
  totalUsedCount: number;
  totalExpiredCount: number;
  totalAvailableCount: number;
  averageUsageRate: number;
};

export type CouponStatisticsData = {
  summary: CouponStatisticsSummary;
  statistics: CouponStatistic[];
};
