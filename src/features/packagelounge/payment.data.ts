import type { MyCoupon } from "@/features/mypage/benefits/components/types";
import type { PassengerFormData } from "./booking.types";

// 결제 페이지 디자인 확인용 더미 탑승객 정보
// (예약 페이지 입력값을 실제로 전달받는 기능은 아직 없어 임시 값을 사용합니다)
export const PAYMENT_DUMMY_PASSENGER: PassengerFormData = {
  lastName: "KIM",
  firstName: "MINJI",
  gender: "여성",
  birthDate: "2000.01.01",
  nationality: "대한민국",
  passportType: "여권",
  passportNumber: "M12345678",
  expiryDate: "2030.01.01",
};

// 패키지 결제에서 사용할 수 있는 더미 쿠폰 목록
// courseId: 0 은 특정 강의 전용이 아닌 전역(패키지 포함) 쿠폰을 의미합니다
export const PAYMENT_DUMMY_COUPONS: MyCoupon[] = [
  {
    userCouponId: 1,
    courseId: 0,
    courseTitle: "",
    couponPolicyId: 101,
    couponName: "웰컴 패키지 쿠폰 10%",
    discountType: "RATE",
    discountValue: 10,
    status: "ISSUED",
    usable: true,
    issuedAt: "2024-01-01T00:00:00Z",
    expiredAt: "2024-12-31T23:59:59Z",
    usedAt: null,
  },
  {
    userCouponId: 2,
    courseId: 0,
    courseTitle: "",
    couponPolicyId: 102,
    couponName: "여행 지원 쿠폰 20,000원",
    discountType: "AMOUNT",
    discountValue: 20000,
    status: "ISSUED",
    usable: true,
    issuedAt: "2024-01-01T00:00:00Z",
    expiredAt: "2024-12-31T23:59:59Z",
    usedAt: null,
  },
  {
    userCouponId: 3,
    courseId: 0,
    courseTitle: "",
    couponPolicyId: 103,
    couponName: "여름 패키지 특가 쿠폰 5%",
    discountType: "RATE",
    discountValue: 5,
    status: "ISSUED",
    usable: true,
    issuedAt: "2024-01-01T00:00:00Z",
    expiredAt: "2024-12-31T23:59:59Z",
    usedAt: null,
  },
  {
    userCouponId: 4,
    courseId: 0,
    courseTitle: "",
    couponPolicyId: 104,
    couponName: "신규 회원 쿠폰 10,000원",
    discountType: "AMOUNT",
    discountValue: 10000,
    status: "ISSUED",
    usable: true,
    issuedAt: "2024-01-01T00:00:00Z",
    expiredAt: "2024-12-31T23:59:59Z",
    usedAt: null,
  },
];

// 패키지 결제 페이지 디자인 확인용 더미 보유 마일리지
export const PAYMENT_DUMMY_MILEAGE_BALANCE = 126749;
