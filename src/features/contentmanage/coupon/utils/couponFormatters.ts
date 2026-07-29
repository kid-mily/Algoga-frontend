import { AdminCoupon, CouponStatusFilter, CouponWithLecture } from "../types";

export const getCouponId = (coupon: AdminCoupon) => {
  return coupon.couponPolicyId;
};

export const getCouponCourseId = (coupon: AdminCoupon) => {
  return coupon.courseId;
};

export const getCouponName = (coupon: AdminCoupon) => {
  return coupon.couponName;
};

export const getIsCouponActive = (coupon: AdminCoupon) => {
  return coupon.active;
};

// 신 응답 discountValue 우선, 구 응답 percent 폴백.
export const getCouponDiscountValue = (coupon: AdminCoupon) =>
  coupon.discountValue ?? coupon.percent;

export const formatDiscount = (coupon: AdminCoupon) => {
  const value = getCouponDiscountValue(coupon);

  if (value == null) return "-";

  return coupon.discountType === "AMOUNT"
    ? `${value.toLocaleString()}원`
    : `${value}%`;
};

export const formatValidDays = (validDays?: number) => {
  return validDays ? `${validDays}일` : "-";
};

export const formatDate = (value?: string) => {
  return value ? value.substring(0, 10) : "-";
};

export const filterCoupons = (
  coupons: CouponWithLecture[],
  searchTerm: string,
  statusFilter: CouponStatusFilter
) => {
  const keyword = searchTerm.trim().toLowerCase();

  return coupons.filter((coupon) => {
    const name = coupon.couponName.toLowerCase();
    const isActive = coupon.active;

    const matchSearch = keyword ? name.includes(keyword) : true;
    const matchStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
          ? isActive
          : !isActive;

    return matchSearch && matchStatus;
  });
};