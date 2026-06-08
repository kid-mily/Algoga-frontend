'use server';

import { getCourseDetail } from '@/features/services/lectureDetail.service';
import { getUsableCouponsByCourse } from '@/features/services/myBenefit.service';
import { getMyMileage } from '@/features/services/myBenefit.service';
import { createLecturePayment } from '@/features/services/SinglePayment.service';
import { MyCoupon } from '@/features/payment/types';
import { CourseItem } from '@/features/classroom/components/types';

/**
 * 결제 페이지 초기 진입 시 필요한 모든 데이터를 병렬로 로드하는 함수
 */
export async function loadPaymentData(countryId: string, courseId: number) {
    try {
        const [courseData, couponData, mileageData] = await Promise.all([
            getCourseDetail(countryId, courseId),
            // 백엔드가 500을 뱉더라도 클라이언트 화면이 아예 뻗지 않도록 방어
            getUsableCouponsByCourse(courseId).catch(() => [] as MyCoupon[]),
            getMyMileage().catch(() => ({ totalMileage: 0 })),
        ]);

        return {
            course: courseData as CourseItem | null, 
            coupons: couponData,
            mileageBalance: mileageData?.totalMileage ?? 0,
            error: null,
        };
    } catch (error: any) {
        console.error('결제 데이터 로딩 실패 (Server Action):', error);
        return {
            course: null,
            coupons: [],
            mileageBalance: 0,
            error: error?.response?.data?.message || error?.message || '결제 정보를 불러오지 못했습니다.',
        };
    }
}

interface ProcessPaymentParams {
    courseId: number;
    finalAmount: number;
    usedMileage: number;
    selectedCouponId: number | null;
    portonePaymentId: string | null;
}

/**
 * 최종 결제 내역을 백엔드 서버에 기록하고 승인
 */
export async function processLecturePayment({
    courseId,
    finalAmount,
    usedMileage,
    selectedCouponId,
    portonePaymentId,
}: ProcessPaymentParams) {
    try {
        const result = await createLecturePayment({
            courseId,
            amount: finalAmount,
            usedMileage,
            usedCouponId: selectedCouponId,
            portonePaymentId: portonePaymentId ?? "", 
        });

        return { success: true, data: result, error: null };
    } catch (error: any) {
        console.error('백엔드 결제 승인 실패 (Server Action):', error);
        return {
            success: false,
            data: null,
            error: error?.response?.data?.message || error?.message || '결제 처리에 실패했습니다.',
        };
    }
}