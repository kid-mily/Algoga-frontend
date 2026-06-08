import axios from "axios";
import { adminApi } from "@/lib/api";

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallbackMessage;
  }
  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }
  return fallbackMessage;
};

export const getAdminCoupons = async (courseId: number): Promise<any[]> => {
  try {
    const response = await adminApi.get(`/api/v1/admin/courses/${courseId}/coupon-policies`, {
      params: { t: new Date().getTime() },
    });
    const data = response.data.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    return [];
  } catch (error: any) {
    throw new Error(getErrorMessage(error, "쿠폰 목록 조회에 실패했습니다."));
  }
};

export const getAdminCoupon = async (courseId: number, couponPolicyId: number): Promise<any> => {
  try {
    const response = await adminApi.get(`/api/v1/admin/courses/${courseId}/coupon-policies/${couponPolicyId}`, {
      params: { t: new Date().getTime() },
    });
    return response.data.data || response.data;
  } catch {
    const coupons = await getAdminCoupons(courseId);
    const coupon = coupons.find((item: any) => Number(item.couponPolicyId || item.id) === couponPolicyId);
    if (!coupon) throw new Error("쿠폰 정보를 찾을 수 없습니다.");
    return coupon;
  }
};

export const createAdminCoupon = async (payload: any): Promise<any> => {
  try {
    const response = await adminApi.post(`/api/v1/admin/courses/${payload.courseId}/coupon-policies`, payload);
    return response.data.data || response.data;
  } catch (error: any) {
    throw new Error(getErrorMessage(error, "쿠폰 등록에 실패했습니다."));
  }
};

export const updateAdminCoupon = async (courseId: number, couponPolicyId: number, payload: any) => {
  try {
    const requestData = {
      couponPolicyId,
      courseId,
      couponName: payload.couponName,
      discountType: payload.discountType,
      discountValue: payload.discountValue,
      validDays: payload.validDays,
      active: payload.active,
    };
    const response = await adminApi.put(`/api/v1/admin/courses/${courseId}/coupon-policies/${couponPolicyId}`, requestData);
    return response.data.data || response.data;
  } catch (error: any) {
    throw new Error(getErrorMessage(error, "쿠폰 수정에 실패했습니다."));
  }
};

export const deactivateAdminCoupon = async (courseId: number, couponPolicyId: number) => {
  try {
    const response = await adminApi.delete(`/api/v1/admin/courses/${courseId}/coupon-policies/${couponPolicyId}`);
    return response.data.data || response.data;
  } catch {
    const current = await getAdminCoupon(courseId, couponPolicyId);
    return updateAdminCoupon(courseId, couponPolicyId, { ...current, active: false });
  }
};

export const deleteAdminCoupon = deactivateAdminCoupon;
