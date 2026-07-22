import { adminApi, ApiResponse } from "@/lib/api";
import { AdminCoupon, AdminCouponPayload } from "../contentmanage/coupon/types";

export const getAdminCoupons = async (
  courseId: number
): Promise<AdminCoupon[]> => {
  const response = await adminApi.get<ApiResponse<AdminCoupon[]>>(
    `/api/v1/admin/courses/${courseId}/coupon-policies`,
    {
      params: { t: Date.now() },
    }
  );

  return Array.isArray(response.data) ? response.data : [];
};

export const getAdminCoupon = async (
  courseId: number,
  couponPolicyId: number
): Promise<AdminCoupon> => {
  const coupons = await getAdminCoupons(courseId);
  const coupon = coupons.find(
    (item) => Number(item.couponPolicyId) === Number(couponPolicyId)
  );

  if (!coupon) {
    throw new Error("쿠폰 정보를 찾을 수 없습니다.");
  }

  return coupon;
};

export const createAdminCoupon = async (
  payload: AdminCouponPayload
): Promise<AdminCoupon> => {
  // 백엔드 등록 DTO는 body에서 couponName/discountType/discountValue만 받는다.
  // courseId는 URL path로, percent는 discountValue(RATE=퍼센트 할인)로 전달한다.
  // validDays/active는 등록 시 받지 않고, 유효기간은 백엔드 기본값(30일)으로 처리된다.
  const response = await adminApi.post<ApiResponse<AdminCoupon>>(
    `/api/v1/admin/courses/${payload.courseId}/coupon-policies`,
    {
      couponName: payload.couponName,
      discountType: "RATE",
      discountValue: Number(payload.percent),
    }
  );

  return response.data;
};

export const updateAdminCoupon = async (
  courseId: number,
  couponPolicyId: number,
  payload: AdminCouponPayload
): Promise<AdminCoupon> => {
  const response = await adminApi.put<ApiResponse<AdminCoupon>>(
`/api/v1/admin/courses/${courseId}/coupon-policies/${couponPolicyId}`,
    {
      couponName: payload.couponName,
      discountType: "RATE",
      discountValue: Number(payload.percent),
      validDays: payload.validDays,
      active: payload.active,
    }
  );

  return response.data;
};

export const deleteAdminCoupon = async (
  courseId: number,
  couponPolicyId: number
) => {
  return adminApi.delete(
    `/api/v1/admin/courses/${courseId}/coupon-policies/${couponPolicyId}`
  );
};
