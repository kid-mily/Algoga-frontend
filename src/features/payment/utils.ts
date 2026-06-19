import type { MyCoupon } from "@/features/mypage/benefits/components/types";

export const getCouponDiscount = (
  coupon: MyCoupon | null,
  price: number
): number => {
  if (!coupon) return 0;

  if (coupon.discountType === "RATE") {
    return Math.floor((price * coupon.discountValue) / 100);
  }

  return Math.min(coupon.discountValue, price);
};

export const normalizeMileageInput = (value: string, maxMileage: number) => {
  const parsedValue = Number(value || 0);

  const nextValue = Number.isFinite(parsedValue)
    ? Math.max(0, Math.floor(parsedValue))
    : 0;

  return Math.min(nextValue, maxMileage);
};