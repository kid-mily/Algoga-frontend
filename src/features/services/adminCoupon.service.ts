import { adminApi } from "@/lib/api";
import { getErrorMessage } from "@/features/common/utils/getErrorMessage";
import {
  AdminCoupon,
  AdminCouponPayload,
  AdminCouponRecord,
} from "../contentmanage/coupon/types";
import {
  getCouponCourseId,
  getCouponId,
  getCouponName,
  getIsCouponActive,
} from "../contentmanage/coupon/utils/couponFormatters";

const normalizeCoupon = (
  coupon: AdminCouponRecord,
  courseId: number
): AdminCoupon => {
  return {
    couponPolicyId: getCouponId(coupon),
    courseId: getCouponCourseId(coupon) || courseId,
    managerId: coupon.managerId,
    couponName: getCouponName(coupon),
    discountType: coupon.discountType || coupon.discount_type || "RATE",
    discountValue: coupon.discountValue || coupon.discount_value || 0,
    validDays: coupon.validDays || coupon.valid_days || 0,
    active: getIsCouponActive(coupon),
    createdAt: coupon.createdAt || coupon.created_at,
    updatedAt: coupon.updatedAt || coupon.updated_at,
  };
};

export const getAdminCoupons = async (
  courseId: number
): Promise<AdminCoupon[]> => {
  try {
    const response = await adminApi.get(
      `/api/v1/admin/courses/${courseId}/coupon-policies`,
      {
        params: { t: new Date().getTime() },
      }
    );
    const data =
      response.data.data?.content ||
      response.data.data?.couponPolicies ||
      response.data.data ||
      response.data;

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map((coupon) => normalizeCoupon(coupon, courseId));
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "쿠폰 목록 조회에 실패했습니다."));
  }
};

export const getAdminCoupon = async (
  courseId: number,
  couponPolicyId: number
): Promise<AdminCoupon> => {
  try {
    const response = await adminApi.get(
      `/api/v1/admin/courses/${courseId}/coupon-policies/${couponPolicyId}`,
      {
        params: { t: new Date().getTime() },
      }
    );
    const data =
      response.data.data?.couponPolicy ||
      response.data.data?.coupon ||
      response.data.data ||
      response.data;

    return normalizeCoupon(data, courseId);
  } catch {
    const coupons = await getAdminCoupons(courseId);
    const coupon = coupons.find(
      (item) => Number(item.couponPolicyId) === Number(couponPolicyId)
    );

    if (!coupon) {
      throw new Error("쿠폰 정보를 찾을 수 없습니다.");
    }

    return coupon;
  }
};

export const createAdminCoupon = async (
  payload: AdminCouponPayload
): Promise<AdminCoupon> => {
  try {
    const response = await adminApi.post(
      `/api/v1/admin/courses/${payload.courseId}/coupon-policies`,
      payload
    );
    const data = response.data.data || response.data;
    return normalizeCoupon(data, payload.courseId);
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "쿠폰 등록에 실패했습니다."));
  }
};

export const updateAdminCoupon = async (
  courseId: number,
  couponPolicyId: number,
  payload: AdminCouponPayload
) => {
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
    const response = await adminApi.put(
      `/api/v1/admin/courses/${courseId}/coupon-policies/${couponPolicyId}`,
      requestData
    );
    const data = response.data.data || response.data;
    return normalizeCoupon(data, courseId);
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "쿠폰 수정에 실패했습니다."));
  }
};

export const deactivateAdminCoupon = async (
  courseId: number,
  couponPolicyId: number
) => {
  try {
    console.log("[coupon:delete] DELETE", {
      url: `/api/v1/admin/courses/${courseId}/coupon-policies/${couponPolicyId}`,
      courseId,
      couponPolicyId,
    });

    const response = await adminApi.delete(
      `/api/v1/admin/courses/${courseId}/coupon-policies/${couponPolicyId}`
    );
    return response.data.data || response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "쿠폰 삭제에 실패했습니다."));
  }
};

export const deleteAdminCoupon = deactivateAdminCoupon;
