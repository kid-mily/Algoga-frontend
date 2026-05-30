// src/features/services/adminCoupon.service.ts

import axios from "axios";
import { adminApi } from "@/lib/api";

// 🌟 분리해두신 타입 파일 경로에 맞게 임포트 해주세요! (아래는 예시 경로입니다)
import { AdminCoupon, AdminCouponPayload } from "@/features/contentmanage/types";

// ------------------------------------------
// 공통 에러 핸들러
// ------------------------------------------
const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallbackMessage;
  }
  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }
  return fallbackMessage;
};

// ------------------------------------------
// 1. 특정 강의의 쿠폰 목록 조회 (GET)
// ------------------------------------------
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

// ------------------------------------------
// 2. 쿠폰 상세 조회 (GET)
// ------------------------------------------
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

// ------------------------------------------
// 3. 쿠폰 등록 (POST)
// ------------------------------------------
export const createAdminCoupon = async (payload: AdminCouponPayload): Promise<AdminCoupon> => {
  try {
    const response = await adminApi.post(`/api/v1/admin/courses/${payload.courseId}/coupon-policies`, payload);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error(`🔥 쿠폰 등록 에러:`, error);
    throw new Error(getErrorMessage(error, "쿠폰 등록에 실패했습니다."));
  }
};

// ------------------------------------------
// 4. 쿠폰 수정 (PUT) - 🌟 풀패키지 방어 적용
// ------------------------------------------
export const updateAdminCoupon = async (courseId: number, couponPolicyId: number, payload: AdminCouponPayload) => {
  try {
    const requestData = {
      couponPolicyId: couponPolicyId, // 바디에도 ID 추가 (백엔드 에러 방지)
      courseId: courseId,             // 바디에도 ID 추가
      couponName: payload.couponName,
      discountType: payload.discountType,
      discountValue: payload.discountValue,
      validDays: payload.validDays,
      active: payload.active
    };

    console.log(`🚀 [쿠폰 수정] 쏘는 URL: /api/v1/admin/courses/${courseId}/coupon-policies/${couponPolicyId}`);
    console.log("🚀 [쿠폰 수정] 쏘는 데이터:", requestData);

    const response = await adminApi.put(
      `/api/v1/admin/courses/${courseId}/coupon-policies/${couponPolicyId}`, 
      requestData
    );
    return response.data.data || response.data;
  } catch (error: any) {
    console.error(`🔥 쿠폰 수정 에러:`, error);
    throw new Error(getErrorMessage(error, "쿠폰 수정에 실패했습니다."));
  }
};

// ------------------------------------------
// 5. 쿠폰 삭제 (DELETE)
// ------------------------------------------
export const deleteAdminCoupon = async (courseId: number, couponPolicyId: number) => {
  try {
    console.log(`🚀 [쿠폰 삭제] 쏘는 URL: /api/v1/admin/courses/${courseId}/coupon-policies/${couponPolicyId}`);
    
    const response = await adminApi.delete(
      `/api/v1/admin/courses/${courseId}/coupon-policies/${couponPolicyId}`
    );
    return response.data;
  } catch (error: any) {
    console.error(`🔥 쿠폰 삭제 에러:`, error);
    throw new Error(getErrorMessage(error, "쿠폰 삭제에 실패했습니다."));
  }
};