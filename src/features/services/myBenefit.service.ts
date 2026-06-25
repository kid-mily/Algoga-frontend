import { api, ApiRequestError, ApiResponse } from "@/lib/api";
import {
  MyCoupon,
  MyMileage,
} from "@/features/mypage/benefits/components/types";

export class BenefitApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "BenefitApiError";
    this.status = status;
  }
}

const initialMileage: MyMileage = {
  totalMileage: 0,
  totalEarnedMileage: 0,
  totalUsedMileage: 0,
  histories: [],
};

const unwrapBenefitData = <T>(response: ApiResponse<T>): T => {
  return response.data;
};

// 내 쿠폰 전체 조회
export const getMyCoupons = async (): Promise<MyCoupon[]> => {
  try {
    const response = await api.get<ApiResponse<MyCoupon[]>>(
      "/api/v1/my/coupons",
      {
        cache: "no-store",
        suppressGlobalError: true,
      }
    );

    return unwrapBenefitData(response) ?? [];
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw new BenefitApiError(
        error.message || "쿠폰 정보를 불러오지 못했습니다.",
        error.status
      );
    }

    throw new BenefitApiError("쿠폰 정보를 불러오지 못했습니다.");
  }
};

// 특정 강의에서 사용 가능한 쿠폰만 조회
export const getUsableCouponsByCourse = async (
  courseId: number
): Promise<MyCoupon[]> => {
  const coupons = await getMyCoupons();

  return coupons.filter((coupon) => {
    const isIssued = coupon.status === "ISSUED";
    const isUsable = coupon.usable === true;

    const isCourseCoupon = coupon.courseId === courseId;
    const isGlobalCoupon =
      coupon.courseId === null ||
      coupon.courseId === undefined ||
      coupon.courseId === 0;

    return isIssued && isUsable && (isCourseCoupon || isGlobalCoupon);
  });
};

// 내 마일리지 조회
export const getMyMileages = async (): Promise<MyMileage> => {
  try {
    const response = await api.get<ApiResponse<MyMileage>>(
      "/api/v1/my/mileages",
      {
        cache: "no-store",
        suppressGlobalError: true,
      }
    );

    return unwrapBenefitData(response) ?? initialMileage;
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw new BenefitApiError(
        error.message || "마일리지 정보를 불러오지 못했습니다.",
        error.status
      );
    }

    throw new BenefitApiError("마일리지 정보를 불러오지 못했습니다.");
  }
};