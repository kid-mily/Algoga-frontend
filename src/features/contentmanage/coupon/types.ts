export interface AdminCoupon {
  couponPolicyId: number;
  courseId: number;
  managerId?: number;
  couponName: string;
  discountType: "RATE" | "AMOUNT" | string;
  discountValue: number;
  validDays: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminCouponPayload {
  courseId: number;
  couponName: string;
  discountType: string;
  discountValue: number;
  validDays: number;
  active: boolean;
}
