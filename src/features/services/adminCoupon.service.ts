import { adminApi, ApiResponse } from "@/lib/api";
import {
  AdminCoupon,
  AdminCouponPayload,
} from "../contentmanage/coupon/types";

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
  const response = await adminApi.get<ApiResponse<AdminCoupon>>(
    `/api/v1/admin/courses/${courseId}/coupon-policies/${couponPolicyId}`,
    {
      params: { t: Date.now() },
    }
  );

  return response.data;
};

export const createAdminCoupon = async (
  payload: AdminCouponPayload
): Promise<AdminCoupon> => {
  const response = await adminApi.post<ApiResponse<AdminCoupon>>(
    `/api/v1/admin/courses/${payload.courseId}/coupon-policies`,
    payload
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
      couponPolicyId,
      courseId,
      couponName: payload.couponName,
      discountType: payload.discountType,
      discountValue: payload.discountValue,
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