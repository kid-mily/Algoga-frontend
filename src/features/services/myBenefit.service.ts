import { api } from "@/lib/api";

const unwrap = <T,>(response: any, fallback: T): T => {
    const data = response?.data?.data ?? response?.data ?? fallback;
    return data ?? fallback;
};

export interface MyCoupon {
    userCouponId: number;
    courseId: number;
    courseTitle?: string;
    couponPolicyId: number;
    couponName: string;
    discountType: "RATE" | "AMOUNT" | string;
    discountValue: number;
    status: string;
    usable: boolean;
    issuedAt?: string;
    expiredAt?: string;
    usedAt?: string | null;
}

export interface MyMileage {
    totalMileage: number;
    totalEarnedMileage?: number;
    totalUsedMileage?: number;
    histories?: any[];
}

export const getMyCoupons = async (): Promise<MyCoupon[]> => {
    const response = await api.get("/api/v1/my/coupons", {
        params: { t: Date.now() },
    });
    return unwrap<MyCoupon[]>(response, []);
};

export const getUsableCouponsByCourse = async (
    courseId: number
    ): Promise<MyCoupon[]> => {
    const coupons = await getMyCoupons();
    return coupons.filter(
        (coupon) =>
        Number(coupon.courseId) === Number(courseId) &&
        coupon.usable === true &&
        String(coupon.status).toUpperCase() === "ISSUED"
    );
};

export const getMyMileage = async (): Promise<MyMileage> => {
    const response = await api.get("/api/v1/my/mileages", {
        params: { t: Date.now() },
    });
    return unwrap<MyMileage>(response, { totalMileage: 0, histories: [] });
};
