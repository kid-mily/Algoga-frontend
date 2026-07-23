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

// 단과(강의 단독) 결제는 웰컴쿠폰만 사용 가능 — 강의 완강 후 지급되는 수료 할인 쿠폰 등
// 강의 전용 쿠폰은 패키지 구매용이라 여기서는 제외한다.
// 백엔드 쿠폰 응답(GET /my/coupons)에 종류를 구분하는 필드가 따로 없어서(2026-07-23 스웨거 확인)
// couponName 문자열로 판별함 — 이름이 바뀌면 같이 바뀌어야 함
const WELCOME_COUPON_NAME = "웰컴쿠폰";

export const getWelcomeCoupon = async (): Promise<MyCoupon[]> => {
  const coupons = await getMyCoupons();

  return coupons.filter(
    (coupon) =>
      coupon.status === "ISSUED" &&
      coupon.usable === true &&
      coupon.couponName === WELCOME_COUPON_NAME
  );
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