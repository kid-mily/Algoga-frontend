import { getMyMileage, getUsableCouponsByCourse } from "@/features/services/myBenefit.service";
import type { MyCoupon } from "@/features/mypage/benefits/components/types";
import type { SinglePaymentPayload } from "./types";

export const loadSinglePaymentBenefits = async (courseId: number) => {
    const [couponResult, mileageResult] = await Promise.allSettled([
        getUsableCouponsByCourse(courseId),
        getMyMileage(),
    ]);

    return {
        coupons:
        couponResult.status === "fulfilled"
            ? couponResult.value
            : ([] as MyCoupon[]),
        mileageBalance:
        mileageResult.status === "fulfilled"
            ? mileageResult.value.totalMileage ?? 0
            : 0,
    };
};

export const createSinglePaymentPayload = ({
    courseId,
    finalAmount,
    usedMileage,
    selectedCouponId,
    portonePaymentId,
    }: {
    courseId: number;
    finalAmount: number;
    usedMileage: number;
    selectedCouponId: number | null;
    portonePaymentId: string | null;
    }): SinglePaymentPayload => ({
    courseId,
    amount: Number(finalAmount),
    usedMileage: Number(usedMileage),
    usedCouponId:
        selectedCouponId !== null ? Number(selectedCouponId) : null,
    portonePaymentId,
});