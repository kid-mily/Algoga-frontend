import type { CouponDiscountType } from "@/features/common/types/coupon";

export interface ApiResponse<T> {
  status: number;
  code: string;
  data: T;
}

/* =========================
   쿠폰
========================= */

export type CouponStatus =
  | "ISSUED"
  | "USED"
  | "EXPIRED";

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
  expiredAt: string | null;
  usedAt: string | null;
}

/* =========================
   마일리지
========================= */

export type MileageHistoryType = "EARN" | "USE";

export interface MileageHistory {
  // mileage_history_id
  mileageHistoryId: number;

  // 적립 또는 사용한 마일리지
  amount: number;

  // 관련 강의가 없으면 null
  courseId: number | null;

  // 적립 또는 사용 일시
  createdAt: string;

  // 관리자가 지급한 내역이 아니면 null일 수 있음
  managerId: number | null;

  // 적립 또는 사용 사유
  reason: string;

  // EARN: 적립, USE: 사용
  type: MileageHistoryType;

  userId: number;

  // 사용 내역이거나 만료일이 없으면 null
  expiredAt: string | null;
}

export interface MyMileage {
  totalMileage: number;
  totalEarnedMileage: number;
  totalUsedMileage: number;
  histories: MileageHistory[];
}
