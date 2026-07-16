export type CouponConversionSummary = {
  issuedCount: number;
  usedCount: number;
  usageRate: number;
  availableCount: number;
  reservationConversionRate: number;
};

export type CouponPerformance = {
  couponName: string;
  issuedCount: number;
  usedCount: number;
  usageRate: number;
};

export type LectureCouponUsage = {
  lectureTitle: string;
  usageRate: number;
};
