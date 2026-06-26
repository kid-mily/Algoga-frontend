// 공통 API 응답
export interface ApiResponse<T> {
  timestamp?: string;
  status: number;
  code: string;
  message?: string;
  data: T;
}

// 쿠폰
export type CouponDiscountType = "RATE" | "AMOUNT";

export type CouponStatus = "ISSUED" | "USED" | "EXPIRED";

export interface MyCoupon {
  userCouponId: number;
  courseId: number;
  courseTitle: string;
  couponPolicyId: number;
  couponName: string;
  discountType: CouponDiscountType;
  discountValue: number;
  status: CouponStatus;
  usable: boolean;
  issuedAt: string;
  expiredAt: string;
  usedAt: string | null;
}

// 마일리지
export type MileageHistoryType = "EARN" | "USE";

export interface MileageHistory {
  mileageHistoryId: number;
  courseId: number | null;
  courseTitle: string | null;
  amount: number;
  type: MileageHistoryType;
  reason: string;
  createdAt: string;
  expiredAt: string | null;
}

export interface MyMileage {
  totalMileage: number;
  totalEarnedMileage: number;
  totalUsedMileage: number;
  histories: MileageHistory[];
}