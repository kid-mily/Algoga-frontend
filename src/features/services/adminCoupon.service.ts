// src/features/services/adminCoupon.service.ts

import axios from "axios";
import { adminApi } from "@/lib/api";
import { AdminCoupon, AdminCouponPayload } from "../../features/contentmanage/types"    

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallbackMessage;
  }
  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }
  return fallbackMessage;
};

// 1. 특정 강의의 쿠폰 목록 조회 (GET /api/v1/admin/courses/{courseId}/coupon-policies)
export const getAdminCoupons = async (courseId: number): Promise<AdminCoupon[]> => {
  try {
    const response = await adminApi.get(`/api/v1/admin/courses/${courseId}/coupon-policies`, {
      params: { t: new Date().getTime() }, // 캐시 방지
    });
    
    const data = response.data.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    
    return [];
  } catch (error: any) {
    console.error(`🔥 쿠폰 목록 조회 에러:`, error);
    throw new Error(getErrorMessage(error, "쿠폰 목록 조회에 실패했습니다."));
  }
};

// 2. 쿠폰 상세 조회 (GET /api/v1/admin/courses/{courseId}/coupon-policies/{couponPolicyId})
export const getAdminCoupon = async (courseId: number, couponPolicyId: number): Promise<AdminCoupon> => {
  try {
    const response = await adminApi.get(`/api/v1/admin/courses/${courseId}/coupon-policies/${couponPolicyId}`, {
      params: { t: new Date().getTime() }
    });
    return response.data.data || response.data;
  } catch (error: any) {
    console.error(`🔥 쿠폰 상세 조회 에러:`, error);
    throw new Error(getErrorMessage(error, "쿠폰 상세 조회에 실패했습니다."));
  }
};

// 3. 쿠폰 등록 (POST /api/v1/admin/courses/{courseId}/coupon-policies)
export const createAdminCoupon = async (payload: AdminCouponPayload): Promise<AdminCoupon> => {
  try {
    const response = await adminApi.post(`/api/v1/admin/courses/${payload.courseId}/coupon-policies`, payload);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error(`🔥 쿠폰 등록 에러:`, error);
    throw new Error(getErrorMessage(error, "쿠폰 등록에 실패했습니다."));
  }
};
// 수정 (PUT) 요청을 이 형태로 바꿔보세요.
export const updateAdminCoupon = async (courseId: number, couponPolicyId: number, payload: AdminCouponPayload) => {
  try {
    // 🌟 핵심: 백엔드 API 명세에 따라, request body에 courseId를 포함해야 하는지 확인이 필요합니다.
    // 만약 백엔드가 단순히 쿠폰 정보만 원한다면 아래처럼 보내야 합니다.
    const response = await adminApi.put(`/api/v1/admin/coupon-policies/${couponPolicyId}`, {
      couponName: payload.couponName,
      discountType: payload.discountType,
      discountValue: payload.discountValue,
      validDays: payload.validDays,
      active: payload.active
      // courseId를 포함하지 않음 (URL에 이미 있으므로!)
    });
    return response.data.data || response.data;
  } catch (error: any) {
    throw new Error(getErrorMessage(error, "쿠폰 수정 실패"));
  }
};
// 5. 쿠폰 삭제 (DELETE)
export const deleteAdminCoupon = async (courseId: number, couponPolicyId: number) => {
  try {
    // 🌟 삭제도 마찬가지로 짧은 주소 사용!
    const response = await adminApi.delete(`/api/v1/admin/coupon-policies/${couponPolicyId}`);
    return response.data;
  } catch (error: any) {
    console.error(`🔥 쿠폰 삭제 에러:`, error);
    throw new Error(getErrorMessage(error, "쿠폰 삭제에 실패했습니다."));
  }
};