import type { CouponDiscountType } from "@/features/common/types/coupon";
import { CourseItem } from "../classroom/components/types";

// 결제 요청
export interface CreateLecturePaymentPayload {
    courseId: number;
    amount: number;
    usedMileage: number;
    usedCouponId: number | null;
    portonePaymentId: string | null;
}

export interface CreateLecturePaymentPayload {
    courseId: number;
    amount: number;
    usedMileage: number;
    usedCouponId: number | null;
    portonePaymentId: string | null;
}

export type SinglePaymentPayload = CreateLecturePaymentPayload;

export interface SingleLecturePaymentClientProps {
    continentCode: string;
    countryId: string;
    courseId: number;
    initialCourse: CourseItem;    
}

// 내 쿠폰
export interface MyCoupon {
    userCouponId: number;
    courseId: number;
    courseTitle?: string;
    couponPolicyId: number;
    couponName: string;
    discountType: CouponDiscountType;
    discountValue: number;
    status: string;
    usable: boolean;
    issuedAt?: string;
    expiredAt?: string;
    usedAt?: string | null;
    }

    // 내 마일리지
    export interface MyMileage {
    totalMileage: number;
    totalEarnedMileage?: number;
    totalUsedMileage?: number;
    histories?: unknown[];
}

// 내 강의
export interface MyCourse {
    courseId: number;
    title: string;
    thumbnailUrl?: string;
    countryId: number;
    countryName?: string;
    progressRate: number;
    completedChapterCount: number;
    totalChapterCount: number;
    learningStatus: string;
    quizSubmitted: boolean;
    reviewWritten: boolean;
    certificateAvailable: boolean;
    certificateCode?: string;
    certificateDownloadUrl?: string;
    completedAt?: string;
}

// 포트원 결제 요청
export interface TossPaymentRequest {
    orderName: string;
    totalAmount: number;
    customerName?: string;
}
