import CouponReservationConversionClient from "@/features/statisticadmin/coupon-reservation-conversion/components/CouponReservationConversionClient";

export const metadata = {
  title: "쿠폰 → 예약 전환 | 알고가 통계 관리자",
  description: "통계 관리자가 쿠폰의 예약 전환 지표를 확인하는 화면입니다.",
};

export default function StatisticCouponReservationConversionPage() {
  return <CouponReservationConversionClient />;
}
