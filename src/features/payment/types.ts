import type { CourseItem } from "@/features/classroom/components/types";
import type { MyCoupon } from "@/features/mypage/benefits/components/types";

export interface SingleLecturePaymentClientProps {
  continentCode: string;
  countryId: string;
  courseId: number;
  initialCourse: CourseItem;
}

export interface SinglePaymentState {
  coupons: MyCoupon[];
  selectedCouponId: number | null;
  mileageBalance: number;
  usedMileage: number;
  isLoadingBenefits: boolean;
  isPaying: boolean;
  errorMessage: string;
}

export interface SinglePaymentPayload {
  courseId: number;
  amount: number;
  usedMileage: number;
  usedCouponId: number | null;
  portonePaymentId: string | null;
}