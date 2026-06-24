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

export const formatDiscount = (coupon: AdminCoupon) => {
  return coupon.discountType === "AMOUNT"
    ? `${coupon.discountValue.toLocaleString("ko-KR")}원`
    : `${coupon.discountValue}%`;
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