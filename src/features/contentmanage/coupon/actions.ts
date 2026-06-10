import {
  createAdminCoupon,
  deleteAdminCoupon,
  getAdminCoupon,
  getAdminCoupons,
  updateAdminCoupon,
} from "@/features/services/adminCoupon.service";
import { AdminCouponPayload } from "./types";

export const getCouponListAction = (courseId: number) => {
  return getAdminCoupons(courseId);
};

export const getCouponDetailAction = (
  courseId: number,
  couponPolicyId: number
) => {
  return getAdminCoupon(courseId, couponPolicyId);
};

export const createCouponAction = (payload: AdminCouponPayload) => {
  return createAdminCoupon(payload);
};

export const updateCouponAction = (
  courseId: number,
  couponPolicyId: number,
  payload: AdminCouponPayload
) => {
  return updateAdminCoupon(courseId, couponPolicyId, payload);
};

export const deleteCouponAction = (
  courseId: number,
  couponPolicyId: number
) => {
  return deleteAdminCoupon(courseId, couponPolicyId);
};