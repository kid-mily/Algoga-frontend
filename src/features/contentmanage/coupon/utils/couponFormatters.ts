import {
  AdminCouponRecord,
  CouponStatusFilter,
  CouponWithLecture,
} from "../types";

export const getCouponId = (coupon: AdminCouponRecord) => {
  return (
    coupon.couponPolicyId ||
    coupon.coupon_policy_id ||
    coupon.policyId ||
    coupon.policy_id ||
    coupon.couponId ||
    coupon.coupon_id ||
    coupon.benefitId ||
    coupon.benefit_id ||
    coupon.id ||
    0
  );
};

export const getCouponCourseId = (coupon: AdminCouponRecord) => {
  return (
    coupon.courseId ||
    coupon.course_id ||
    coupon.course?.courseId ||
    coupon.course?.id ||
    0
  );
};

export const getCouponName = (coupon: AdminCouponRecord) => {
  return coupon.couponName || coupon.coupon_name || coupon.name || "-";
};

export const getIsCouponActive = (coupon: AdminCouponRecord) => {
  if (coupon.active !== undefined) {
    return coupon.active !== false && String(coupon.active) !== "false";
  }

  if (coupon.isActive !== undefined) {
    return coupon.isActive !== false && String(coupon.isActive) !== "false";
  }

  if (coupon.is_active !== undefined) {
    return coupon.is_active !== false && String(coupon.is_active) !== "false";
  }

  return coupon.status !== "INACTIVE";
};

export const formatDiscount = (coupon: AdminCouponRecord) => {
  const value = coupon.discountValue || coupon.discount_value || 0;
  const discountType = coupon.discountType || coupon.discount_type;

  return discountType === "AMOUNT"
    ? `${value.toLocaleString()}원`
    : `${value}%`;
};

export const formatValidDays = (validDays?: number) => {
  return validDays ? `${validDays}일` : "-";
};

export const formatDate = (value?: string) => {
  return value ? String(value).substring(0, 10) : "-";
};

export const filterCoupons = (
  coupons: CouponWithLecture[],
  searchTerm: string,
  statusFilter: CouponStatusFilter
) => {
  const keyword = searchTerm.trim().toLowerCase();

  return coupons.filter((coupon) => {
    const name = getCouponName(coupon).toLowerCase();
    const isActive = getIsCouponActive(coupon);

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
